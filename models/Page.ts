import mongoose, { Schema, model, Model } from "mongoose"
import { IPage } from "../interfaces"


const pageSchema = new Schema({
    name    : { type: String },
    url     : { type: String },
    slug    : { type: String },
    img     : { type: String },
    groups  : [{
        name: { type: String },
        url : { type: String },
        img : { type: String },
    }],
    category: { type: mongoose.Types.ObjectId,  ref: 'Category', },
},{
    timestamps: true
})

const Page: Model<IPage> = mongoose.models.Page || model('Page', pageSchema)


export default Page