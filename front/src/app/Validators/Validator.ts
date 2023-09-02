import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { dataResponseCategory } from '../interface/response.interface';

export class validatorArrayForm {
//   static confectionArray: string;
  static validateCategories(categories: dataResponseCategory[], confectionArray: FormArray): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const libelleCOnf = control.value;
      const categorieList = ['fil', 'tissue', 'bouton'];
      const article = categories.find((art) => art.libelle == libelleCOnf);

      if (!article) {
        console.log('erreur article');
      }
      const categorie = article?.categorie;

      if (confectionArray.length < 3) {
        console.log("matoul");  
        return null;      
      }

      console.log(confectionArray.value);
      

      

      return null;
    };
  }
}
