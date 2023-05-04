import userModel from '../Models/user.model'
import multer from 'multer';
import fs from 'fs'
import path from 'path';

//use for hash the password
import bcrypt from 'bcrypt'

const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {

        const myPath = path.join(__dirname, '../uploads/users/');

        if (!fs.existsSync(myPath)) {
            fs.mkdirSync(myPath, { recursive: true })
        }

        cb(null, myPath)
    },
    filename: async (req, file, cb) => {

        const nameArr = file.originalname.split('.');
        const extension = nameArr[nameArr.length - 1]
        nameArr.pop();
        const newName = nameArr.join('_')

        cb(null, newName + Date.now() + "." + extension);
    }
})

const uploads = multer({ storage: userStorage });

export const addUser = async (req, res) => {
    try {
        const userUpload = uploads.single('image');

        userUpload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({
                    message: err.message
                })
            }

            const { name, age, email, password, confirmPassword } = req.body;
            let image = req.file.filename

            const hashPass = await bcrypt.hash(password, 10)
                .then((hash) => {
                    return hash;
                });

            const isExist = await userModel.findOne({ email: email });
        
            if (isExist) {
                fs.unlinkSync(path.join(__dirname,'../uploads/users/'+isExist.image))
                
                return res.status(400).json({
                    message: "this user email is already exist."
                })
            }

            const user = new userModel({
                name: name,
                age: age,
                email: email,
                password: hashPass,
                image: image
            })

            const userData = await user.save();

            if (userData) {
                res.status(201).json({
                    user: userData,
                    message: "created successfully"
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

export const getUser = async (req, res) => {
    try {
        const user = await userModel.find();

        if (user) {
            res.status(200).json({
                user: user,
                total: user.length,
                message: "User Fetched Successfully"
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

export const userByID = async (req, res) => {
    try {
        const userID = req.params.userID;

        const user = await userModel.findOne({ _id: userID });

        if (user) {
            res.status(200).json({
                user: user,
                message: "user Found"
            })
        } else {
            res.status(400).json({
                message: "Something went wrong."
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const updateUser = async (req, res) => {
    try {

        const userUpdate = uploads.single('image');

        userUpdate(req, res, async (error) => {

            const userID = req.params.userID;

            const oldData = await userModel.findOne({ _id: userID });

            const { name, age, email, password, confirmPassword } = req.body;
            let image = oldData.image;

            if (req.file) {
                image = req.file.filename;
                fs.unlink(path.join(__dirname, "../uploads/users/" + oldData.image), () => {
                    console.log("Image deleted");
                })
            }

            const user = await userModel.updateOne({ _id: userID },
                {
                    $set: {
                        name: name,
                        age: age,
                        email: email,
                        password: password,
                        confirmPassword: confirmPassword,
                        image: image
                    }
                })


            if (user.acknowledged) {
                res.status(200).json({
                    message: "user Updated"
                })
            } else {
                res.status(400).json({
                    message: 'something went wrong'
                })
            }
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {
        const userID = req.params.userID;

        const oldData = await userModel.findOne({ _id: userID })
        const image = oldData.image;

        //delete image too
        fs.unlinkSync(path.join(__dirname, '../uploads/users/' + image))

        //delete document
        const user = await userModel.deleteOne({ _id: userID })

        if (user.acknowledged) {
            res.status(200).json({
                message: "User Record Deleted Successfully"
            })
        } else {
            res.status(400).json({
                message: "something went wrong."
            })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const login = async(req, res)=>{
    try {
        const {email, password} = req.body

        const isExist = await userModel.findOne({email:email})
        
        if(!isExist){
            return res.status(400).json({
                message:"user not found"
            })
        }
        
        const match = await bcrypt.compare(password, isExist.password);

        if(match){
            return res.status(200).json({
                data:isExist,
                message: "Login successful"
           }) 
        }else{
            return res.status(400).json({
                message: "Invalid credentials"
           })
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}