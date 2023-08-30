import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArticleInterface } from '../interface/article.interface';
import { ResponseInterface } from '../interface/response.interface';
import { AbstraitService } from './abstrait.service';
import { environment } from 'src/environments/environment.development';
import { DataPaginate } from '../interface/paginate.interface';
@Injectable({
  providedIn: 'root'
})

export class ArticleService extends AbstraitService<ResponseInterface>{
  override uri(): string {
    return "article";
  }

  // add(data: object): Observable<ResponseInterface> {
  //   return this.http.post<ResponseInterface>("http://127.0.0.1:8000/api/article", data);
  // }

  all(): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(`${environment.url}${this.uri()}`);
  }

 
  // delete(id: number): Observable<ResponseInterface> {
  //   return this.http.delete<ResponseInterface>(`http://127.0.0.1:8000/api/article/${id}`);
  // }
  

  // update(data: FormData ,id: number): Observable<ResponseInterface> {
  //   data.append('_method', "put")
  //   return this.http.post<ResponseInterface>(`http://127.0.0.1:8000/api/article/${id}`,data);
  // }
}