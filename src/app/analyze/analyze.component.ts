import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router'


import { AnalyzeJSON } from  '../analyzejson'; 
import { SqlService } from '../sql.service';



@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css']
})
export class AnalyzeComponent implements OnInit {

  rixfromserver: any ;
  analyzeForm;
  dataforsw= new AnalyzeJSON();


  constructor(
    private router: Router,
    private sqlservice: SqlService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.analyzeForm = this.formBuilder.group({
      time: '',
      zona1: '',
      zona2: '',
      ss: '',
      dd: '',

      });
  }

  onSubmit(ConnectionData) {
    
    this.dataforsw.time=ConnectionData.time;  
    this.dataforsw.zona1=ConnectionData.zona1 ; 
    this.dataforsw.zona2=ConnectionData.zona2 ;
    this.dataforsw.smooth=ConnectionData.ss  ;
    this.dataforsw.polydeg=ConnectionData.dd  ;

    console.warn('Dati mandati: ',this.dataforsw );

    this.sqlservice.GetAndAnalyze(this.dataforsw).subscribe(res=> {  this.rixfromserver=res;this.update();}), error => alert(error);
    
    }

  update(){
        //console.warn('Risposta: ', this.rixfromsql);
        console.log('Status: ',this.rixfromserver.status);
        if (this.rixfromserver.status!=200)
        {
            this.analyzeForm.reset()
            window.alert(this.rixfromserver.message);
        }
        else
        {
          window.alert('Grado di settle wave calcolato: '+  this.rixfromserver.SWDegree);
          //this.router.navigateByUrl('/analyze');
        }
    }

}