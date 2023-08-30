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

 @Input() allArticlePaginate! :number

 @Input() dataPaginate! : articleVente[]
  // currentPage: number = 1;
  @Input() currentPage!: number;

  articleDelete(event: number) {
    this.deleteArticle.emit(event)
  }

  renderPage(event: number) {
    console.log("New Page:", event);
    this.currentPage = event;
  }
  
}
