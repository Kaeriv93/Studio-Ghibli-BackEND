// Dependencies
require('dotenv').config()
const express = require('express')
const {PORT = 4000, MONGODB_URL} = process.env
const app = express()
const authRoutes = require('./Routes/AuthRoutes')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const axios = require('axios')
const session = require('express-session')
const cors = require('cors')
const { shouldSendSameSiteNone } = require('should-send-same-site-none');

//Import middleware
const morgan = require('morgan')

//Mongo Connections
mongoose.connect(MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    console.log('DB Connection Successful! You now have access to our backend server!')
}).catch(err=>{
    console.log(err.message)
})

//Middleware
// app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(shouldSendSameSiteNone);
app.use(
    cors({
      credentials: true,
      origin: [process.env.ORIGIN,'http://localhost:3000']
    })
  );
app.use('/', authRoutes)

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

app.set("trust proxy", 1);
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'Super Secret',
        resave: true,
        saveUninitialized: false,
        cookie: {
            sameSite: process.env.NODE_ENV === 'none',
            secure: process.env.NODE_ENV === "production", 
            
            
            
        }
    })
    );
    
    


const db = require('./models')


app.get('/', function (req, res) {
    res.cookie("foo", "bar", { sameSite: "none", secure: true });
    res.send('hello world');
  });
  

app.get('/register', (req,res)=>{
    res.send('This is the register')
})



app.get('/login', (req,res)=>{
    res.send('This is the login page')
})




app.get('/users', async (req,res)=>{
    try{
        res.json(await db.User.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})

app.post('/users', async(req,res)=>{
    try{
        res.json(await db.User.create(req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

app.get('/userpage/:id', async(req,res)=>{
    try{
        res.json(await db.User.findById(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

app.put('/userpage/:id', async(req,res)=>{
    try{
        res.json(await db.User.findByIdAndUpdate(req.params.id,req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete('/userpage/:id', async(req,res)=>{
    try{
        res.json(await db.User.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

app.get('/reviews', async(req,res)=>{
    try{
        res.json(await db.Review.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})

app.post('/reviews', async(req,res, next)=>{
    try{
       res.json(await db.Review.create(req.body))

    }catch(error){
        console.log(error)
        req.error = error
        return next()
    }
})

app.put('/reviews/:id', async(req,res)=>{
    try{
        res.json(await db.Review.findByIdAndUpdate(req.params.id, req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete('/reviews/:id', async(req,res)=>{
    try{
        res.json(await db.Review.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete('/userpage/:id/favorites', async(req,res)=>{
    try{
        const foundUser = await db.User.findById(req.params.id)
        if(!foundUser) return res.send('Can not find user')
        res.json(await db.Favorite.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})


app.get('/userpage/:id/friends', async(req,res)=>{
    try{
        const foundUser = await db.User.findById(req.params.id)
        if(!foundUser) return res.send('Can not find user')
        res.json(await db.Friends.find({}))
    }catch(error){
        res.status(400).json(error)
    }
})

app.post('/userpage/:id/friends', async(req,res, next)=>{
    try{
        const foundUser = await db.User.findById(req.params.id)
        if(!foundUser) return res.send('Can not find user')
       res.json(await db.Friends.create(req.body))

    }catch(error){
        console.log(error)
        req.error = error
        return next()
    }
})

app.put('/userpage/:id/friends', async(req,res)=>{
    try{
        const foundUser = await db.User.findById(req.params.id)
        if(!foundUser) return res.send('Can not find user')
        res.json(await db.Friends.findByIdAndUpdate(req.params.id, req.body))
    }catch(error){
        res.status(400).json(error)
    }
})

app.delete('/userpage/:id/friends', async(req,res)=>{
    try{
        const foundUser = await db.User.findById(req.params.id)
        if(!foundUser) return res.send('Can not find user')
        res.json(await db.Friends.findByIdAndRemove(req.params.id))
    }catch(error){
        res.status(400).json(error)
    }
})

//Listening
app.listen(PORT,()=>console.log(`Listening on port:${PORT}`))