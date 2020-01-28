import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {TryJSON} from './tryjson';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SqlService {

  private SWUrl = 'http://localhost:4999';  // URL to REST API

  constructor(private http: HttpClient) { }

  TryConnection(jj: TryJSON){
    return this.http.post(this.SWUrl + '/tryconnection', jj, httpOptions);

  

}
}