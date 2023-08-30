import { Component, EventEmitter, Input, Output } from '@angular/core';
import { articleVente } from 'src/app/interface/article.interface';
import { Category } from 'src/app/interface/paginate.interface';

@Component({
  selector: 'app-liste-vente',
  templateUrl: './liste-vente.component.html',
  styleUrls: ['./liste-vente.component.css']
})
export class ListeVenteComponent {



 @Input() articleVente!: articleVente[]

 @Output() deleteArticle = new EventEmitter<number>();
 @Output() updateArticle = new EventEmitter<articleVente>();

 @Input() allArticlePaginate! :number

 @Input() dataPaginate! : articleVente[]
 @Output() pageChanged = new EventEmitter<number>(); 
  @Input() currentPage!: number;

  articleDelete(event: number) {
    this.deleteArticle.emit(event)
  }

  renderPage(event: number) {
    console.log("New Page:", event);
    this.currentPage = event;
    this.pageChanged.emit(event);
  }

  updateDataArticle(data: articleVente) {
   console.log(data);
    this.updateArticle.emit(data)
   }
  
}
