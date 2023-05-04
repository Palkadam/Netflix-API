import multer from "multer";
import productModel from "../Models/product.model";
import path from 'path'
import fs from 'fs'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const filePath = path.join(__dirname, '../uploads/products')

        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true })
        }

        cb(null, filePath)
    },
    filename: (req, file, cb) => {
        const fileArr = file.originalname.split(".")
        const extenstion = fileArr[fileArr.length - 1];
        fileArr.pop();

        const newFileName = fileArr.join("_") + "_" + Date.now() + "." + extenstion

        cb(null, newFileName);
    }
})

const upload = multer({ storage: storage });

export const addProduct = async (req, res) => {
    try {

        const uploadProduct = upload.single('image')

        uploadProduct(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message
                })
            }

            const { name, categoryID, SubCategoryID, description, releaseDate, duration, rating, cast } = req.body
            const image = req.file.filename;

            const product = new productModel({
                name: name,
                categoryID: categoryID,
                SubCategoryID: SubCategoryID,
                description: description,
                releaseDate: releaseDate,
                duration: duration,
                rating: rating,
                cast: cast,
                image: image
            })

            const saveData = await product.save();

            if (saveData) {
                res.status(201).json({
                    product: saveData,
                    message: "product uploaded success"
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

export const getProduct = async (req, res) => {
    try {

        const skip = req.query.skip || 0;
        const limit= req.query.limit || 0;
        const search = req.query.search;
       
        const query = search?
        {
            $or:[
                {name:{$regex:`.*${search}.*`, $options:'i'}},
                {description:{$regex:`.*${search}.*`, $options:'i'}}
            ]
        } 
        :{};

        const product = await productModel.find(query)
        .skip(skip)
        .limit(limit)
        .populate('categoryID SubCategoryID cast')

        if (product) {
            res.status(200).json({
                product: product,
                count: product.length,
                message: "product fetched success"
            })
        } else {
            res.status(400).json({
                message: "something went wrong"
            })
        }
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const productUpdate = upload.single('image');

        productUpdate(req, res, async (err) => {

            const productID = req.params.ID;

            const oldData = await productModel.findOne({ _id: productID });

            const {name, categoryID, SubCategoryID, description, releaseDate, duration, rating, cast} = req.body
            let image = oldData.image;

            if (req.file) {
                image = req.file.filename;
                fs.unlinkSync(path.join(__dirname, '../uploads/products/' + oldData.image))
            }

            const updateData = await productModel.updateOne(
                { _id: productID },
                {
                    $set: {
                        name: name,
                        categoryID: categoryID,
                        SubCategoryID: SubCategoryID,
                        description: description,
                        releaseDate: releaseDate,
                        duration: duration,
                        rating: rating,
                        image:image,
                        cast: cast
                    }
                })

            if (updateData.acknowledged) {
                res.status(200).json({
                    message: "product updated success"
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

export const deleteProduct = async(req, res)=>{
    try {
        const productID = req.params.ID;

        const getProduct = await productModel.findOne({_id:productID});

        fs.unlinkSync(path.join(__dirname,'../uploads/products/'+getProduct.image))

        const deleteProduct = await productModel.deleteOne({_id:productID});

        if (deleteProduct.acknowledged) {
            res.status(200).json({
                message: "product deleted success"
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