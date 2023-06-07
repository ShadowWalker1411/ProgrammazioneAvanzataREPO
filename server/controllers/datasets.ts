import Dataset from './../models/datasets';
import User from '../models/users';
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import multer, { Multer } from 'multer';
import AdmZip, { IZipEntry} from 'adm-zip';
 import fs from 'fs';
 
const getOneById = async (id: number) => {
    const DATASET = await Dataset.findByPk(id)
    return DATASET
}

const getAllByUserUID = async (userUID: number) => {
    const DATASETS = await Dataset.findAll({ where: { userUID: userUID } })
    return DATASETS
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
        const DATASETS = await getAllByUserUID(parseInt((request as any).UID))
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
            userUID: (request as any).UID
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
};

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
            const NROWS = await Dataset.update(DATSET_MODEL, { where: { UID: request.params.id } })
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
        const NROWS = await Dataset.destroy({where: {UID: request.params.id}})
        return response.status(200).json(NROWS)
    } catch (error) {
        return response.status(500).json(error)
    }
}
  
const uploadImage = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/images');
        },
        filename: (request, file, cb) => {
            const uid = (request as any).UID;
            const uniqueSuffix = Date.now() + '-'  + Math.round(Math.random() * 1E9) + '.' +  file.mimetype.split('/')[1] ;          
            const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix;
            cb(null, filename);
        },
    });

    const upload = multer({ storage });
    upload.single('file')(request, response, (err: any) => {
        if (err instanceof multer.MulterError) {
          return response.status(400).json({ error: err.message });
        } else if (err) {
          return response.status(500).json({ error1: err.message });//qualcosa è andato male

        }
        return response.status(200).json({ message: 'Upload successful' });
    });
};

const uploadImages = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.diskStorage({
        destination: (request, file, cb) => {
            cb(null, '/images');
        },
        filename: (request, file, cb) => {
            const uid = (request as any).UID;
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1];
            const filename = file.fieldname + '-' + uid + '-' + uniqueSuffix;
            cb(null, filename);
        },
    });

    const uploads = multer({ storage });
    uploads.array('files')(request, response, (err: any) => {
        if (err instanceof multer.MulterError) {
            return response.status(400).json({ error: err.message });
        } else if (err) {
            return response.status(500).json({ error: err.message });
        }
        return response.status(200).json({ message: 'Upload successful' });
    });
};

const uploadZip = async (request: Request, response: Response, next: NextFunction) => {
    const storage = multer.memoryStorage(); //N.B prima usavamo disk, invece ora salvo temporanemante
    const uploads = multer({ storage }).any();

    uploads(request, response, async (err: any) => {
        if (err instanceof multer.MulterError) {
            return response.status(400).json({ error: err.message });
        } else if (err) {
          return response.status(500).json({ error: err.message });
        }
        //Controllo ci sia qualcosa da uploadare
        if (!request.files || request.files.length === 0) {
            return response.status(400).json({ error: 'No files uploaded' });
        }

        const uploadedFiles = [];

        // leggo 1 a 1 i file
        for (const file of request.files as Express.Multer.File[]) {
            if (file.mimetype !== 'application/zip') {
              return response.status(400).json({ error: 'Invalid file format. Only zip files are allowed' });
            }

            const zip = new AdmZip(file.buffer);
            const zipEntries = zip.getEntries();

            // Leggo i singoli file nella zip
            for (const zipEntry of zipEntries) {
                // Extract the file name and extension
                const fileName = zipEntry.entryName.split('/').pop();
                if (!fileName) {
                  continue; 
                }
                const fileExtension = fileName.split('.').pop();

                // rinomino i singoli file
                const uid = (request as any).UID;
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const newFileName = `file-${uid}-${uniqueSuffix}.${fileExtension}`;

                // salvo col nuovo nome
                const filePath = `/images/${newFileName}`;
                fs.writeFileSync(filePath, zipEntry.getData());
                
                uploadedFiles.push(filePath);
            }
        }
        return response.status(200).json({ message: 'Upload successful', files: uploadedFiles });
    });
};


const createDatasetSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).required(),
    tags: Joi.number().min(0).max(1023).required(),
    numClasses: Joi.number().min(0).max(255).required()
});


const updateDatasetSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(15).optional(),
    tags: Joi.number().min(0).max(1023).optional(),
    numClasses: Joi.number().min(0).max(255).optional()
});

const controller = {
    getAll, getAllMine,
    getById, getOneById, getAllByUserUID,
    create,
    updateById,
    deleteById,
    uploadImage,
    uploadImages,
    uploadZip
}

export default controller;