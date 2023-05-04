import express from 'express'
import {addCast, getCast, updateCast, deleteCast} from '../Controllers/cast.controller'

const castRouter = express.Router();

castRouter.post('/add-cast', addCast)
castRouter.get('/get-cast', getCast)
castRouter.patch('/update-cast/:castID', updateCast)
castRouter.delete('/delete-cast/:castID', deleteCast)

export default castRouter