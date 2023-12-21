const multerProfile = require('multer');
const path = require('path');

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

const storage = multerProfile.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, req.body.aadharnumber + ' ' + path.extname(file.originalname));
    }
});

const profilePhoto = multerProfile({ storage: storage, fileFilter: imageFilter});

module.exports = { profilePhoto };