import User from './../models/users';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const getOneById = async (id: number) => {
    const USER = await User.findByPk(id)
    return USER
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

const createUserSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(15).required()
  .messages({
    'string.alphanum': 'Il nome utente può contenere solo caratteri alfanumerici',
    'string.min': 'Il nome utente deve contenere almeno 3 caratteri',
    'string.max': 'Il nome utente può contenere al massimo 15 caratteri',
    'any.required': 'Il nome utente è obbligatorio',}),
  email: Joi.string().email().required()
  .custom((value, helpers) => {
    if (!value.includes('@')) {
      return helpers.error('any.invalid');
    }
    return value;
  })
  .messages({
    'any.invalid': 'L\'indirizzo email deve contenere il simbolo "@"',
    'string.email': 'Inserisci un indirizzo email valido',
    'any.required': 'L\'indirizzo email è obbligatorio',
    
  }),
  password: Joi.string().min(6).required()
  .messages({
    'string.min': 'La password deve avere almeno 6 caratteri',
    'any.required': 'La password è obbligatoria',
  }),
});

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


const updateUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(15).optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().min(6).optional(),
  });
  
  const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { error, value } = updateUserSchema.validate(request.body);
      if (error) {
        return response.status(400).json({ message: error.details[0].message });
      }
      
      const USER_MODEL: any = {
        username: value.username || undefined,
        email: value.email || undefined,
        password: value.password ? bcrypt.hashSync(value.password, 8) : undefined,
      };
      
      try {
        const NROWS = await User.update(USER_MODEL, { where: { id: request.params.id } });
        return response.status(200).json(NROWS);
      } catch (error) {
        return response.status(500).json(error);
      }
    } catch (error) {
      return response.status(500).json(error);
    }
  };
  
  

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await User.destroy({where: {id: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const login = async (request: Request, response: Response, next: NextFunction) => {
    try {
        
        const USER = await User.findOne({where: {username: request.body.username}})
        console.log(USER?.getDataValue('password'))
        console.log(request.body.password)
        if(bcrypt.compareSync(request.body.password, USER?.getDataValue('password'))){
            const token = jwt.sign({ id: USER?.get("id") }, process.env.SECRET_KEY || "", {expiresIn: "1h"})
        return response.status(200).json({token})
        }else{
            return response.status(401).json({message: "Invalid Credentials"})
        }
    } catch (error) {
        return response.status(500).json(error)
    }
}
const controller = {
    getAll,
    getById, getOneById,
    create,
    updateById,
    deleteById,
    login
}

export default controller;