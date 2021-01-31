import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {Stock} from '../model/stock';
import {environment} from '../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  constructor(private http: HttpClient) {

  }

  getStocks(): Observable<Stock[]> {
    const url = environment.base_url + 'stock';
    return this.http.get<Stock[]>(url).pipe(
      catchError(this.handleError<Stock[]>('getStocks', []))
    );

  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
