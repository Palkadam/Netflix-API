import subCategoryModel from '../Models/sub_category.model'


export const addSubCategory = async (req, res) => {
    try {

        const { name, description } = req.body

        const subCategory = new subCategoryModel({
            name: name,
            description: description
        })

        const saveData = await subCategory.save();

        if (saveData) {
            res.status(201).json({
                category: saveData,
                message: "sub-category created"
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


export const getSubCategory = async (req, res) => {
    try {

        const subCategories = await subCategoryModel.find()

        if (subCategories) {
            res.status(200).json({
                categories: subCategories,
                message: "sub-categories fetched successfully"
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


export const updateSubCategory = async (req, res) => {
    try {
        const subCategoryID = req.params.ID;
        const { name, description } = req.body

        const updateData = await subCategoryModel.updateOne(
            { _id: subCategoryID },
            {
                $set: {
                    name: name,
                    description: description
                }
            }
        )

        if (updateData.acknowledged) {
            res.status(200).json({
                message: "sub-categories updated successfully"
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


export const deleteSubCategory = async (req, res) => {
    try {
        const subCategoryID = req.params.ID;

        const deleteData = await subCategoryModel.deleteOne({ _id: subCategoryID });

        if (deleteData.acknowledged) {
            res.status(200).json({
                message: "sub-category Deleted successfully"
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