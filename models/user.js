const mongoose = require('mongoose'),
 { ObjectId } = mongoose.Schema.Types;

 userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/insta-clone-react/image/upload/v1616392399/450px-No_image_available.svg_vtrex8.png"
    },
    followers:[{
        type:ObjectId, ref:"User"
    }],
    following:[{
        type:ObjectId, ref:"User"
    }]



})

 mongoose.model("User", userSchema)