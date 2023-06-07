import User from './../models/users';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { FLOAT } from 'sequelize';

const getOneById = async (id: number) => {
    const USER = await User.findByPk(id)
    return USER
}

const getCreds = async (id: number) => {
    const USER = await User.findByPk(id)
    return parseFloat((USER as any).credits)
}

const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await User.findAll()
        return response.status(200).json(ALL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const USER = await getOneById(parseInt(request.params.id))
        return response.status(200).json(USER)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const create = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { error, value } = createUserSchema.validate(request.body);

    if (error) {
      return response.status(400).json({ error: error.details });
    }

    const hashedPassword = bcrypt.hashSync(value.password, 8);

    const USER_MODEL = {
      username: value.username,
      email: value.email,
      password: hashedPassword,
      admin: value.admin || false
    };

    try {
      const USER = await User.create(USER_MODEL);
      return response.status(201).json(USER);
    } catch (error) {
      return response.status(500).json(error);
    }
  } catch (error) {
    return response.status(500).json(error);
  }
};

const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = updateUserSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message });
        }
        
        const USER_MODEL: any = {
            username: value.username || undefined,
            email: value.email || undefined,
            password: value.password ? bcrypt.hashSync(value.password, 8) : undefined
        }
        
        try {
            const NROWS = await User.update(USER_MODEL, { where: { UID: request.params.id } })
            return response.status(200).json(NROWS)
        } catch (error) {
            return response.status(500).json(error)
        }
    } catch (error) {
        return response.status(500).json(error)
    }
};

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await User.destroy({where: {UID: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const USER = await User.findOne({where: {username: request.body.username}})
        if(bcrypt.compareSync(request.body.password, USER?.getDataValue('password'))){
            const token = jwt.sign({ id: USER?.get("UID") }, process.env.SECRET_KEY || "", {expiresIn: "1h"})
            return response.status(200).json({token})
        }else{
            return response.status(401).json({message: "Invalid Credentials"})
        }
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getCredits = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const credits = await getCreds(parseInt((request as any).UID))
        return response.status(200).json({"credits": credits})
    } catch (error) {
        return response.status(500).json(error)
    }
}

const addCredits = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = addCreditsSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message })
        }
        const USER = await User.findOne({where: {email: request.params.email}})
        if (USER) {
            const currentCredits = parseFloat((USER as any).credits)
            const addedCredits = parseFloat(value.credits)
            const totalCredits = currentCredits + addedCredits
            if (totalCredits > 5000) {
                return response.status(400).json({ message: "Total credits cannot exceed 5000" })
            }
            const USER_MODEL: any = {
                credits: totalCredits
            };
            try {
                const NROWS = await User.update(USER_MODEL, { where: { email: request.params.email } })
                return response.status(200).json(NROWS)
            } catch (error) {
                return response.status(500).json(error)
            }
        } else {
            return response.status(404).json({ message: "User not found" })
        }
    } catch (error) {
        return response.status(500).json(error)
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
});

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

export default usersController;