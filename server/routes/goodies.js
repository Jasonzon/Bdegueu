const router = require("express").Router()
const pool = require("../db")

//get all 

router.get("/", async (req,res) => {
    try {
        const allGoodies = await pool.query("SELECT * FROM goodies")
        res.json(allGoodies.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const goodies = await pool.query("SELECT * FROM goodies WHERE goodies_id = $1",[id])
        res.json(goodies.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get by name

router.get("/name/:id", async (req,res) => {
    try {
        const {id} = req.params
        const goodies = await pool.query("SELECT * FROM goodies WHERE goodies_name = $1",[id])
        res.json(goodies.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", async (req,res) => {
    try {
        const {name, price, pic} = req.body
        const newGoodies = await pool.query("INSERT INTO goodies (goodies_name, goodies_price, goodies_pic) VALUES ($1, $2, $3) RETURNING *", [name, price, pic])
        res.json(newGoodies.rows[0])

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {name, price, pic} = req.body
        const updateGoodies = await pool.query("UPDATE goodies SET goodies_name = $2, goodies_price = $3, goodies_pic = $4 WHERE goodies_id = $1",[id, name, price, pic])
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const deleteGoodies = await pool.query("DELETE FROM goodies WHERE goodies_id = $1",[id])
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router