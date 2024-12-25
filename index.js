const express=require('express');
const app=express();
const User=require('./user');
const { default: mongoose } = require('mongoose');
const bcrypt=require('bcrypt');
const session=require('express-session');

const port=4006;

mongoose.connect('mongodb://localhost:27017/autho')
.then(()=>{
    console.log('connected to database');
})
.catch( err =>{
    console.log('connection failed');
    console.log(err);
});


app.set('view engine','ejs');
app.set('views','views');

app.use(express.urlencoded({extended:true}));
app.use(session({secret:'Not a good secret'}));

app.get('/',(req,res)=>{
    res.send('This is the home page');

});

app.get('/register',(req,res)=>{
    res.render('register');

});



app.post('/register',async(req,res)=>{
    const {password,username}=req.body;
    const hash=await bcrypt.hash(password,12);
    const user=new User({username,password:hash});
    await user.save();
    req.session.user_id=user._id;
    res.redirect('/');
});

app.post('/login',async(req,res)=>{
    const {password,username}=req.body;
    const user= await User.findOne({username});
    const validuser=await bcrypt.compare(password,user.password);
    if(validuser){
        
        req.session.user_id=user._id;
        res.redirect("/secret");

    }
    else{
        res.redirect("/login");
    }
    
    
    
    
});

app.post('/logout',(req,res)=>{
    req.session.user_id=null;
    res.redirect('/login');

});

app.get('/secret',(req,res)=>{
    if(!req.session.user_id){
        return res.redirect('/login');
    }
    
    res.render('secret');
    

});

app.get('/login', (req, res) => {
    res.render('login');
});

app.listen(port,(req,res)=>{
    console.log('Server is running on port 4006');
});

