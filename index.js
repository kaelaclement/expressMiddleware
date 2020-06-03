const express = require('express');
const hbs = require('express-handlebars');
const app = express();
const path = require('path');
const multer = require('multer');
const fs = require('fs');


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, "/uploads"))
    },
    filename: function(req, file, cb) {
      console.log("file", file)
      fileExtension = file.originalname.split(".")[1]
      cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension)
    },
})

const upload = multer({ storage: storage })


app.engine('.hbs', hbs({
    defaultLayout:'layout', 
    extname: 'hbs'
}))

app.set('view engine', '.hbs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/images', (req, res) => {

    let fileNames = {}
    fs.readdirSync('./uploads').forEach((file, index) => {
        fileNames[index] = file
    })
    console.log(fileNames)
    res.render('images', {fileNames})
})


app.post('/upload', upload.single('myfile'), (req, res) => {
    let uploadedfile = req.file.fieldname
    if (uploadedfile) {
        res.redirect('/images')
    }
})


app.listen(3000,() => {
    console.log('listening on port 3000');
})



