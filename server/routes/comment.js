const router = require("express").Router()
const pool = require("../db")

//get all 

router.get("/", async (req,res) => {
    try {
        const allComments = await pool.query("SELECT * FROM comment")
        res.json(allComments.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const comment = await pool.query("SELECT * FROM comment WHERE comment_id = $1",[id])
        res.json(comment.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get by article

router.get("/article/:id", async (req,res) => {
    try {
        const {id} = req.params
        const comment = await pool.query("SELECT * FROM comment WHERE comment_article = $1",[id])
        res.json(comment.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", async (req,res) => {
    try {
        const {description,polyuser, article} = req.body
        const newComment = await pool.query("INSERT INTO comment (comment_article, comment_polyuser, comment_description) VALUES ($1, $2, $3) RETURNING *", [article, polyuser, description])
        res.json(newComment.rows[0])

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {description, likes, dislikes, polyuser, article} = req.body
        const updateComment = await pool.query("UPDATE comment SET comment_description = $2, comment_likes = $3, comment_dislikes = $4, comment_polyuser = $5, comment_article = $6, WHERE comment_id = $1",[id, description, likes, dislikes, polyuser, article])
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const deleteComment = await pool.query("DELETE FROM comment WHERE comment_id = $1",[id])
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router