import { Injectable } from '@angular/core';
import { AbstraitService } from './abstrait.service';
import { environment } from 'src/environments/environment.development';
import { Observable } from 'rxjs';
import { DataPaginate, DataVentePaginate } from '../interface/paginate.interface';

@Injectable({
  providedIn: 'root'
})
export class ArtcleVenteService extends AbstraitService<any>{

  override uri(): string {
    return "article-vente"
  }

  all(): Observable<any> {
    return this.http.get<any>(`${environment.url}allArticle`);
  }

  paginate(page: number) :Observable<DataVentePaginate>{
    return this.http.get<DataVentePaginate>(`${environment.url}${this.uri()}?page=${page}`);
  }

    

}

