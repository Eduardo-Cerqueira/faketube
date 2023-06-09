const app = require('./utils/app')


// const uploadVideo = require('./routes/recherche/uploadVideo')
const searchVideo = require('./routes/recherche/searchVideo')
const getTimelineVideo = require('./routes/Timeline/getTimelineVideo')
const getAdvancedTimelineVideo = require('./routes/Timeline/getAdvancedTimelineVideo')
const getUserSubscriptions = require('./routes/Timeline/getSubscriptions')
const searchPage = require('./routes/recherche/searchPage')
const getUserById = require('./routes/recherche_users/getUserById')
const register = require('./routes/profil/register')
const login = require('./routes/profil/login')
const updatePseudo = require('./routes/profil/updatePseudo')
const updateEmail = require('./routes/profil/updateEmail')
const getVideoChannel = require('./routes/chaine/getVideoChannel')
const uploadRoute = require('./routes/chaine/uploadRoute')
const videoRoute = require('./routes/chaine/videoRoute')
const updateDesc = require('./routes/profil/updateDesc')

const PORT = process.env.PORT || 8080;
app.app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
