import express from 'express'
import {addUser, getUser, userByID, updateUser, deleteUser, login} from '../Controllers/user.controller'

const userRouter = express.Router();

userRouter.post('/add-user', addUser)
userRouter.get('/get-user', getUser)
userRouter.get('/get-user/:userID', userByID)
userRouter.patch('/update-user/:userID', updateUser)
userRouter.delete('/delete-user/:userID', deleteUser)
userRouter.get('/login', login)

export default userRouter