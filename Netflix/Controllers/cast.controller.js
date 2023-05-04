import castModel from '../Models/cast.model'
import multer from 'multer'
import path from 'path'
import fs from 'fs'

const storage = new multer.diskStorage({
    destination: (req, file, cb) => {
        const castImagePath = path.join(__dirname, '../uploads/casts');

        if (!fs.existsSync(castImagePath)) {
            fs.mkdirSync(castImagePath)
        }

        cb(null, castImagePath)

    },
    filename: (req, file, cb) => {
        const imgArr = file.originalname.split('.');
        const extenstion = imgArr[imgArr.length - 1];
        imgArr.pop();
        const imgName = imgArr.join('_');

        cb(null, imgName + '_' + Date.now() + "." + extenstion)
    }
})

const upload = multer({ storage: storage });

export const addCast = async (req, res) => {
    try {

        const uploadCast = upload.single('image');

        uploadCast(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err
                })
            }

            const { name, about } = req.body;
            const image = req.file.filename;

            const cast = new castModel({
                name: name,
                about: about,
                image: image
            })

            const saveData = await cast.save();

            if (saveData) {
                return res.status(201).json({
                    cast: saveData,
                    message: "created"
                })
            } else {
                return res.status(400).json({
                    message: "something went wrong"
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const getCast = async (req, res) => {
    try {

        let limit = req.query.limit || 0;
        let skip = req.query.skip || 0;
        let search = req.query.search;

        let query = search ?
            {
                $or: [
                    { name: { $regex: `.*${search}.*`, $options: 'i' } },
                    { about: { $regex: `.*${search}.*`, $options: 'i' } }
                ]
            }
            : {};

        const cast = await castModel.find(query).skip(skip).limit(limit);

        if (cast) {
            return res.status(200).json({
                cast: cast,
                total: cast.length,
                message: "fetched"
            })
        } else {
            return res.status(400).json({
                message: "something went wrong"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateCast = async (req, res) => {
    try {

        const castUpdate = upload.single('image');

        castUpdate(req, res, async (err) => {
            if (err) {
                res.status(400).json({
                    message: err.message
                })
            }

            const castID = req.params.castID;

            const oldData = await castModel.findOne({ _id: castID });

            const { name, about } = req.body;
            let image = oldData.image

            if (req.file) {
                image = req.file.filename;

                fs.unlink(path.join(__dirname, '../uploads/casts/' + oldData.image), () => {
                    console.log("deleted image");
                })
            }

            const updateData = await castModel.updateOne(
                {_id:castID},
                {$set:{
                    name:name,
                    about:about,
                    image:image
            }})

            if (updateData.acknowledged) {
                res.status(200).json({
                    message: "updated success"
                })
            } else {
                res.status(400).json({
                    message: "something went wrong"
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const deleteCast = async (req, res) => {
    try {
        const castID = req.params.castID;

        const getImage = await castModel.findOne({ _id: castID })

        fs.unlink(path.join(__dirname, '../uploads/casts/' + getImage.image), () => {
            console.log("deleted");
        })

        const deleteData = await castModel.deleteOne({ _id: castID })

        if (deleteData.acknowledged) {
            res.status(200).json({
                message: "Deleted success"
            })
        } else {
            res.status(400).json({
                message: "something went wrong"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}