import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser';
import userRouter from './Routers/user.router';
import castRouter from './Routers/cast.router';
import categoryRouter from './Routers/category.router';
import subCategoryRouter from './Routers/subcategory.router';
import productRouter from './Routers/product.router';

const app = express();
const port = 8001;

app.use(express.static(__dirname));

mongoose.set('strictQuery', false);

// parse application/json
app.use(bodyParser.json())

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

app.listen(port,()=>{
    console.log(`your server is running on port : ${port}`);
})

mongoose.connect('mongodb://127.0.0.1:27017/netflix')
.then(()=>{
    console.log("Connected");
})
.catch((err)=>{
    console.log(err);
})

app.use('/users',userRouter);
app.use('/casts',castRouter)
app.use('/category',categoryRouter)
app.use('/subcategory',subCategoryRouter)
app.use('/products',productRouter)