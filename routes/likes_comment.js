const router = require("express").Router()
const pool = require("../db")
const auth = require("../utils/auth")
const rateLimit = require('express-rate-limit')

const Limiter = rateLimit({
	windowMs: 1000,
	max: 5,
	standardHeaders: true, 
	legacyHeaders: false, 
})

const userLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	standardHeaders: true, 
	legacyHeaders: false, 
})

//get by comment

router.get("/comment/:id", Limiter, async (req,res) => {
    try {
        const {id} = req.params
        const allLikes = await pool.query("SELECT * FROM likes_comment WHERE likes_comment = $1",[id])
        res.json(allLikes.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", Limiter, async (req,res) => {
    try {
        const {id} = req.params
        const like = await pool.query("SELECT * FROM likes_comment WHERE likes_id = $1",[id])
        if (like.rows.length === 0) {
            return res.status(403).send("Not Authorized")
        }
        else {
            res.json(like.rows[0])
        }
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", userLimiter, auth, async (req,res) => {
    try {
        const {liked, polyuser, comment} = req.body
        const user = req.polyuser
        if (user && user.toString() === polyuser.toString()) {
            const check = await pool.query("SELECT * FROM likes_comment WHERE likes_polyuser = $1 and likes_comment = $2",[user, comment])
            if (check.rows.length === 0) {
                const newLike = await pool.query("INSERT INTO likes_comment (likes_liked, likes_polyuser, likes_comment) VALUES ($1, $2, $3) RETURNING *", [liked, polyuser, comment])
                if (newLike.rows.length === 0) {
                    return res.status(403).send("Not Authorized")
                }
                else {
                    res.json(newLike.rows[0])
                }
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

router.put("/id/:id", userLimiter, auth, async (req,res) => {
    try {
        const {id} = req.params
        const {liked, polyuser, comment} = req.body
        const user = req.polyuser
        if (user && user.toString() === polyuser.toString()) {
            const updateLike = await pool.query("UPDATE likes_comment SET likes_liked = $2, likes_polyuser = $3, likes_comment = $4 WHERE likes_id = $1 and likes_polyuser = $5 RETURNING *",[id, liked, polyuser, comment, polyuser])
            if (updateLike.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                return res.status(200).send("OK")
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

router.delete("/id/:id", userLimiter, auth, async (req,res) => {
    try {
        const {id} = req.params
        const user = req.polyuser
        if (user) {
            const deleteLikes = await pool.query("DELETE FROM likes_comment WHERE likes_id = $1 and likes_polyuser = $2 RETURNING *",[id, user])
            if (deleteLikes.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                return res.status(200).send("OK")
            }
        }
        else {
            return res.status(403).send("Not Authorized")
        }
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router