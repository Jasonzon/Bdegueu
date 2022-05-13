const router = require("express").Router()
const pool = require("../db")
const auth = require("../utils/auth")

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
        if (comment.rows.length === 0) {
            return res.status(403).send("Not Authorized")
        }
        else {
            res.json(comment.rows[0])
        }
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

router.post("/", auth, async (req,res) => {
    try {
        const {description,article} = req.body
        const user = req.polyuser
        if (user) {
            const newComment = await pool.query("INSERT INTO comment (comment_article, comment_polyuser, comment_description) VALUES ($1, $2, $3) RETURNING *", [article, user, description])
            if (newComment.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(newComment.rows[0])
            }
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
        if (user && req.role === "basic") {
            const deleteComment = await pool.query("DELETE FROM comment WHERE comment_id = $1 and comment_polyuser = $2 RETURNING *",[id, user])
            if (deleteComment.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(deleteComment.rows[0])
            }
        }
        else {
            if (user && req.role === "admin") {
                const deleteComment = await pool.query("DELETE FROM comment WHERE comment_id = $1 RETURNING *",[id])
                if (deleteComment.rows.length === 0) {
                    return res.status(403).send("Not Authorized")
                }
                else {
                    res.json(deleteComment.rows[0])
                }
            }
            else {
                return res.status(403).send("Not Authorized")
            }
        }
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router