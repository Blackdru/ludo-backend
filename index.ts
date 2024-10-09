import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import adminRouter from './routes/adminRoute'
import contestRouter from './routes/contestRoute'

dotenv.config()

const app = express()
app.use(cors())

app.use('/api/admin', adminRouter)
app.use('/api/contest', contestRouter)
