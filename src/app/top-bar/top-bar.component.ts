import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import { SqlService } from '../sql.service';


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
  ) { }

  ngOnInit() {
  }

  ResetServer()
  {
    if(confirm("Sicuro di voler cambiare connessione? ")) {
    this.sqlservice.ClearServer().subscribe(res=> {  this.rixfromserver=res;
      console.log('Status: ',this.rixfromserver.status)
        this.router.navigateByUrl('/tryconnection');
        }), error => alert(error);
    }  
  }

  Exit()
  {
    if(confirm("Sicuro di voler tornare alla pagina principale? ")) {
    this.sqlservice.ClearServer().subscribe(res=> {  this.rixfromserver=res;
      console.log('Status: ',this.rixfromserver.status)
        this.router.navigateByUrl('/');
        }), error => alert(error);
    }
  }

  
}