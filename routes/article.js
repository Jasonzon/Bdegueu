const router = require("express").Router()
const pool = require("../db")
const auth = require("../utils/auth")

//get all 

router.get("/", async (req,res) => {
    try {
        const allArticles = await pool.query("SELECT * FROM article")
        res.json(allArticles.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const article = await pool.query("SELECT * FROM article WHERE article_id = $1",[id])
        if (article.rows.length === 0) {
            return res.status(403).send("Not Authorized")
        }
        else {
            res.json(article.rows[0])
        }
    } catch (err) {
        console.error(err.message)
    }
})

//get by name

router.get("/name/:id", async (req,res) => {
    try {
        const {id} = req.params
        const article = await pool.query("SELECT * FROM article WHERE article_name = $1",[id])
        res.json(article.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", auth, async (req,res) => {
    try {
        const {name, type, pic, description} = req.body
        if (req.polyuser && req.role === "admin") {
            const newArticle = await pool.query("INSERT INTO article (article_name, article_type, article_pic, article_description) VALUES ($1, $2, $3, $4) RETURNING *", [name, type, pic, description])
            if (newArticle.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(newArticle.rows[0])
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
        const {name, type, pic, description} = req.body
        if (req.polyuser && req.role === "admin") {
            const updateArticle = await pool.query("UPDATE article SET article_name = $2, article_type = $3, article_pic = $4, article_description = $5 WHERE article_id = $1 RETURNING *",[id, name, type, pic, description])
            if (updateArticle.rows.length === 0) {
                return res.status(403).send("Not Authorized")
            }
            else {
                res.json(updateArticle.rows[0])
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
        if (req.polyuser && req.role === "admin") {
            const deleteArticle = await pool.query("DELETE FROM article WHERE article_id = $1 RETURNING *",[id])
            if (deleteArticle.rows.length === 0) {
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