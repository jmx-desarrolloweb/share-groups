import mongoose, { Schema, model, Model } from "mongoose"
import { IGroup } from "../interfaces"


const groupSchema = new Schema({
    name    : { type: String },
    url     : { type: String },
    slug    : { type: String },
    img     : { type: String },
},{
    timestamps: true
})

const Group: Model<IGroup> = mongoose.models.Group || model('Group', groupSchema)


export default Group