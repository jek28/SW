import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';

import { TryJSON } from  '../tryjson'; 
import { SqlService } from '../sql.service';

@Component({
  selector: 'app-try-connection',
  templateUrl: './try-connection.component.html',
  styleUrls: ['./try-connection.component.css']
})
export class TryConnectionComponent implements OnInit {

  rixfromsql: any ;
  checkoutForm;
  dataforsql= new TryJSON();

  constructor(
    private router: Router,
    private sqlservice: SqlService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.checkoutForm = this.formBuilder.group({
      host: '',
      user: '',
      pw: '',
      database: '',
      table: '',

      });
  }

  onSubmit(ConnectionData) {
    
    this.dataforsql.SQLhost=ConnectionData.host;  
    this.dataforsql.SQLuser=ConnectionData.user  
    this.dataforsql.SQLpw=ConnectionData.pw 
    this.dataforsql.SQLdatabase=ConnectionData.database  
    this.dataforsql.SQLtable=ConnectionData.table  
    console.warn('Dati mandati: ',this.dataforsql );

    this.sqlservice.TryConnection(this.dataforsql).subscribe(res=> {  this.rixfromsql=res;this.update();}), error => alert(error);
    
    }

    update(){
        //console.warn('Risposta: ', this.rixfromsql);
        console.log('Messaggio: ',this.rixfromsql.message);
        console.log('Status: ',this.rixfromsql.status);
        if (this.rixfromsql.status!=200)
        {
            this.checkoutForm.reset()
            window.alert(this.rixfromsql.message);
        }
        else
        {
          window.alert(this.rixfromsql.message);
          this.router.navigateByUrl('/analyze');
        }
    }

}