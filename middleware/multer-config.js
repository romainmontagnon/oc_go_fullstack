const multer = require('multer');

const MINE_TYPES = {
    'images/jpg'    : 'jpg',
    'images/jpeg'   : 'jpeg',
    'images/png'    : 'png'    
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MINE_TYPES[file.minetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({storage}).single('images');