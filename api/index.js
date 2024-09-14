const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Post = require('./models/Post')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const multer = require('multer');
const fs = require('fs');

const uploadMiddleware = multer({ dest: 'uploads/' })

const app = express();
const port = 3000;
const salt = bcrypt.genSaltSync(10);
const secret = 'ertyuioiuhhcxzsefvbnjgfdrthj';

app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://utkarsh:BC3CVHi9Q5enV4FA@cluster0.ykm3jlx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
//mongodb+srv://utkarsh:BC3CVHi9Q5enV4FA@cluster0.ykm3jlx.mongodb.net/

app.get("/", (req, res) => {
    res.send("Hello")
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const userDoc = await User.create({
            username,
            password: bcrypt.hashSync(password, salt),
        })
        res.json(userDoc)
    } catch (error) {
        res.status(400).json(error)
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username })
    const passOK = bcrypt.compareSync(password, userDoc.password);
    if (passOK) {
        jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
            res.cookie('token', token).json({
                id: userDoc._id,
                username,
            })
        });
    }
    else {
        res.status(400).json('Wrong Credentials');
    }

})

app.get('/profile', (req, res) => {
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, (err, info) => {
            if (err) throw err;
            res.json(info)
        })
    }
    else res.json(null)
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('files'), async (req, res) => {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err;
            const { title, summary, content } = req.body;

            const postDoc = await Post.create({
                title,
                summary,
                content,
                cover: newPath,
                author: info.id,
            })
            res.json(postDoc)
        })
    }
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    const newPath = null;
    if (req.file) {
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }
    const { token } = req.cookies;
    if (token) {
        jwt.verify(token, secret, {}, async (err, info) => {
            if (err) throw err;
            const { id, title, summary, content } = req.body;
            const postDoc = await Post.findById(id);
            const isAuthor = JSON.stringify(info.id) === JSON.stringify(postDoc.author);
            if(!isAuthor){
                return res.status(400).json("you're not the author");
            }

            await postDoc.updateOne({
                title,
                summary,
                content,
                cover: newPath ? newPath : postDoc.cover,
            })
            res.json(postDoc)
        })
    }
})

app.get('/post', async (req, res) => {
    res.json(await Post.find()
        .populate('author', ['username'])
        .sort({ createdAt: -1 })
        .limit(20)
    )
})

app.get('/post/:id', async (req, res) => {
    const { id } = req.params;
    const info = await Post.findById(id).populate('author', ['username']);
    res.json(info)
})

app.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const info = await Post.findById(id).populate('author', ['username']);
    res.json(info)
})

app.listen(port);


//BC3CVHi9Q5enV4FA

//mongodb+srv://utkarsh:BC3CVHi9Q5enV4FA@cluster0.ykm3jlx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0