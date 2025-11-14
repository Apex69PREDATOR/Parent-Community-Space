import multer from "multer"
import {join,dirname} from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

let storage = multer.diskStorage({
    destination : (req,file,cb)=>{
       
        const dest =  join(__dirname,"../Assets")

        cb(null,dest)

    },

    filename :(req,file,cb)=>{

        let extention = file.originalname.split('.').pop()

        let name = file.fieldname + "-" + Date.now() + "." + extention
        
        cb(null,name)

    }
})

const upload = multer({storage,
    fileFilter:(req, file, cb) => {
        // Example: Only allow images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits : 3 * 1024 * 1024
})

export default upload