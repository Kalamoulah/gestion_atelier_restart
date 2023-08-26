import { AbstraitInterface } from "./abstrait.interface";
import { dataResponseCategory } from "./response.interface";

export interface ArticleInterface extends AbstraitInterface{
    // id:number
    // libelle: string;
    prix: number;
    stock: number;
    categorie: string;
    fournisseur: string;
    path_url: string;
    reference: string
}


export interface  fournisseurCategory {
    fournisseurs: dataResponseCategory[]
    categories: dataResponseCategory[]
}