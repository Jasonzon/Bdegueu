const router = require("express").Router()
const pool = require("../db")

//get by article

router.get("/article/:id", async (req,res) => {
    try {
        const {id} = req.params
        const allLikes = await pool.query("SELECT * FROM likes_article WHERE likes_article = &1",[id])
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

router.post("/", async (req,res) => {
    try {
        const {liked, polyuser, article} = req.body
        const newLike = await pool.query("INSERT INTO likes_article (likes_liked, likes_polyuser, likes_article) VALUES ($1, $2, $3) RETURNING *", [liked, polyuser, article])
        res.json(newLike.rows[0])

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {liked, polyuser, article} = req.body
        const updateLike = await pool.query("UPDATE likes_article SET likes_liked = $2, likes_polyuser = $3, likes_article = $4 WHERE likes_id = $1",[id, liked, polyuser, article])
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const deleteLikes = await pool.query("DELETE FROM likes_article WHERE likes_id = $1",[id])
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router