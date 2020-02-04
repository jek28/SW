import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { SqlService } from '../sql.service';

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {MymodalComponent} from '../mymodal/mymodal.component'


@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  rixfromserver: any ;

  constructor(
    private router: Router,
    private sqlservice: SqlService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  ResetServer()
  {
    if(confirm("Sicuro di voler cambiare connessione? ")) {
    this.sqlservice.ClearServer().subscribe(res=> {  this.rixfromserver=res;
      console.log('Status: ',this.rixfromserver.status)
        this.router.navigateByUrl('/tryconnection');
        }, error => this.ErrorAlert(error));
    }  
  }

  Exit()
  {
    if(confirm("Sicuro di voler tornare alla pagina principale? ")) {
    this.sqlservice.ClearServer().subscribe(res=> {  this.rixfromserver=res;
      console.log('Status: ',this.rixfromserver.status)
        this.router.navigateByUrl('/');
        }, error => this.ErrorAlert(error));
    }
  }


 

  Navigate(ss)
  {
      this.router.navigateByUrl('/'+ss);
  }

  ErrorAlert(error){
      const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = error ;
    }

  

  
}