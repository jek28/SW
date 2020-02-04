import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { TryJSON } from  '../tryjson'; 
import { SqlService } from '../sql.service';
import {MymodalComponent} from '../mymodal/mymodal.component'


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
    
    private router: Router,
    private sqlservice: SqlService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
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
  ErrorAlert(error){
      const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = error ;
    }


  onSubmit(ConnectionData) {
    
    this.dataforsql.SQLhost=ConnectionData.host;  
    this.dataforsql.SQLuser=ConnectionData.user  
    this.dataforsql.SQLpw=ConnectionData.pw 
    this.dataforsql.SQLdatabase=ConnectionData.database  
    this.dataforsql.SQLtable=ConnectionData.table  
    console.warn('Dati mandati: ',this.dataforsql );

    this.sqlservice.TryConnection(this.dataforsql).subscribe(res=> {  this.rixfromsql=res;this.update();}, error => this.ErrorAlert(error))
    
    }

    update(){
        //console.warn('Risposta: ', this.rixfromsql);
        console.log('Messaggio: ',this.rixfromsql.message);
        console.log('Status: ',this.rixfromsql.status);
        if (this.rixfromsql.status==200)
        { 
          const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = this.rixfromsql.message;
          modalRef.result.then((result) => {if (result) {            
            this.router.navigateByUrl('/analyze');}}, (reason) => { });
             
        }
        else
        {
          const modalRef = this.modalService.open(MymodalComponent);
              modalRef.componentInstance.my_modal_content = this.rixfromsql.message;
          
        }
    }

    

}