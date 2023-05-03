const app = require('../../utils/app')
const db = require('../../utils/database')
const fs = require('fs')
const bcrypt = require("bcrypt")

app.app.get("/register/:pseudo/:email/:password", (req, res) => {
    const pseudo = req.params.pseudo;
    const email = req.params.email;
    const password = req.params.password;

    db.db.query(
        'SELECT `email` FROM `users`',
        function (err, results) {

            let emailNotDupli = false
            results.forEach(reslut => {
                if (reslut["email"] === email) return emailNotDupli = true
            })

            if (emailNotDupli) {
                res.json({message: "l'email est déjà inscrit", valide: "false"});
            } else {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, function (err, hash) {
                        db.db.query(
                            'INSERT INTO `users`(`pseudo`, `email`, `password`, `created_at`) VALUES (?, ?, ?, ?)',
                            [pseudo, email, hash, new Date()],

                            function (err, results, fields) {
                                console.log(err);
                                res.json({message: "Vous est inscrit", valide: "true"});
                            }
                        );
                    });
                })
            }
        }
    )
});