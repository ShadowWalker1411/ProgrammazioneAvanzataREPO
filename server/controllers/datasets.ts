import Dataset from './../models/datasets';
import usersController from './users';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import multer, { MulterError } from 'multer';
import AdmZip from 'adm-zip';
 import fs from 'fs';
 
const getOneById = async (id: number) => {
    const DATASET = await Dataset.findByPk(id)
    return DATASET
}

const getAllByUseruid = async (useruid: number) => {
    const DATASETS = await Dataset.findAll({ where: { useruid: useruid } })
    return DATASETS
}

const checkCredits = async (useruid: number, numberOfFiles: number) => {
    const user = await usersController.getOneById(useruid) as any
    const currentCredits = parseFloat(user.getDataValue('credits').toFixed(1))
    if (currentCredits >= 0.1 * numberOfFiles) {
        return true
    } else {
      return false
    }
}

const removeCredits = async (useruid: number, numberOfFiles: number) => {
    const user = await usersController.getOneById(useruid) as any
    const credits = parseFloat((user.getDataValue('credits') - 0.1 * numberOfFiles).toFixed(1))
    user.setDataValue('credits', credits)
    await user.save()
}

const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await Dataset.findAll()
        return response.status(200).json(ALL)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getAllMine = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const DATASETS = await getAllByUseruid(parseInt((request as any).uid))
        return response.status(200).json(DATASETS)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const DATASET = await getOneById(parseInt(request.params.id))
        return response.status(200).json(DATASET)
    } catch (error) {
        return response.status(500).json(error)
    }
}

const create = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = createDatasetSchema.validate(request.body)
        if (error) {
            return response.status(400).json({ error: error.details })
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
            useruid: (request as any).uid
        }
        try {
            const DATASET = await Dataset.create(DATSET_MODEL)
            return response.status(201).json(DATASET)
        } catch (error) {
            return response.status(500).json(error)
        }
    } catch (error) {
        return response.status(500).json(error)
    }
}

const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = updateDatasetSchema.validate(request.body);
        if (error) {
            return response.status(400).json({ message: error.details[0].message })
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
        }
        try {
            const NROWS = await Dataset.update(DATSET_MODEL, { where: { uid: request.params.id } })
            return response.status(200).json(NROWS)
        } catch (error) {
            return response.status(500).json(error)
        }
    } catch (error) {
        return response.status(500).json(error)
    }
}

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const NROWS = await Dataset.destroy({where: {uid: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}
  
const uploadImage = async (request: Request, response: Response, next: NextFunction) => {
    // Verifica se l'utente ha abbastanza crediti
    if (await checkCredits((request as any).uid, 1)) {
        const storage = multer.diskStorage({
            destination: (request, file, cb) => {
                cb(null, '/images')
            },
            filename: (request, file, cb) => {
                const uid = (request as any).uid
                const uniqueSuffix = Date.now() + '-'  + Math.round(Math.random() * 1E9) + '.' +  file.mimetype.split('/')[1]         
                const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix
                cb(null, filename)
            },
        })

        const upload = multer({ storage })
        upload.single('file')(request, response, async (err: any) => {
            if (err instanceof MulterError) {
                return response.status(400).json({ error: err.message })
            } else if (err) {
                return response.status(500).json({ error1: err.message })
            }

            
            // Rimuovi i crediti dall'utente dopo il caricamento
            await removeCredits((request as any).uid, 1)
            return response.status(200).json({ message: 'Caricamento effettuato con successo' })
        })
    } else {
        return response.status(400).json({ error: 'Crediti insufficienti' })
    }
}


const uploadImages = async (request: Request, response: Response, next: NextFunction) => {
    // Verifica se l'utente ha abbastanza crediti
    if (await checkCredits((request as any).uid, request.body.files.length)) {
        // Controlla se ci sono file da caricare
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({ error: 'Nessun file da caricare' })
        }

        const storage = multer.diskStorage({
            destination: (request, file, cb) => {
                cb(null, '/images')
            },
            filename: (request, file, cb) => {
                const uid = (request as any).uid
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1]
                const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix
                cb(null, filename)
            },
        });

        const uploads = multer({ storage })
        uploads.array('files')(request, response, async (err: any) => {
            if (err instanceof MulterError) {
                return response.status(400).json({ error: err.message })
            } else if (err) {
                return response.status(500).json({ error: err.message })
            }

            // Rimuovi i crediti dall'utente dopo il caricamento
            await removeCredits((request as any).uid, request.body.files.length)
            return response.status(200).json({ message: 'Caricamento effettuato con successo' })
        })
    } else {
        return response.status(400).json({ error: 'Crediti insufficienti' })
    }
};




const uploadZip = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.memoryStorage() //N.B prima usavamo disk, invece ora salvo temporanemante
    const uploads = multer({ storage }).any()

    uploads(request, response, async (err: any) => {
        if (err instanceof multer.MulterError) {
            return response.status(400).json({ error: err.message })
        } else if (err) {
          return response.status(500).json({ error: err.message })
        }
        //Controllo ci sia qualcosa da uploadare
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({ error: 'No files uploaded' })
        }

        const uploadedFiles = []

        // leggo 1 a 1 i file
        for (const file of request.files as Express.Multer.File[]) {
            if (file.mimetype !== 'application/zip') {
              return response.status(400).json({ error: 'Invalid file format. Only zip files are allowed' });
            }

            const zip = new AdmZip(file.buffer)
            const zipEntries = zip.getEntries()

            if (await checkCredits((request as any).uid, zipEntries.length)) {
                // Leggo i singoli file nella zip
                for (const zipEntry of zipEntries) {
                    // Extract the file name and extension
                    const fileName = zipEntry.entryName.split('/').pop()
                    if (!fileName) {
                    continue; 
                    }
                    const fileExtension = fileName.split('.').pop()

                    // rinomino i singoli file
                    const uid = (request as any).uid
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                    const newFileName = `file-${uid}-${uniqueSuffix}.${fileExtension}`

                    // salvo col nuovo nome
                    const filePath = `/images/${newFileName}`
                    fs.writeFileSync(filePath, zipEntry.getData())
                    
                    uploadedFiles.push(filePath)
                }
            } else {
                return response.status(400).json({ error: 'Not enough credits' })
            }
        }
        await removeCredits((request as any).uid, uploadedFiles.length)
        return response.status(200).json({ message: 'Upload successful', files: uploadedFiles })
    })
}

const createDatasetSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    tags: Joi.number().min(0).max(1023).required(),
    numClasses: Joi.number().min(0).max(255).required()
})


const updateDatasetSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).optional(),
    tags: Joi.number().min(0).max(1023).optional(),
    numClasses: Joi.number().min(0).max(255).optional()
})

const datasetsController = {
    getAll, getAllMine,
    getById, getOneById, getAllByUseruid,
    create,
    updateById,
    deleteById,
    uploadImage,
    uploadImages,
    uploadZip
}

export default datasetsController;