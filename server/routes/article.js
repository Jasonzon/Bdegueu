const router = require("express").Router()
const pool = require("../db")

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
        res.json(article.rows[0])
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

router.post("/", async (req,res) => {
    try {
        const {name, type, pic, description} = req.body
        const newArticle = await pool.query("INSERT INTO article (article_name, article_type, article_pic, article_description) VALUES ($1, $2, $3, $4) RETURNING *", [name, type, pic, description])
        res.json(newArticle.rows[0])

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {name, type, pic, description} = req.body
        const updateArticle = await pool.query("UPDATE article SET article_name = $2, article_type = $3, article_pic = $4, article_description = $5 WHERE article_id = $1",[id, name, type, pic, description])
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const deleteArticle = await pool.query("DELETE FROM article WHERE article_id = $1",[id])
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router