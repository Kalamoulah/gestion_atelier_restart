import { AbstraitInterface } from "./abstrait.interface";
import { articleVente } from "./article.interface";

export interface Category extends AbstraitInterface{
    // id: number;
    // libelle: string;
    checked?:boolean
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Meta {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface DataPaginate {
    data: Category[];
    meta: Meta;
}

export interface DataVentePaginate {
    data: articleVente[];
    meta: Meta;
}
