const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")
const PORT = process.env.PORT || 5000

//middlewares

app.use(cors())
app.use(express.json())

app.use("/polyuser", require("./routes/polyuser"))

app.use("/article", require("./routes/article"))

app.use("/comment", require("./routes/comment"))

app.use("/evt", require("./routes/evt"))

app.use("/goodies", require("./routes/goodies"))

app.use("/likes_article", require("./routes/likes_article"))

app.use("/likes_comment", require("./routes/likes_comment"))


app.listen(PORT, () => {
    console.log(`Server is starting on port 5000`)
})