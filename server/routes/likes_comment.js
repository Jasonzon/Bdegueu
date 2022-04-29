const router = require("express").Router()
const pool = require("../db")

//get by comment

router.get("/comment/:id", async (req,res) => {
    try {
        const {id} = req.params
        const allLikes = await pool.query("SELECT * FROM likes_comment WHERE likes_comment = $1",[id])
        res.json(allLikes.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const like = await pool.query("SELECT * FROM likes_comment WHERE likes_id = $1",[id])
        res.json(like.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", async (req,res) => {
    try {
        const {liked, polyuser, comment} = req.body
        const newLike = await pool.query("INSERT INTO likes_comment (likes_liked, likes_polyuser, likes_comment) VALUES ($1, $2, $3) RETURNING *", [liked, polyuser, comment])
        res.json(newLike.rows[0])

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {liked, polyuser, comment} = req.body
        const updateLike = await pool.query("UPDATE likes_comment SET likes_liked = $2, likes_polyuser = $3, likes_comment = $4 WHERE likes_id = $1",[id, liked, polyuser, comment])
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const deleteLikes = await pool.query("DELETE FROM likes_comment WHERE likes_id = $1",[id])
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router