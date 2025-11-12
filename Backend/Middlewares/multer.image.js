import multer from "multer"

let storage = multer.diskStorage({
    destination : (req,file,cb)=>{
       
        dest = "../Assets"

        cb(null,dest)

    },

    filename :(req,file,cb)=>{

        let extention = file.originalname.split('.').pop()

        let name = file.fieldname + "-" + Date.now() + "-" + extention
        
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