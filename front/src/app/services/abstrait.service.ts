import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseInterface } from '../interface/response.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { articleVente } from '../interface/article.interface';

@Injectable({
  providedIn: 'root'
})
export abstract class AbstraitService <T> {

  constructor(protected http: HttpClient) { }
   
    abstract uri():string;

  add(data: object): Observable<T> {
    return this.http.post<T>(`${environment.url}${this.uri()}`, data);
  }

  delete(id: number): Observable<T> {
    return this.http.delete<T>(`${environment.url}${this.uri()}/${id}`);
  }

  update(data: articleVente ,id: number): Observable<T> {
    // data['_method'] = "PUT"
    return this.http.put<T>(`${environment.url}${this.uri()}/${id}`,data);
  }
}
