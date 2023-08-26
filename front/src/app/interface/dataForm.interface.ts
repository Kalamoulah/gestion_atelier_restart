import { dataResponseCategory } from "./response.interface";

export interface DataForm {
    // categories: dataResponseCategory[];
    image: File | undefined;
    libelle: string;
    prix: number;
    stock: number;
    // categorieValue: string;
    fournisseur: string;
    reference: string;
    selectedOption: string;
    // fournisseurs: any[];
  }