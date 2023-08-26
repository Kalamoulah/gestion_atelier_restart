import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseInterface } from './interface/response.interface';
import { DataPaginate } from './interface/paginate.interface';
// import { HttpHeaders } from "";

@Injectable({
  providedIn: 'root'
})

export class CategoriService {
  private BASE_URL = 'http://127.0.0.1:8000/api/'
  constructor(private _http: HttpClient) { }

  getAll(page: number) :Observable<DataPaginate>{
    return this._http.get<DataPaginate>(this.BASE_URL + 'category' + '?page=' + page);
  }


  addCategorie(libelle: object): Observable<ResponseInterface> {
    return this._http.post<ResponseInterface>(this.BASE_URL + 'category', libelle);
  }


  search(libelle: object) :Observable<ResponseInterface>{
    return this._http.post<ResponseInterface>(this.BASE_URL + 'search', libelle);
  }


  updateCategory(libelle: object, id: number) :Observable<ResponseInterface>{
    return this._http.put<ResponseInterface>(this.BASE_URL + 'category/' + id, libelle);
  }
  

  deleteCategory(ids: number[] | number): Observable<ResponseInterface>{
    if (Array.isArray(ids)) {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ids: ids}),
      };
      return this._http.delete<ResponseInterface>(this.BASE_URL + 'delete/0', options);
    } else {
      return this._http.delete<ResponseInterface>(this.BASE_URL + `delete/${ids}`);
    }
  }
}
