const { required } = require('joi');
const mongoose = require('mongoose');


const contactSchema =mongoose.Schema({
    name : {
        type :String,
        // required : true,
    },
    email : {
        type :String,
        // required : true,
    },
    phone : {
        type :Number,
        // required : true,
    },
    message : {
        type :String,   
    }
})

const contact = mongoose.model("Contact",contactSchema)
module.exports = contact