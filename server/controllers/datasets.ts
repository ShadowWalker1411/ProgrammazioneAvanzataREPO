import Dataset from './../models/datasets';
import usersController from './users';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import multer, { MulterError } from 'multer';
import AdmZip from 'adm-zip';
import fs from 'fs';
import { StatusCodes } from 'http-status-codes';

 
const getOneById = async (id: number) => {
    const DATASET = await Dataset.findByPk(id)
    return DATASET
}

const getAllByUseruid = async (userUID: number) => {
    const DATASETS = await Dataset.findAll({ where: { userUID: userUID } })
    return DATASETS
}

const checkCredits = async (userUID: number, numberOfFiles: number) => {
    const user = await usersController.getOneById(userUID) as any
    const currentCredits = parseFloat(user.getDataValue('credits').toFixed(1))
    if (currentCredits >= 0.1 * numberOfFiles) {
        return true
    } else {
      return false
    }
}

const removeCredits = async (userUID: number, numberOfFiles: number) => {
    const user = await usersController.getOneById(userUID) as any
    const credits = parseFloat((user.getDataValue('credits') - 0.1 * numberOfFiles).toFixed(1))
    user.setDataValue('credits', credits)
    await user.save()
}

const getAll = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const ALL = await Dataset.findAll()
        return response.status(StatusCodes.OK).json(ALL)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

const getAllMine = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const DATASETS = await getAllByUseruid(parseInt((request as any).uid))
        return response.status(StatusCodes.OK).json(DATASETS)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

const getById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const DATASET = await getOneById(parseInt(request.params.id))
        return response.status(StatusCodes.OK).json(DATASET)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

const create = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = createDatasetSchema.validate(request.body)
        if (error) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: error.details })
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
            userUID: (request as any).uid
        }
        try {
            const DATASET = await Dataset.create(DATSET_MODEL)
            return response.status(StatusCodes.CREATED).json(DATASET)
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

const updateById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { error, value } = updateDatasetSchema.validate(request.body);
        if (error) {
            return response.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message })
        }
        const DATSET_MODEL = {
            name: value.name,
            tags: value.tags,
            numClasses: value.numClasses,
        }
        try {
            const NROWS = await Dataset.update(DATSET_MODEL, { where: { uid: request.params.id } })
            if (NROWS[0] === 0) {
                return response.status(StatusCodes.NOT_FOUND).json({ message: 'Dataset not found'})
            }
            const DATASET = await Dataset.findOne({ where: { uid: request.params.id }})
            return response.status(StatusCodes.OK).json(DATASET)
        } catch (error) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
        }
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}

const deleteById = async (request: Request, response: Response, next: NextFunction) => {
    try {
        const DATASET = await Dataset.findOne({ where: { uid: request.params.id }})
        if (!DATASET) {
            return response.status(StatusCodes.NOT_FOUND).json({ message: 'Dataset not found'})
        }
        await Dataset.destroy({where: {uid: request.params.id}})
        return response.status(StatusCodes.OK).json(DATASET)
    } catch (error) {
        return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
    }
}
  
const uploadImage = async (request: Request, response: Response, next: NextFunction) => {
    // Verifica se l'utente ha abbastanza crediti
    if (await checkCredits((request as any).uid, 1)) {
        const upload = multer({
            storage: multer.diskStorage({
                destination: (request, file, cb) => {
                    cb(null, '/images')
                },
                filename: (request, file, cb) => {
                    const uid = (request as any).uid
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1]
                    const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix
                    cb(null, filename)
                },
            }),
            fileFilter: (request, file, cb) => {
                // Verifica se è un file di immagine
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                } else {
                    cb(new Error('The uploaded file is not an image.'));
                }
            },
        });

        upload.single('file')(request, response, async (err: any) => {
            if (err instanceof MulterError) {
                return response.status(StatusCodes.BAD_REQUEST).json({ error: err.message })
            } else if (err) {
                return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message })
            }

            // Verifica se è stato fornito un file
            if (!(request.file instanceof Array) && !request.file) {
                return response.status(StatusCodes.BAD_REQUEST).json({ error: 'No file was provided.' });           
            }
            // Rimuovi i crediti dall'utente dopo il caricamento
            await removeCredits((request as any).uid, 1);
            return response.status(StatusCodes.OK).json({ message: 'Upload completed successfully' })
        });
    } else {
        return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Insufficient credits' })
    }
};

