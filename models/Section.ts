import mongoose, { Model, Schema, model } from "mongoose";
import { ISection } from "../interfaces";


const sectionSchema = new Schema({
    title   : { type: String },

    category: { type: mongoose.Types.ObjectId,  ref: 'Category', },
    active  : { type: Boolean, default: true }
},{
    timestamps: true
})

const Section: Model<ISection> = mongoose.models.Section || model('Section', sectionSchema)

export default Section