const { type } = require('express/lib/response');
const { default: mongoose } = require('mongoose');
const momgoose=require('mongoose');

const schema=new mongoose.Schema({

    username:{
        type: String,
        required:[true,'Username is required']
    },
    password:{
        type: String,
        required:[true,'Password is required']
    }
})

module.exports=mongoose.model('User',schema);
