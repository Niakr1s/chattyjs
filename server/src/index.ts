import express from 'express'
import path from "path";

const app = express()

const DEV = !!process.env.DEV || false

if (!DEV) { app.use(express.static(path.join(process.cwd(), 'static')))}

app.get('/api', (req, res) => {
    res.end('Hello, world')
})

if (!DEV) { app.get('*', (req, res) => { res.sendFile(path.join(process.cwd(), 'static/index.html')) })}

app.listen(5000, () => console.log("Server started"))