const uploadImages = async (request: Request, response: Response, next: NextFunction) => {
    // Verifica se l'utente ha abbastanza crediti
    if (await checkCredits((request as any).uid, (request as any).files?.length || 0)) {
        // Controlla se ci sono file da caricare
        const storage = multer.diskStorage({
            destination: (request, file, cb) => {
                cb(null, '/images');
            },
            filename: (request, file, cb) => {
                const uid = (request as any).uid;
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
                const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix;
                cb(null, filename);
            },
        });
        const uploads = multer({ storage, 
            fileFilter: (request, file, cb) => {
                // Verifica se è un file di immagine
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                } else {
                    cb(new Error('The uploaded file are not an image.'));
                }
            }
        });

        uploads.array('files')(request, response, async (err: any) => {
            if (err instanceof MulterError) {
                return response.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
            } else if (err) {
                return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
            }

            if (!request.files || !(request.files instanceof Array)) {
                return response.status(StatusCodes.BAD_REQUEST).json({ error: 'No file was provided.' });           
            }
            
            // Rimuovi i crediti dall'utente dopo il caricamento
            await removeCredits((request as any).uid, (request as any).files?.length || 0);
            return response.status(StatusCodes.OK).json({ message: 'Upload completed successfully' });
        });
    } else {
      return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Insufficient credits' });
    }
};  

const uploadZip = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.memoryStorage();
    const uploads = multer({ storage }).any();

    uploads(request, response, async (err: any) => {
        if (err instanceof multer.MulterError) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
        } else if (err) {
            return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
        }

        // Verifica se ci sono file da caricare
        if (!request.files || request.files.length === 0) {
            return response.status(StatusCodes.BAD_REQUEST).json({ error: 'No file to upload' });
        }

        const uploadedFiles = [];

        // Itera su ogni file
        for (const file of request.files as Express.Multer.File[]) {
            if (file.mimetype !== 'application/zip') {
                return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid file format. Only zip files are allowed'});
            }

            const zip = new AdmZip(file.buffer);
            const zipEntries = zip.getEntries();

            if (await checkCredits((request as any).uid, zipEntries.length)) {
                // Itera su ogni file all'interno della zip
                for (const zipEntry of zipEntries) {
                    // Estrai il nome del file e l'estensione
                    const fileName = zipEntry.entryName.split('/').pop();
                    if (!fileName) {
                        continue; 
                    }
                    const fileExtension = fileName.split('.').pop();

                    // Verifica se il file è un'immagine diversamente dalle singole immagini dove controllo il mimetype
                    const imageExtensions = ['jpg', 'jpeg', 'png'];
                    if (!fileExtension || !imageExtensions.includes(fileExtension.toLowerCase())) {
                        return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid file format. Only images are allowed within the zip' });
                    }

                    // Genera un nuovo nome per il file
                    const uid = (request as any).uid;
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const newFileName = 'file-' + uid + '-' + uniqueSuffix + '.' + fileExtension;
                    
                    // Salva il file con il nuovo nome
                    const filePath = '/images/' + newFileName;                   
                    fs.writeFileSync(filePath, zipEntry.getData());
                    uploadedFiles.push(filePath);
                }
            } else {
                return response.status(StatusCodes.BAD_REQUEST).json({ error: 'Insufficient credits' });
            }
        }

        await removeCredits((request as any).uid, uploadedFiles.length);
        return response.status(StatusCodes.OK).json({ message: 'Upload completed successfully', files: uploadedFiles });
    });
};

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