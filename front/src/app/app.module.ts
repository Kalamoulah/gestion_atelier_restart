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
import { FormVenteComponent } from './article-vente/form-vente/form-vente.component';
import { ListeVenteComponent } from './article-vente/liste-vente/liste-vente.component';
import { ItemVenteComponent } from './article-vente/liste-vente/item-vente/item-vente.component';


const routes: Routes = [
  { path: 'category', component: CategoryComponent },
  { path: 'article', component: ArticleComponent },
  { path: 'article-vente', component: ArticleVenteComponent },
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
    FormVenteComponent,
    ListeVenteComponent,
    ItemVenteComponent,

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
