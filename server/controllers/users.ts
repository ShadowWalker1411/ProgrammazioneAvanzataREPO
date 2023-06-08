import User from './../models/users'
import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import { StatusCodes } from 'http-status-codes';

// Funzione per ottenere un singolo utente per ID
const getOneById = async (id: number) => {
    const USER = await User.findByPk(id)
    return USER
}

// Funzione per ottenere i crediti di un utente per ID
const getCreds = async (id: number) => {
    const USER = await User.findByPk(id)
    return parseFloat((USER as any).credits)
}

// Funzione per ottenere tutti gli utenti
const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await User.findAll()
        return response.status(StatusCodes.OK).json(ALL)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}


// Funzione per ottenere un utente per ID
const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const USER = await getOneById(parseInt(request.params.id))
        return response.status(StatusCodes.OK).json(USER)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per creare un nuovo utente
const create = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Validazione dei dati della richiesta
        const { error, value } = createUserSchema.validate(request.body)

        if (error) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: error.details })
        }

        // Hash della password
        const hashedPassword = bcrypt.hashSync(value.password, 8)

        // Creazione dell'oggetto USER_MODEL per l'utente
        const USER_MODEL = {
            username: value.username,
            email: value.email,
            password: hashedPassword,
            admin: value.admin || false
        }

        try {
            // Creazione dell'utente nel database
            const USER = await User.create(USER_MODEL)
            return response.status(StatusCodes.CREATED).json(USER)
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}


// Funzione per aggiornare un utente per ID
const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Validazione dei dati della richiesta
        const { error, value } = updateUserSchema.validate(request.body)
        if (error) {
            return response.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message })
        }
        
        // Creazione dell'oggetto USER_MODEL per l'aggiornamento dell'utente
        const USER_MODEL: any = {
            username: value.username || undefined,
            email: value.email || undefined,
            password: value.password ? bcrypt.hashSync(value.password, 8) : undefined
        }
        
        try {
            // Aggiornamento dell'utente nel database
            const NROWS = await User.update(USER_MODEL, { where: { uid: request.params.id } })
            return response.status(StatusCodes.OK).json(NROWS)
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per eliminare un utente per ID
const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Eliminazione dell'utente dal database
        const NROWS = await User.destroy({ where: { uid: request.params.id } })
        return response.status(StatusCodes.OK).json(NROWS)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}


// Funzione per il login dell'utente
const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Trova l'utente nel database utilizzando il nome utente fornito nella richiesta
        const USER = await User.findOne({ where: { username: request.body.username } })
        
        // Confronta la password fornita nella richiesta con la password hashata dell'utente nel database
        if (bcrypt.compareSync(request.body.password, USER?.getDataValue('password'))) {
            // Genera un token di accesso utilizzando l'ID dell'utente e la chiave segreta
            const token = jwt.sign({ id: USER?.get("uid") }, process.env.SECRET_KEY || "", { expiresIn: "1h" })
            // Restituisci il token come risposta JSON con lo stato StatusCodes.OK
            return response.status(StatusCodes.OK).json({ token })
        } else {
            // La password non corrisponde, restituisci un messaggio di errore con lo stato StatusCodes.UNAUTHORIZED
            return response.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid Credentials" })
        }
    } catch (error) {
        // Si è verificato un errore, restituisci una risposta di errore con lo stato StatusCodes.INTERNAL_SERVER_ERROR
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per ottenere i crediti di un utente
const getCredits = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Ottieni i crediti dell'utente utilizzando l'ID fornito nella richiesta
        const credits = await getCreds(parseInt((request as any).uid))
        // Restituisci i crediti come risposta JSON con lo stato StatusCodes.OK
        return response.status(StatusCodes.OK).json({ "credits": credits })
    } catch (error) {
        // Si è verificato un errore, restituisci una risposta di errore con lo stato StatusCodes.INTERNAL_SERVER_ERROR
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

// Funzione per aggiungere crediti a un utente
const addCredits = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Validazione dei dati della richiesta
        const { error, value } = addCreditsSchema.validate(request.body)
        if (error) {
            return response.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message })
        }
        
        // Trova l'utente nel database utilizzando l'email fornita nella richiesta
        const USER = await User.findOne({ where: { email: request.params.email } })
        
        if (USER) {
            const currentCredits = parseFloat((USER as any).credits)
            const addedCredits = parseFloat(value.credits)
            const totalCredits = currentCredits + addedCredits
            
            if (totalCredits > 5000) {
                // Il totale dei crediti non può superare 5000, restituisci un messaggio di errore con lo stato StatusCodes.BAD_REQUEST
                return response.status(StatusCodes.BAD_REQUEST).json({ message: "Total credits cannot exceed 5000" })
            }
            
            const USER_MODEL: any = {
                credits: totalCredits
            }
            
            try {
                // Aggiorna i crediti dell'utente nel database
                const NROWS = await User.update(USER_MODEL, { where: { email: request.params.email } })
                // Restituisci il numero di righe aggiornate come risposta JSON con lo stato StatusCodes.OK
                return response.status(StatusCodes.OK).json(NROWS)
            } catch (error) {
                // Si è verificato un errore nell'aggiornamento dei crediti, restituisci una risposta di errore con lo stato StatusCodes.INTERNAL_SERVER_ERROR
                return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
            }
        } else {
            // L'utente non è stato trovato, restituisci un messaggio di errore con lo stato StatusCodes.NOT_FOUND
            return response.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
        }
    } catch (error) {
        // Si è verificato un errore, restituisci una risposta di errore con lo stato StatusCodes.INTERNAL_SERVER_ERROR
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}


const createUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(15).required()
    .messages({
          'string.alphanum': 'Il nome utente può contenere solo caratteri alfanumerici',
          'string.min': 'Il nome utente deve contenere almeno 3 caratteri',
          'string.max': 'Il nome utente può contenere al massimo 15 caratteri',
          'any.required': 'Il nome utente è obbligatorio',}),
      email: Joi.string().email().required()
      .messages({
          'string.email': 'Inserisci un indirizzo email valido',
          'any.required': 'L\'indirizzo email è obbligatorio',
      }),
      password: Joi.string().min(6).required()
      .messages({
          'string.min': 'La password deve avere almeno 6 caratteri',
          'any.required': 'La password è obbligatoria',
      }),
      admin: Joi.boolean().optional()
})

const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(15).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
    admin: Joi.boolean().optional()
})

const addCreditsSchema = Joi.object({
    credits: Joi.number().min(0).max(1000).optional(),
   // credits: Joi.number().integer().min(0).max(1000).optional(),
})

const usersController = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
    login, getCredits, addCredits, getCreds
}

export default usersController