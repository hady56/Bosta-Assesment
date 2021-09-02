const mongoose= require("mongoose")
const passportLocalMongoose=require("passport-local-mongoose")

const Schema = mongoose.Schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {

        type: String,
        required: true,
        unique: true
    },
    verified: {
        type:Boolean,
        default:false
    },
    checks:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Check'

    }]

},
    { timestamps: true })

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model("User", userSchema)
module.exports=User;

