import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CategoryComponent } from './category/category.component';
import { CategoriService } from './categori.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { ArticleComponent } from './article/article.component';
import { FormComponent } from './article/form/form.component';
import { ListeComponent } from './article/liste/liste.component';
import { ItemsComponent } from './article/liste/items/items.component';
import { ArticleVenteComponent } from './article-vente/article-vente.component';

const routes: Routes = [
  { path: 'category', component: CategoryComponent },
  { path: 'article', component: ArticleComponent },
  { path: 'article-Vente', component: ArticleComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    CategoryComponent,
    ArticleComponent,
    FormComponent,
    ListeComponent,
    ItemsComponent,
    ArticleVenteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
  ],
  providers: [CategoriService],
  bootstrap: [AppComponent],
})
export class AppModule {}
