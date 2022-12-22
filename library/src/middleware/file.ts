import multer from 'multer'
import { Request } from "express"

const storage = multer.diskStorage({
	destination(req: Request, file, cb){
		cb(null, 'public/stor')
	},
	filename(req: Request, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
})
export const fileMulter = multer({storage})
