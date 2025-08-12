import express from 'express';
const imageRouter = express.Router();
import { generatImage } from '../controller/image';
import { userAuth } from '../middleware/auth';

//@ts-ignore
imageRouter.post('/generateImage' , userAuth , generatImage)

export default imageRouter