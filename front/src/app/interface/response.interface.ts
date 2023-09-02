import { AbstraitInterface } from './abstrait.interface';
import { ArticleInterface } from './article.interface';

export interface ResponseInterface {
    success: boolean;
    message: string;
    data: ArticleInterface | any;
}

export interface dataResponseCategory extends AbstraitInterface {
    // id: number,
    libelleConf:string
    quantity?:number
    prix?:number
    stock?:number
    categorie?: string
}

export interface fourniseurFilter {
    libelle: string
    selected: boolean
  }
  

