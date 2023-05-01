import { ISection } from "./ISection";

export interface IGroup {
    _id?     : string;
    name     : string;
    url      : string;
    slug?    : string;
    img?     : string;
    category : string;
    section? : string;

    active  : boolean

    createdAt?: string;
    updatedAt?: string;
}