import express from 'express'
import {addCategory, getCategory, updateCategory, deleteCategory} from '../Controllers/category.controller'

const categoryRouter = express.Router()

categoryRouter.post('/add-category',addCategory)
categoryRouter.get('/get-category',getCategory)
categoryRouter.patch('/update-category/:categoryID',updateCategory)
categoryRouter.delete('/delete-category/:categoryID',deleteCategory)

export default categoryRouter