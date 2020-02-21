const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const multer = require('multer');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

//*IMAGE SCHEMA FOR STORING THE DATA IN MONGOOSE DATABSE
var ImageSchema = new Schema({
    imageName: {
        type: Object,
        default: "none",
        required: true
    },
})

var Image = mongoose.model('Image', ImageSchema)

const url = 'mongodb://localhost:27017/multer_with_react_native';
const connect = mongoose.connect(url, { useMongoClient: true });

//*CONNECTION TO THE DATABASE
connect.then((db) => {
    var db = mongoose.connection;
    console.log('connected to database');

}, (err) => console.log(err));


//*MIDDLEWARES FOR CREATING THE CONCERNED API REQUEST
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.' + file.mimetype.split('/')[1])
    }
})
const upload = multer({ storage: storage })

//*SAMPLE REQUEST
app.get('/demoroute', (req, res) => {
    res.send("API working fine!!!")
})

//*UPLOAD ROUTE
app.post('/uploadroute', upload.single('imageData'), (req, res, next) => {
    var obj = req.file
    console.log(obj)
    const newImage = new Image({
        imageName: obj,

    })

    newImage.save()
        .then((result) => {
            console.log(result)
            res.send(result)
        })
        .catch((err) => next(err))
})

app.listen(3000)