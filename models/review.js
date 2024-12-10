const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewsSchema = Schema({
    comment : { 
                type : String,          
            },
    rating :{
                type : Number,
                min : 1,
                max : 5
            },
    createdAT : {
                    type : Date,
                    default : Date.now(),
                },
    author :{
                type : Schema.Types.ObjectId,
                ref : "User",
            }
});

module.exports = mongoose.model("Review",reviewsSchema);