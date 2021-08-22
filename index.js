require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRouter = require('./authRouter')
const errorMiddleWare = require('./middlewares/error-middleware')
const PORT = process.env.PORT

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))
app.use("/api", authRouter)
app.use(errorMiddleWare)

const start = async () => {
     try {
         await  mongoose.connect(process.env.DB_URL, {
             useNewUrlParser: true,
             useUnifiedTopology: true
         })
         app.listen(PORT, () => console.log(`server started on 🚀${PORT}🚀`))
     } catch (e) {
         console.log(e)
     }
}

start()