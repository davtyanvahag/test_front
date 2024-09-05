import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
interface HttpHeaderOptions {
  headers: HttpHeaders;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  constructor(private http: HttpClient) {}

  get(path: string, httpOption?: HttpHeaderOptions): Observable<any> {
    return this.http.get(environment.apiUrl + '/' + path, httpOption);
  }

  post(
    path: string,
    data: any,
    httpOption?: HttpHeaderOptions
  ): Observable<any> {
    console.log('aa::', environment.apiUrl + path);
    return this.http.post(environment.apiUrl + '/' + path, data, httpOption);
  }

  put(
    path: string,
    data: any,
    httpOption?: HttpHeaderOptions
  ): Observable<any> {
    return this.http.put(environment.apiUrl + '/' + path, data, httpOption);
  }

  delete(path: string, httpOption?: HttpHeaderOptions): Observable<any> {
    console.log(path);
    return this.http.delete(environment.apiUrl + '/' + path, httpOption);
  }
}
