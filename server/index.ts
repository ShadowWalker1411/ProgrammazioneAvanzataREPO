// Importazione dei moduli e delle librerie necessarie
import express, { Request, Response, NextFunction } from 'express'
import sequelize from './utils/database'

import users from './routes/users'
import datasets from './routes/datasets'
import models from './routes/models'

// Creazione di un'istanza di Express
const app = express()

// Parsificazione del corpo delle richieste come JSON
app.use(express.json())

// Parsificazione dei dati codificati nell'URL
app.use(express.urlencoded({ extended: true }))

// Middleware per impostare gli header CORS
app.use((request: Request, response: Response, next: NextFunction) => {
    response.set('Access-Control-Allow-Origin', '*')
    response.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
})

// Gestione della route per il percorso radice
app.get("/", (request: Request, response: Response) => {
    response.send("Ciao mondo!")
})

// Montaggio delle routes
app.use('/users', users);
app.use('/datasets', datasets);
app.use('/models', models);

// Funzione per avviare il server
(async () => {
    try {
        // Sincronizzazione dei modelli Sequelize con il database
        await sequelize.sync({ alter: true })

        // Impostazione della porta
        const port = process.env.EXTERNAL_PORT || 3001

        // Avvio del server
        app.listen(port, () => {
            console.log("Il server è in esecuzione sulla porta 3001")
        })
    } catch (error) {
        console.log(error);
    }
})()
