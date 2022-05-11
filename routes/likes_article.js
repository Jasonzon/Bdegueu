const router = require("express").Router()
const pool = require("../db")
const auth = require("../utils/auth")

//get by article

router.get("/article/:id", async (req,res) => {
    try {
        const {id} = req.params
        const allLikes = await pool.query("SELECT * FROM likes_article WHERE likes_article = $1",[id])
        res.json(allLikes.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const like = await pool.query("SELECT * FROM likes_article WHERE likes_id = $1",[id])
        res.json(like.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", auth, async (req,res) => {
    try {
        const {liked, polyuser, article} = req.body
        if (req.polyuser) {
            const check = await pool.query("SELECT * FROM likes_article WHERE likes_polyuser = $1 and likes_article = $2",[polyuser, article])
            if (check.rows.length === 0) {
                const newLike = await pool.query("INSERT INTO likes_article (likes_liked, likes_polyuser, likes_article) VALUES ($1, $2, $3) RETURNING *", [liked, polyuser, article])
                res.json(newLike.rows[0])
            }
            else {
                return res.status(403).send("Not Authorized")
            }
        }
        else {
            return res.status(403).send("Not Authorized")
        }

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", auth, async (req,res) => {
    try {
        const {id} = req.params
        const {liked, polyuser, article} = req.body
        const user = req.polyuser
        if (user && user.toString() === polyuser.toString()) {
            const updateLike = await pool.query("UPDATE likes_article SET likes_liked = $2, likes_polyuser = $3, likes_article = $4 WHERE likes_id = $1 and likes_polyuser = $5",[id, liked, polyuser, article, polyuser])
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", auth, async (req,res) => {
    try {
        const {id} = req.params
        const user = req.polyuser
        const {polyuser} = req.body
        if (user && user.toString() === polyuser.toString()) {
            const deleteLikes = await pool.query("DELETE FROM likes_article WHERE likes_id = $1 and likes_polyuser = $2",[id, user])
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router