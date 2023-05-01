import { ICategory } from "./ICategory"
import { IGroup } from "./IGroup"

export interface ISection {
    _id?     : string
    title    : string
    category?: ICategory
    active   : boolean
}

export interface ISectionWithGroups {
    _id?     : string
    title    : string
    category?: ICategory
    groups   : IGroup[]
    active   : boolean
}