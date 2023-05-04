import express from 'express'
import {addProduct, getProduct, updateProduct, deleteProduct} from '../Controllers/product.controller'

const productRouter = express.Router();

productRouter.post('/add-product', addProduct)
productRouter.get('/get-product', getProduct)
productRouter.patch('/update-product/:ID', updateProduct)
productRouter.delete('/delete-product/:ID', deleteProduct)

export default productRouter