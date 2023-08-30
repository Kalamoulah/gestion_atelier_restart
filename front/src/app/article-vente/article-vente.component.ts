import { Component, OnInit } from '@angular/core';
import { ArtcleVenteService } from '../services/artcle-vente.service';
import { tap } from 'rxjs';
import { ResponseInterface, dataResponseCategory } from '../interface/response.interface';
import { ArticleInterface, articleVente } from '../interface/article.interface';
import { Category, DataPaginate, DataVentePaginate } from '../interface/paginate.interface';

@Component({
  selector: 'app-article-vente',
  templateUrl: './article-vente.component.html',
  styleUrls: ['./article-vente.component.css']
})
export class ArticleVenteComponent implements OnInit {



  constructor(private _ArticleVenteService: ArtcleVenteService) { }

  categories!: dataResponseCategory[];
  categoriesVente! : Category[]
  articleVente!: articleVente[]
  currentPage: number = 0;
  allArticlePaginate: number = 0;
  dataPaginate! : articleVente[]

  ngOnInit(): void {
    this.getData()
    this.paginationArticle()
  }
  getData() {
    this._ArticleVenteService.all().pipe(
      tap({
        next: (res: any) => {
          // console.log(res);
         this.categoriesVente = res.data?.categories.categorieVente
        //  console.log( this.categoriesVente );
         
          this.categories = res.data?.categories.categorie;
          // console.log(this.categories);
          
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
      if (res.success) {
        this.articleVente = this.articleVente.filter(article => article.id != id)
      }
    });
  }
    
  paginationArticle() {
    this._ArticleVenteService.paginate(this.currentPage).subscribe((res: DataVentePaginate) => {
      console.log(res);
      this.dataPaginate = res.data
      this.allArticlePaginate = res.meta.total;
      console.log(this.allArticlePaginate);
      
    })
  }
  

  sendDataForm(data:any) {
    console.log(data);
    
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


