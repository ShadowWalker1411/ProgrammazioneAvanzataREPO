import express, { Request, Response, NextFunction } from 'express'
import sequelize from './utils/database'

import dev from './routes/dev'
import users from './routes/users'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((request: Request, response: Response, next: NextFunction) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    console.log("This is a middleware")
    next()
})

app.get("/", (request: Request, response: Response) => {
    response.send("Hello World")
})

app.use('/dev', dev)
app.use('/users', users);

(async () => {
    try {
        await sequelize.sync({ alter: true })
        const port = process.env.EXTERNAL_PORT || 3001
        app.listen(port, () => {
            console.log("Server is running on port 3001")
        })
    } catch (error) {
        console.log(error);
    }
})()