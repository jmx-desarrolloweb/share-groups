export interface IGroup {
    _id?     : string;
    name     : string;
    url      : string;
    slug?    : string;
    img?     : string;
    category : string;

    createdAt?: string;
    updatedAt?: string;
}