const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
        minlength:3
    },
    born: {
        type: Number,
        default:null
    }
})

module.exports = mongoose.model('Author', schema)