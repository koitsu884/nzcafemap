const path = require('path');
const Datauri = require('datauri');
const multer = require('multer');

const memoryStorage = multer.memoryStorage();
const memoryUploaderConfig = {
    storage: memoryStorage,
    limits: {
        fileSize: 1000000
    }
};

const dataUri = new Datauri();

module.exports.memoryUploadSingle = key => multer(memoryUploaderConfig).single(key);
module.exports.bufferToDataUri = req => dataUri.format(path.extname(req.file.originalname).toString(),
    req.file.buffer);