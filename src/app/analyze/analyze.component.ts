import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router'
import {Chart} from 'chart.js';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';


import { AnalyzeJSON } from  '../analyzejson'; 
import { SqlService } from '../sql.service';
import {MymodalComponent} from '../mymodal/mymodal.component'


import { timer } from 'rxjs/observable/timer';
import { concatMap, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.css']
})
export class AnalyzeComponent implements OnInit {

  rixfromserver: any ;
  analyzeForm;
  dataforsw= new AnalyzeJSON();
  chart=[];
  chartControl=[];
  graphexist=false;
  mytimer: any;
  rixcontrol: any ;
  graphcontrolexist=false;
  


 

  constructor(
    private router: Router,
    private sqlservice: SqlService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    
  ) { }

  ngOnInit() {
    this.analyzeForm = this.formBuilder.group({
      time: '',
      zona1: '',
      zona2: '',
      ss: '',
      dd: '',

      });

      this.sqlservice.GetSettings().subscribe(res=> {  
      this.rixfromserver=res;
      this.analyzeForm = this.formBuilder.group({
      time: this.rixfromserver.analysis[0].time,
      zona1: this.rixfromserver.analysis[0].zona1,
      zona2: this.rixfromserver.analysis[0].zona2,
      ss: this.rixfromserver.analysis[0].ss,
      dd: this.rixfromserver.analysis[0].dd,

      });
      
      }), error => alert(error);

      
  }


