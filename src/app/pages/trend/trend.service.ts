import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Stock} from '../../core/model/stock';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {Trend} from '../../core/model/trend';

@Injectable({
  providedIn: 'root'
})
export class TrendService {

  constructor(private http: HttpClient) {

  }



  getTrend(formData): Observable<any> {
    const url = environment.base_url + 'trend';
    let httpParams = new HttpParams({fromObject: formData});

    return this.http.get<Trend[]>(url, {params: httpParams}).pipe(
      catchError(this.handleError<Trend[]>('getTrend', []))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
