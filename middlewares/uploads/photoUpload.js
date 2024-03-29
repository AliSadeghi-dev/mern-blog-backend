const multer = require("multer");
const path = require("path");
const sharp = require("sharp");

//storage
const multerStorage = multer.memoryStorage();

//file type checking
const multerFilter = (req, file, cb) => {
  // check file type
  if (file?.mimetype?.startsWith("image")) {
    cb(null, true);
  } else {
    //rejected files
    cb(
      {
        message: "Unsupported file format.",
      },
      false
    );
  }
};

const PhotoUploadMulter = multer({
  storage: multerStorage,
  filter: multerFilter,
  limits: {
    fileSize: 1000000,
  },
});

//profile Image Resizing
const profilePhotoResize = async (req, res, next) => {
 
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));
  next();
};

//post Image Resizing
const postImageResize = async (req, res, next) => {
 
  //check if there is no file
  if (!req.file) return next();
  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 90,
    })
    .toFile(path.join(`public/images/posts/${req.file.filename}`));
  next();
};

module.exports = { PhotoUploadMulter, profilePhotoResize, postImageResize };
