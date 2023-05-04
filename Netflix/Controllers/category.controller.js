import categoryModel from '../Models/category.model'


export const addCategory = async (req, res) => {
    try {

        const { name, description } = req.body

        const category = new categoryModel({
            name: name,
            description: description
        })

        const saveData = await category.save();

        if (saveData) {
            res.status(201).json({
                category: saveData,
                message: "category created"
            })
        } else {
            res.status(400).json({
                message: "Something went wrong"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const getCategory = async (req, res) => {
    try {
        const categoryID = req.params.categoryID;

        const categories = await categoryModel.find()

        if (categories) {
            res.status(200).json({
                categories: categories,
                message: "categories fetched successfully"
            })
        } else {
            res.status(400).json({
                message: "Something went wrong"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const updateCategory = async (req, res) => {
    try {
        const categoryID = req.params.categoryID;
        const { name, description } = req.body

        const updateData = await categoryModel.updateOne(
            { _id: categoryID },
            {
                $set: {
                    name: name,
                    description: description
                }
            }
        )

        if (updateData.acknowledged) {
            res.status(200).json({
                category: updateData,
                message: "categories updated successfully"
            })
        } else {
            res.status(400).json({
                message: "Something went wrong"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


export const deleteCategory = async (req, res) => {
    try {
        const categoryID = req.params.categoryID;

        const deleteData = await categoryModel.deleteOne({ _id: categoryID });

        if (deleteData.acknowledged) {
            res.status(200).json({
                message: "category Deleted successfully"
            })
        } else {
            res.status(400).json({
                message: "Something went wrong"
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}