import { ICategory } from "./ICategory"

export interface ISection {
    _id?     : string
    title    : string
    category?: ICategory
    active   : boolean
}