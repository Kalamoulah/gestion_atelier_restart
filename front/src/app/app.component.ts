import { Component } from '@angular/core';
import { CategoriService } from './categori.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private monService: CategoriService) { }
  title = 'my-app 2.0 c';
}
