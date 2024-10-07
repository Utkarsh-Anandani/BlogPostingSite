const express = require('express')
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser')
require('dotenv').config();


const app = express();
const port = 3000;
const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;
const uri = process.env.MONGODB_URI;

app.use(cors({ credentials: true, origin: 'https://blog-posting-site.vercel.app' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());


async function connectWithRetry() {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB is connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    setTimeout(connectWithRetry, 5000); // Retry after 5 seconds
  }
}

connectWithRetry();


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

app.post('/post', async (req, res) => {
    try {
        const { token } = req.cookies;

        if (token) {
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;

                const { title, summary, content, image } = req.body;

                // Create a new post document
                const postDoc = await Post.create({
                    title,
                    summary,
                    content,
                    image,
                    author: info.id,
                });

                res.json(postDoc);
            });
        } else {
            res.status(401).json({ message: "No token provided" });
        }
    } catch (error) {
        console.error(error, error.message);
        res.status(400).json({ message: error.message });
    }
});


app.put('/post', async (req, res) => {
    try {
        const { token } = req.cookies;
        console.log(token);
        if (token) {
            jwt.verify(token, secret, {}, async (err, info) => {
                if (err) throw err;
                const { id, title, summary, content, image } = req.body;
                const postDoc = await Post.findById(id);
                const isAuthor = JSON.stringify(info.id) === JSON.stringify(postDoc.author);
                if (!isAuthor) {
                    return res.status(400).json("you're not the author");
                }

                await postDoc.updateOne({
                    title,
                    summary,
                    content,
                    image
                })
                res.json(postDoc)
            })
        } else {
            res.status(401).json({ message: "No token provided" });
        }
    } catch (error) {
        console.error(error, error.message);
        res.status(400).json({ message: error.message });
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

const server = app.listen(port);
