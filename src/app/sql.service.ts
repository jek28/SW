import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/throw';



//import * as io from "socket.io-client";

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import {TryJSON} from './tryjson';
import { AnalyzeJSON } from  './analyzejson'; 
import {LoginJSON} from './loginjson';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class SqlService {

  private SWUrl = 'http://localhost:5000';  // URL to REST API
  //socket: any;

  constructor(private http: HttpClient) { 
    //this.socket=io(this.SWUrl)
  }


   _handleError(err: HttpErrorResponse ) {
    return Observable.throw(err.message || 'Error: Unable to complete request.');
  }



  TryConnection(jj: TryJSON){
    
    //var a: any =//.map((res) => {return res.json()});
    //console.log(a);
    return this.http.post(this.SWUrl + '/tryconnection', jj, httpOptions).catch(this._handleError)
                  
  }

  GetAndAnalyze(jj: AnalyzeJSON){
    
    //var a: any =//.map((res) => {return res.json()});
    //console.log(a);
    return this.http.post(this.SWUrl + '/getandanalyze', jj, httpOptions).catch(this._handleError)
                  
  }
  GetControlData(jj: AnalyzeJSON){
    
    //var a: any =//.map((res) => {return res.json()});
    //console.log(a);
    return this.http.post(this.SWUrl + '/getcontroldata', jj, httpOptions).catch(this._handleError)
                  
  }

  ClearServer(){
    
    //var a: any =//.map((res) => {return res.json()});
    //console.log(a);
    return this.http.delete(this.SWUrl + '/clear',  httpOptions).catch(this._handleError)
                  
  }

  Login(jj: LoginJSON){
    return this.http.post(this.SWUrl + '/login', jj, httpOptions).catch(this._handleError)
  }

  GetSettings(){
    return this.http.get(this.SWUrl + '/getsettings',  httpOptions).catch(this._handleError)
  }


  
}