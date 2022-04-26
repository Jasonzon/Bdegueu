const router = require("express").Router()
const pool = require("../db")

//get all 

router.get("/", async (req,res) => {
    try {
        const allEvts = await pool.query("SELECT * FROM evt")
        res.json(allEvts.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//get by id

router.get("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const evt = await pool.query("SELECT * FROM evt WHERE evt_id = $1",[id])
        res.json(evt.rows[0])
    } catch (err) {
        console.error(err.message)
    }
})

//get by name

router.get("/name/:id", async (req,res) => {
    try {
        const {id} = req.params
        const evt = await pool.query("SELECT * FROM evt WHERE evt_name = $1",[id])
        res.json(evt.rows)
    } catch (err) {
        console.error(err.message)
    }
})

//create

router.post("/", async (req,res) => {
    try {
        const {name, city, pic, description, date} = req.body
        const newEvt = await pool.query("INSERT INTO evt (evt_name, evt_city, evt_pic, evt_description, evt_date) VALUES ($1, $2, $3, $4, $5) RETURNING *", [name, city, pic, description, date])
        res.json(newEvt.rows[0])

    } catch (err) {
        console.error(err.message)
    }
})

//update

router.put("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const {name, city, pic, description, date} = req.body
        const updateEvt = await pool.query("UPDATE evt SET evt_name = $2, evt_city = $3, evt_pic = $4, evt_description = $5, evt_date = $6 WHERE evt_id = $1",[id, name, city, pic, description, date])
    } catch (err) {
        console.error(err.message)
    }
})

//delete

router.delete("/id/:id", async (req,res) => {
    try {
        const {id} = req.params
        const deleteEvt = await pool.query("DELETE FROM evt WHERE evt_id = $1",[id])
    } catch (err) {
        console.error(err.message)
    }
})

module.exports = router