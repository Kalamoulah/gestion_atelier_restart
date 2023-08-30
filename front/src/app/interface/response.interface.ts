import { AbstraitInterface } from './abstrait.interface';
import { ArticleInterface } from './article.interface';

export interface ResponseInterface {
    success: boolean;
    message: string;
    data: ArticleInterface | any;
}

export interface dataResponseCategory extends AbstraitInterface {
    // id: number,
    // libelle:string
    quantity?:number
    prix?:number
    stock?:number
}

export interface fourniseurFilter {
    libelle: string
    selected: boolean
  }
  

