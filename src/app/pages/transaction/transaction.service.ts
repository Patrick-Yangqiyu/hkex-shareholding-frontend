import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Trend} from '../../core/model/trend';
import {catchError} from 'rxjs/operators';
import {Stock} from '../../core/model/stock';
import {Transaction} from '../../core/model/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private http: HttpClient) {
  }

  getTranscation(formData): Observable<any> {
    const url = environment.base_url + 'transaction';
    let httpParams = new HttpParams({fromObject: formData});

    return this.http.get<Transaction[]>(url, {params: httpParams}).pipe(
      catchError(this.handleError<Transaction[]>('getTransaction', []))
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
