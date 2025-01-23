
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const path = require('path');

const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');


const postRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}

var fileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, file.filename + '-' + file.originalname)
    }
})

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use(cors({
    origin: 'http://localhost:3000',
    methods: 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
    allowedHeaders: 'Content-Type, Authorization'
}));


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});


app.use('/posts', postRoutes);

app.use('/auth', authRoutes);

const port = 4242;

// Listen for request

mongoose.connect("mongodb+srv://db_sakib:Mongoman@cluster0.4twp21v.mongodb.net/messeges?retryWrites=true&w=majority&appName=Cluster0")
    .then(result => {
        console.log('Connected to MongoDB');

        const server = app.listen(port, () => {
            console.log(`Now listening for requests on port ${port}`);
        });

        const io = require('./socket').init(server);

        io.on("connection", socket => {
            console.log("New client connected");
            socket.on("disconnect", () => console.log("Client disconnected"));
        });


    })
    .catch(err => console.log(err));

