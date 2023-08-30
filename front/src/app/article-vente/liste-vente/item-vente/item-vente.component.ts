import { Component, EventEmitter, Input, Output } from '@angular/core';
import { articleVente } from 'src/app/interface/article.interface';
import { Category } from 'src/app/interface/paginate.interface';

@Component({
  selector: '.app-item-vente',
  templateUrl: './item-vente.component.html',
  styleUrls: ['./item-vente.component.css']
})
export class ItemVenteComponent {
   @Input() articleVente!: articleVente[]

   @Input() dataPaginate!: articleVente;
   @Input() allArticlePaginate! :number
   @Output() deleteArticle = new EventEmitter<number>();


   deleteArt(idArticle: articleVente) {
        console.log(idArticle.id);
        this.deleteArticle.emit(idArticle.id)
    }
}

