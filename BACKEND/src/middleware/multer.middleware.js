import multer from 'multer'
import { fileURLToPath } from 'url';
const __dirname = path.dirname(__filename);
const storage=multer.diskStorage({
  destination:function (req,file,cb)
  {
    cb(null,path.join(__dirname, 'public', 'temp'))
  },
  filename:function(req,file,cb)
  {
    cb(null,file.originalname)
  }
})

export const upload=multer({storage})