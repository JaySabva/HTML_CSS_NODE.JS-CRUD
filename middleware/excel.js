const multerExcel = require('multer');
const path = require('path');

const excelFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
        cb(null, true);
    } else {
        cb(new Error("Only excel files are allowed!"), false);
    }
}

const storage = multerExcel.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads/');
    },
    filename: function(req, file, callback) {
        callback(null, "db"+path.extname(file.originalname));
    }
});

const excelFile = multerExcel({ storage: storage, fileFilter: excelFilter});

module.exports = { excelFile };