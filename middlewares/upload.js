const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const { _id } = req.user;
    // Determine the folder based on file properties or request data
    console.log(file);
    let folder;
    if (file.fieldname === "avatar") {
      folder = "avatars";
    } else if (file.fieldname === "documents") {
      folder = "documents";
    } else {
      folder = "misc";
    }
    return {
      folder: folder,
      allowed_formats: ["jpg", "png"], // Adjust the allowed formats as needed
      public_id: _id, // Use original filename as the public ID
      transformation: [
        // { gravity: "face", height: 400, width: 400, crop: "crop" },
        { height: 400, width: 400, crop: "crop" },
        { radius: "max" },
        { width: 200, crop: "scale" },
        { fetch_format: "auto" },
      ],
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
