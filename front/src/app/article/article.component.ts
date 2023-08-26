import { Component, OnInit, ViewChild } from '@angular/core';
import { ArticleService } from '../services/article.service';
import { DataForm } from '../interface/dataForm.interface';
import { ResponseInterface } from '../interface/response.interface';
import { ArticleInterface, fournisseurCategory } from '../interface/article.interface';
import { tap } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { FormComponent } from './form/form.component';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})

export class ArticleComponent implements OnInit {
  @ViewChild(FormComponent, { static: false }) formComponent!: FormComponent;
  constructor(private _ArticleService: ArticleService) { }
  dataForm!: fournisseurCategory
  articleData!: ArticleInterface[]
  successToDelete: boolean = false
  // articleDataUpdate!: ArticleInterface

  ngOnInit(): void {
    this.getData()
    // console.log(this.articleDataUpdate);
  }

  
  // chargerFormulaire(article: ArticleInterface)
  // {
  //   this.formulaire?.patchValue(article);
  // }
  

  // =================================================================================================
  // addArticle(data: FormData) {
  //   this._ArticleService.add(data).subscribe((res: ResponseInterface) => {
        
        
  //   });
  // }
  articleDataUpdate(article : ArticleInterface)
  {
   this.formComponent.chargerFormulaire(article)
   
  }

  addArticle(data: FormData) {  
   console.log(this.articleDataUpdate);
   
  //   if (this.articleDataUpdate) {
  //  console.log(data);
  //     this._ArticleService.update(data, this.articleDataUpdate.id).subscribe((res: any) => {
  //       console.log(res);
  //     });
  //   } else {
  //     this._ArticleService.add(data).subscribe((res: ResponseInterface) => {
  //       console.log(res);
  //       this.articleData.unshift(res.data[0]);
  //     });
  //   }
  }

  // =================================================================================================
  getData() {
    this._ArticleService.all().pipe(
      tap({
        next:(res: ResponseInterface) =>{
          this.dataForm = res.data['form'];
          this.articleData = res.data['article'];
          console.log('Données reçues :', this.dataForm, this.articleData);
        },
        complete: ()=>{
          console.log('observable terminé');
        },
        error:(err)=>{
          console.error("Une erreur s'est produite :", err);
          
        }
      })
    ).subscribe();
  }

  // =================================================================================================

  // deleteArticle(id: number) {
  //   this._ArticleService.delete(id).subscribe((res: ResponseInterface) => {
  //     if (res.success) {
  //       this.articleData = this.articleData.filter(article => article.id != id)
  //     }
  //   });
  // }

  // articleUpdate(data: ArticleInterface) {
    //  console.log(data);
  // console.log(this.articleDataUpdate);
  
    // this.articleDataUpdate = data;
    //  this.articleUpdate
  // }

}
