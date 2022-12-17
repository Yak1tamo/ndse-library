import multer from 'multer'

const storage = multer.diskStorage({
	destination(req, file, cb){
		cb(null, 'public/stor')
	},
	filename(req, file, cb) {
		cb(null, `${Date.now()}-${file.originalname}`)
	}
})
export const fileMulter = multer({storage})
