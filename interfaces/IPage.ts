export interface IPage {
    _id?    : string;
    name    : string;
    slug    : string;
    img?    : string;
    groups? : any[];
    category : string;

    createdAt?: string;
    updatedAt?: string;
}