  resetClick()
  {
    this.graphexist=false;
    console.log("function called");
    this.chart.destroy();
    

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
           const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = this.rixfromserver.message;
         
        }
        else 
        {
          
          const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = 'Grado e punto di settle wave calcolati ';

            if (this.graphexist==false){
              
              
              var date = new Date(this.rixfromserver.Datetime * 1000).toISOString() //.match(/(\d{2}:\d{2}:\d{2})/)

              this.chart=new Chart('canvas', {
                type:'line',
                data: {
                labels: [date], //none
                datasets: [    //none 
                  {
                  label: 'SW degree',
                  data: [this.rixfromserver.SWDegree],//none
                  borderColor: "#bae755",
                  borderDash: [5, 5],
                  backgroundColor: "#e755ba",
                  pointBackgroundColor: "#55bae7",
                  pointBorderColor: "#55bae7",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  {
                  label: 'SW point',
                  data: [this.rixfromserver.SWPoint],//none
                  borderColor: "#3D1107",
                  borderDash: [5, 5],
                  backgroundColor: "#682213",
                  pointBackgroundColor: "#0000FF",
                  pointBorderColor: "#665C0D",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  {
                  label: 'SW missing',
                  data: [this.rixfromserver.missing],//none
                  borderColor: "#3D1107",
                  borderDash: [5, 5],
                  backgroundColor: "#682213",
                  pointBackgroundColor: "#0000FF",
                  pointBorderColor: "#665C0D",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  {
                  label: 'element analyzed',
                  data: [this.rixfromserver.dataline],//none
                  borderColor: "#3D1107",
                  borderDash: [5, 5],
                  backgroundColor: "#682213",
                  pointBackgroundColor: "#0000FF",
                  pointBorderColor: "#665C0D",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  
                  ]
                },
                options: {
                legend:{
                display:true
                },
                scales:{
                  xAxes:[{
                  display:true
                  }],
                  yAxes:[{
                  display:true
                  }]
                }
                }
                })  

              this.graphexist=true
              
              }
            else{
                
                
                var date = new Date(this.rixfromserver.Datetime * 1000).toISOString() //.match(/(\d{2}:\d{2}:\d{2})/)

                this.chart.data.labels.push(date);
                this.chart.data.datasets[0].data.push([this.rixfromserver.SWDegree]);
                this.chart.data.datasets[1].data.push([this.rixfromserver.SWPoint]);
                this.chart.data.datasets[2].data.push([this.rixfromserver.missing]);
                this.chart.data.datasets[3].data.push([this.rixfromserver.dataline]);
                
                

                if (this.chart.data.labels.length>5)
                {
                  this.chart.data.labels.pop();
                  this.chart.data.datasets[0].data.shift();
                  this.chart.data.datasets[1].data.shift();
                  this.chart.data.datasets[2].data.shift();
                  this.chart.data.datasets[3].data.shift();
                  
                }
                this.chart.update();
                
          }
        

          }

    
      
   
    }





///////////////////////////////////////////////////////////////////////////////////////////////////
//                                         CONTROL
///////////////////////////////////////////////////////////////////////////////////////////////////




    StartControl(ConnectionData) {
      console.log("contorllo partito")

    this.dataforsw.time=ConnectionData.time;  
    this.dataforsw.zona1=ConnectionData.zona1 ; 
    this.dataforsw.zona2=ConnectionData.zona2 ;
    this.dataforsw.smooth=ConnectionData.ss  ;
    this.dataforsw.polydeg=ConnectionData.dd  ;

    var deltatm=parseFloat(ConnectionData.time);

    console.warn('Dati mandati: ',this.dataforsw );
     
      this.mytimer=timer(0, deltatm).subscribe(()=>this.sqlservice.GetControlData(this.dataforsw).subscribe(res=> {  this.rixcontrol=res;this.updateControl();}));

      const modalRef = this.modalService.open(MymodalComponent);
      modalRef.componentInstance.my_modal_content = 'Controllore partito';


    }
    StopControl(){
      console.log("control stop")
      this.mytimer.unsubscribe()

      const modalRef = this.modalService.open(MymodalComponent);
      modalRef.componentInstance.my_modal_content = 'Controllore fermato';
      
    }

    updateControl(){
        
        console.log('Status: ',this.rixcontrol.status);
        if (this.rixcontrol.status!=200)
        {
           const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = this.rixcontrol.message;
         
        }
        else 
        {
          
          

            if (this.graphcontrolexist==false){
              
              
              var date = new Date(this.rixcontrol.Datetime * 1000).toISOString() //.match(/(\d{2}:\d{2}:\d{2})/)

              this.chartControl=new Chart('canvas2', {
                type:'line',
                data: {
                labels: [date], //none
                datasets: [    //none 
                  {
                  label: 'SW degree',
                  data: [this.rixcontrol.SWDegree],//none
                  borderColor: "#bae755",
                  borderDash: [5, 5],
                  backgroundColor: "#e755ba",
                  pointBackgroundColor: "#55bae7",
                  pointBorderColor: "#55bae7",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  {
                  label: 'SW point',
                  data: [this.rixcontrol.SWPoint],//none
                  borderColor: "#3D1107",
                  borderDash: [5, 5],
                  backgroundColor: "#682213",
                  pointBackgroundColor: "#0000FF",
                  pointBorderColor: "#665C0D",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  {
                  label: 'SW missing',
                  data: [this.rixcontrol.missing],//none
                  borderColor: "#3D1107",
                  borderDash: [5, 5],
                  backgroundColor: "#682213",
                  pointBackgroundColor: "#0000FF",
                  pointBorderColor: "#665C0D",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  {
                  label: 'element analyzed',
                  data: [this.rixcontrol.dataline],//none
                  borderColor: "#3D1107",
                  borderDash: [5, 5],
                  backgroundColor: "#682213",
                  pointBackgroundColor: "#0000FF",
                  pointBorderColor: "#665C0D",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false
                  },
                  
                  ]
                },
                options: {
                legend:{
                display:true
                },
                scales:{
                  xAxes:[{
                  display:true
                  }],
                  yAxes:[{
                  display:true
                  }]
                }
                }
                })  

              this.graphcontrolexist=true
              
              }
            else{
                
                
                var date = new Date(this.rixcontrol.Datetime * 1000).toISOString() //.match(/(\d{2}:\d{2}:\d{2})/)

                this.chartControl.data.labels.push(date);
                this.chartControl.data.datasets[0].data.push([this.rixcontrol.SWDegree]);
                this.chartControl.data.datasets[1].data.push([this.rixcontrol.SWPoint]);
                this.chartControl.data.datasets[2].data.push([this.rixcontrol.missing]);
                this.chartControl.data.datasets[3].data.push([this.rixcontrol.dataline]);
                
                

                if (this.chartControl.data.labels.length>5)
                {
                  this.chartControl.data.labels.pop();
                  this.chartControl.data.datasets[0].data.shift();
                  this.chartControl.data.datasets[1].data.shift();
                  this.chartControl.data.datasets[2].data.shift();
                  this.chartControl.data.datasets[3].data.shift();
                  
                }
                this.chartControl.update();
                
          }
        

          }

    
      
   
    }



}