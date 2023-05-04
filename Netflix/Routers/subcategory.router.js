import express from 'express'
import {addSubCategory, getSubCategory, updateSubCategory, deleteSubCategory} from '../Controllers/subcategory.controller'

const subCategoryRouter = express.Router()

subCategoryRouter.post('/add-subcategory',addSubCategory)
subCategoryRouter.get('/get-subcategory',getSubCategory)
subCategoryRouter.patch('/update-subcategory/:ID',updateSubCategory)
subCategoryRouter.delete('/delete-subcategory/:ID',deleteSubCategory)

export default subCategoryRouter