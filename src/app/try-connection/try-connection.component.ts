import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';

import { TryJSON } from  '../tryjson'; 
import { SqlService } from '../sql.service';
import {AlertDialogService} from '../alert-dialog/alert-dialog.service'

@Component({
  selector: 'app-try-connection',
  templateUrl: './try-connection.component.html',
  styleUrls: ['./try-connection.component.css']
})
export class TryConnectionComponent implements OnInit {

  rixfromsql: any ;
  rixfromserver: any;
  checkoutForm;
  dataforsql= new TryJSON();

  constructor(
    private alertDialogService: AlertDialogService,
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

      this.sqlservice.GetSettings().subscribe(res=> {  
      this.rixfromserver=res;
      this.checkoutForm = this.formBuilder.group({
      host: this.rixfromserver.connections[0].host,
      user: this.rixfromserver.connections[0].user,
      pw: this.rixfromserver.connections[0].pw,
      database: this.rixfromserver.connections[0].database,
      table: this.rixfromserver.connections[0].table,

      });
      
      }), error => alert(error);


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
            //this.checkoutForm.reset()
            window.alert(this.rixfromsql.message);
        }
        else
        {
          window.alert(this.rixfromsql.message);

          this.alertDialogService.confirm(this.rixfromsql.message);
            //.then((confirmed) => console.log('User confirmed:', confirmed));


          this.router.navigateByUrl('/analyze');
        }
    }

    

}