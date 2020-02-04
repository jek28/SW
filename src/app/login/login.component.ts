import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';

import { LoginJSON } from  '../loginjson'; 
import { SqlService } from '../sql.service';
import {MymodalComponent} from '../mymodal/mymodal.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  rixfromsql: any ;
  loginForm;
  dataforlogin= new LoginJSON();
  errorMsg;
  

  constructor(private router: Router,
    private sqlservice: SqlService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,) {
      
     }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      user: '',
      pw: '',
      });
  }
  
  onSubmit(ConnectionData){
    this.dataforlogin.user=ConnectionData.user
    this.dataforlogin.pw=ConnectionData.pw 
    console.warn('Dati mandati: ',this.dataforlogin );

    this.sqlservice.Login(this.dataforlogin).subscribe(res=> {  this.rixfromsql=res;this.update();}, error => this.ErrorAlert(error) )
  }

  update(){
        //console.warn('Risposta: ', this.rixfromsql);
        console.log('Messaggio: ',this.rixfromsql.message);
        console.log('Status: ',this.rixfromsql.status);
        if (this.rixfromsql.status!=200)
        {
            this.loginForm.reset()
            //window.alert(this.rixfromsql.message);
            const modalRef = this.modalService.open(MymodalComponent);
            modalRef.componentInstance.my_modal_content = this.rixfromsql.message;
        }
        else
        {
          //window.alert(this.rixfromsql.message);

          const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = this.rixfromsql.message;
          modalRef.result.then((result) => {if (result) {            
            this.router.navigateByUrl('/tryconnection');}}, (reason) => { });

          
        }
    }
    ErrorAlert(error){
      const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = error + " Server non connesso.";
    }
    

}

