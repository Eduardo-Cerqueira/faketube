const app = require('../../utils/app')
const db = require('../../utils/database')

app.app.get("/updateDesc/:desc/:id", (req, res) => {
    let desc = req.params.desc
    let id = req.params.id

    db.db.query(
        'UPDATE `users` SET description=? WHERE id=?',
        [desc, id],

        function (err, result, fields) {
            res.json({newDesc: desc})
        }
    )
})