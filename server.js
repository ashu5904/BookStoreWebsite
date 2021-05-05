require('dotenv').config({
    path: './config/config.env'
})

const connectDB = require('./config/db');
connectDB();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

const authRouter = require('./routes/auth.router');
const productRouter = require('./routes/product.router');

app.use(cors({
    origin: "http://bookstore-ashutosh.herokuapp.com"
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'build')));

app.use('/user', authRouter);
app.use('/product', productRouter);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
})

app.listen(process.env.PORT || 5000, (req, res) => {
    console.log("Server Listening");
})
