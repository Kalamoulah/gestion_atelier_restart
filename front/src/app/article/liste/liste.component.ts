import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArticleInterface } from 'src/app/interface/article.interface';

@Component({
  selector: 'app-liste',
  templateUrl: './liste.component.html',
  styleUrls: ['./liste.component.css']
})
export class ListeComponent {

  @Output() articleId = new EventEmitter<number>();
  @Output() articleUpdate = new EventEmitter<ArticleInterface>();

  @Input() articleData!: ArticleInterface[]
  @Input() successToDelete!: boolean

  onDeleteArticle(event: number) {
    this.articleId.emit(event)
  }

  updateArticle(data: ArticleInterface) {
    console.log(data);
    this.articleUpdate.emit(data)
  }

}

