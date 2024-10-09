import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import adminrouter from './routes/adminRoute'

dotenv.config()

const app = express()
app.use(cors())

app.use('/api/admin', adminrouter)
