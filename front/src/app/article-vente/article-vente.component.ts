import { Component, OnInit, ViewChild } from '@angular/core';
import { ArtcleVenteService } from '../services/artcle-vente.service';
import { tap } from 'rxjs';
import { ResponseInterface, dataResponseCategory } from '../interface/response.interface';
import { ArticleInterface, articleVente } from '../interface/article.interface';
import { Category, DataPaginate, DataVentePaginate } from '../interface/paginate.interface';
import { FormVenteComponent } from './form-vente/form-vente.component';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css']
})
export class ArticleVenteComponent implements OnInit {

  constructor(private _ArticleVenteService: ArtcleVenteService) { }

  @ViewChild(FormVenteComponent, { static: false }) formVenteComponent!: FormVenteComponent;

  categories!: dataResponseCategory[];
  categoriesVente!: Category[]
  articleVente!: articleVente[]
  currentPage: number = 1;
  allArticlePaginate: number = 0;
  dataPaginate!: articleVente[]
  updatedata!:any
  ngOnInit(): void {
    this.getData()
    this.paginationArticle(this.currentPage)
  }

  updateArticle(data: articleVente) {
    // console.log(data);
    this.updatedata = data
   
     this.formVenteComponent.chargerFormulaire(data)
  }

  getData() {
    this._ArticleVenteService.all().pipe(
      tap({
        next: (res: any) => {
          // console.log(res.data.categories?.categorie);
          console.log(res);
          
          this.categoriesVente = res.data?.categories.categorieVente
          //  console.log( this.categoriesVente );

          this.categories = res.data?.categories.categorie;
          // console.log('categorie: '+ res);

          this.articleVente = res.data?.articleVente
          // console.log(res.data);

        },
        complete: () => {
          console.log('observable terminé');
        },
        error: (err) => {
          console.error("Une erreur s'est produite :", err);
        }
      })
    ).subscribe();
  }

  articleDelete(id: number) {
    this._ArticleVenteService.delete(id).subscribe((res: ResponseInterface) => {
      console.log(res);
      if (res.success) {
        this.dataPaginate = this.dataPaginate.filter(article => article.id != id)
        console.log( this.articleVente );
      }
    });
  }

  paginationArticle(page: number) {
    this._ArticleVenteService.paginate(page).subscribe((res: DataVentePaginate) => {
      this.dataPaginate = res.data
      this.allArticlePaginate = res.meta.total;

     

    })
  }

  onPageChanged(newPage: number) {
    this.currentPage = newPage;
    this.paginationArticle(this.currentPage); 
  }

  sendDataForm(data: any) {
    // console.log(this.isEditing);
    
     if (this.formVenteComponent.isEditMode) {
  
      console.log(data);
      
      this._ArticleVenteService.update(data, this.updatedata?.id).pipe(
        tap({
          next: (res: any) => {
            console.log(res);
          },
          complete: () => {
            console.log('observable terminé');
          },
          error: (err) => {
            console.error("Une erreur s'est produite :", err);
          }
        })
      ).subscribe();
     }else{
      console.log('ajout');
      
       this._ArticleVenteService.add(data).pipe(
         tap({
           next: (res: any) => {
             console.log(res)
           },
           complete: () => {
             console.log('observable terminé');
           },
           error: (err) => {
             console.error("Une erreur s'est produite :", err);
           }
         })
       ).subscribe()
     }
  }

  updatedataForm(data: any, id: number) {
    this._ArticleVenteService.update(data, id).pipe(
      tap({
        next: (res: any) => {
          console.log(res);
        },
        complete: () => {
          console.log('observable terminé');
        },
        error: (err) => {
          console.error("Une erreur s'est produite :", err);
        }
      })
    ).subscribe();
  }

  

}


