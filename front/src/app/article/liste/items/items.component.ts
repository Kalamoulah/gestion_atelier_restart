import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ArticleInterface } from 'src/app/interface/article.interface';
import { FormComponent } from '../../form/form.component';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent {
 

  @Input() articleData!: ArticleInterface[]
  @Output() deleteArticle = new EventEmitter<number>();
   @Output() updateArticle = new EventEmitter<ArticleInterface>();

  allStudents: number = 0;
  pagination: number = 1;
  onClickBtnButton(event: Event) {
    const element = event.target as HTMLButtonElement
    const idArticle = +element.value
    this.updateTextButton(element, idArticle)

    const value = element.textContent?.substring(0, 2)
    //  console.log(value);

    if (value === 'OK') {
      this.deleteArticle.emit(idArticle)
    }
  }

  updateTextButton(element: HTMLButtonElement, id: number) {
    if (element.textContent === "Supp") {
      let timer = 4
      const timerInterval = setInterval(() => {
        timer--;
        if (timer == 0) {
          clearInterval(timerInterval);
          element.textContent = 'Supp'
        } else {
          element.textContent = `OK (${timer}s)`

        }
      }, 1000)
    }
  }

  edit(data: any)
  {
    const articleDataUpdate = data
    // console.log(articleDataUpdate);
    
    this.updateArticle.emit(articleDataUpdate)
  }



  renderPage(event: number) {
    this.pagination = event;
    this.allStudents = this.articleData.length
  }
}
