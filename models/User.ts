import mongoose, { model, Model, Schema } from "mongoose";
import { IUser } from "../interfaces";


const userSchema = new Schema({
    email    : { type: String },
    password : { type: String }
},{
    timestamps: true
})


const User: Model<IUser> = mongoose.models.User || model('User', userSchema)

export default User