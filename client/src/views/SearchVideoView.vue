<script setup>
import { reactive, ref, onMounted, computed, watch } from 'vue';
import { useFetch } from "@vueuse/core";
import * as dayjs from 'dayjs';
import { useRoute } from 'vue-router';
import SearchFilter from '../components/recherche/SearchFilter.vue'

// Requête sur le serveur
const route = useRoute()
const publisherName = reactive({})
const dateDiff = reactive({})


function checkChannel(channel, words) {
    // Fetch
    let score = 0
    words.forEach(word => {
        if (word.toLowerCase() == channel.toLowerCase()) {
            score += 500;
        }
    })
    return score;

}

function checkTitle(title, words) {


let score = 0
let wordsSplitted = words[0].split(" ")
wordsSplitted.forEach(word => {
    if (title.toLowerCase().includes(word.toLowerCase())) {
        score += 100;
    }
})
return score;

}

function checkTag(tags, userResearch) {
    let score = 0
    let listTags = tags.split(" ")
    listTags.forEach(tag => {
        if (userResearch.toLowerCase().includes(tag.toLowerCase())) {
            score += 75;
        }
    })
    return score;
}

function checkDescription(description, words) {
    let score = 0
    words.forEach(word => {
        if (description.toLowerCase().includes(word.toLowerCase())) {
            score += 25;
        }
    })
    return score;
}

function checkDateScore(uploadDate) {
    let score = 0
    let dateDiffScore = dayjs().diff(dayjs(uploadDate), "day")
    if (dateDiffScore <= 1) {
        score += 50;
    }
    else if (dateDiffScore <= 7) {
        score += 30;
    }
    return score
}

function checkViewsOrSubscribers(number) {
    let score = 0
    if (number >= 10) {
        score += 30
    }
    return score;
}

async function checkDate(uploadDate) {
    let dateDiffsec = dayjs().diff(dayjs(uploadDate), "second")
    if (dateDiffsec <= 60) {
        dateDiff[uploadDate] = `${dateDiffsec} secondes`
    }
    else {
        let dateDiffmin = dayjs().diff(dayjs(uploadDate), "minute")
        if (dateDiffmin > 60) {
            let dateDiffhour = dayjs().diff(dayjs(uploadDate), "hour")
            if (dateDiffhour > 24) {
                let dateDiffday = dayjs().diff(dayjs(uploadDate), "day")
                dateDiff[uploadDate] = `${dateDiffday} jours`
            }
            else {
                dateDiff[uploadDate] = `${dateDiffhour} heures`
            }
        }
        else {
            dateDiff[uploadDate] = `${dateDiffmin} minutes`
        }
    }
}

async function getInfoUser(userId) {
    const { isFetching, error, data } = await useFetch('http://localhost:8080/getUserById/' + userId)
    return JSON.parse(data.value)
}

async function getVideosAdvanced(filter) {
    const { isFetching, error, data } = await useFetch('http://localhost:8080/searchVideoAdvanced/' + filter)
    return JSON.parse(data.value)
}

async function UserBot(user) {
    let userInfo = await getInfoUser(user)
    publisherName[user] = userInfo.message[0] 
}

async function getVideos() {
    const { isFetching, error, data } = await useFetch('http://localhost:8080/searchVideo')
    return JSON.parse(data.value)
}

async function getVideoScore(video, userResearch) {
    let score = 0
    let infosUser = await getInfoUser(video.publisher_id)

    publisherName[video.publisher_id] = infosUser.message[0]
    let words = userResearch.split("%20")

    //Channel
    score += checkChannel(infosUser.message[0].pseudo, words)
    //Title
    score += checkTitle(video.title, words)
    //Tags
    score += checkTag(video.tags, userResearch)
    //Description
    score += checkDescription(video.description, words)
    //Date
    score += checkDateScore(video.created_at)
    //Views
    score += checkViewsOrSubscribers(video.views)
    //Subscribers
    score += checkViewsOrSubscribers(infosUser.message[0].subscriber_number)

    return score

}
const videoScores = ref([])
const routeParams = ref(route.params.userResearch)
onMounted(async () => {

    //Verifier si filter 
    //Si filter videosAdvanced -> sinon videos
    // const videosFiltered = await getVideosAdvanced("last-day")
    // console.log(videosFiltered);

    const videosInfos = await getVideos()

    const promises = videosInfos.message.map((info) => {
        return getVideoScore(info, routeParams.value)
    })
    const score = await Promise.all(promises)
    videoScores.value = videosInfos.message.map((info, index) => {

        if(score[index]>100){
            console.log({video: info, score: score[index]});
        }
        return { video: info, score: score[index] }
    }).filter((item) => item.score >= 100)
    
    videoScores.value.sort((a, b) => b.score - a.score);

    console.log(videoScores.value);
    for (let video of videoScores.value){
        await UserBot(video.video.publisher_id)
        await checkDate(video.video.created_at)
    }
});

watch(()=> route.params.userResearch,async (newUserResearch)=> {
    const videosInfos = await getVideos()
    console.log(videosInfos.value);

    const promises = videosInfos.message.map((info) => {
        return getVideoScore(info, newUserResearch)
    })
    const score = await Promise.all(promises)
    videoScores.value = videosInfos.message.map((info, index) => {
        return { video: info, score: score[index] }
    }).filter((item) => item.score >= 100)
    
    videoScores.value.sort((a, b) => b.score - a.score);

    for (let video of videoScores.value){
        await UserBot(video.video.publisher_id)
        await checkDate(video.video.created_at)
    }
})



</script>

<template>
    <div class="main-container flex flex-col w-full">
        <SearchFilter></SearchFilter>
        <div class="bg-zinc-800 max-w-full ml-20 mt-10 flex flex-col gap-y-4">

            <div v-for="(video, index) in videoScores" :key="index">
                <router-link :to="{name: 'watch', params: {id: video.video.id}}" class="bg-gray shadow overflow-hidden sm:rounded-lg flex max-sm:flex-col">
                  <div class="aspect-w-16 aspect-h-9 flex-shrink-0">
                    <img class="object-cover w-80 h-48 max-md:w-56 max-md:h-32 rounded-2xl" :src="`http://localhost:8080/thumbnail/${video.video.id}`"

                        alt="Miniature de la vidéo">
                </div>
                <div class="p-4 flex-grow flex flex-col justify-center">
                    <h3 class="text-white text-xl font-bold mb-2">{{ video.video.title }}</h3>
                    <div class="views-date flex gap-2">
                        <p class="text-gray-500 text-sm">{{ video.video.views }} vues</p>
                        <p class="text-gray-500 text-sm">• il y a {{ dateDiff[video.video.created_at] }}</p>
                    </div>
                    <div class="views-date flex gap-2 mt-3">
                        <img class="object-cover rounded-full w-8 h-8"
                            :src="publisherName[video.video.publisher_id]?.profile_photo" alt="Image de la chaine">
                        <p class="text-gray-500 text-sm flex items-center">{{ publisherName[video.video.publisher_id]?.pseudo ??
                            'Nom inconnu' }} chaine</p>
                    </div>

                </div>


                </router-link>
                

            </div>
    </div>
</div></template>