import mongoose, { Schema, model, Model } from "mongoose"
import { ICategory } from "../interfaces"


const categorySchema = new Schema({
    name : { type: String },
    slug : { type: String },

    user: { 
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},{
    timestamps: true
})

const Category: Model<ICategory> = mongoose.models.Category || model('Category', categorySchema)


export default Category 