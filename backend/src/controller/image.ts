import userModel from "../models/userModel";
import FormData from "form-data";
import axios from 'axios'
import { Request, Response } from 'express';

export const generatImage = async (req: Request, res: Response) => {
    try {
        //@ts-ignore

        const { prompt } = req.body;
        const userId = req.userId;

        const user = await userModel.findById(userId);

        if (!user || !prompt) {
            return res.status(404).json({ success: false, message: 'All fields are necessary' });
        }

        if (user.creditBalance === 0) {

            res.status(400).json({ success: false, message: "You have no credits left", creditBalance: user.creditBalance });
        }

        const formData = new FormData();
        formData.append("prompt", prompt);

        const data = await axios.post("https://clipdrop-api.co/text-to-image/v1", formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_API,
            },
            responseType: "arraybuffer"
        })

        const base64Image = Buffer.from(data.data, 'binary').toString('base64');

        const resultImage = `data:image/png;base64,${base64Image}`;

        await userModel.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 });


        res.json({ success: true, message: "Image generated successfully",  creditBalance: user.creditBalance - 1 , image: resultImage });

    } catch (error: any) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message })
    }
}