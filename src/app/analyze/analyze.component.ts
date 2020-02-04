import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {Router} from '@angular/router'
import {Chart} from 'chart.js';
import 'chartjs-plugin-zoom'

import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';


import { AnalyzeJSON } from  '../analyzejson'; 
import { SqlService } from '../sql.service';
import {MymodalComponent} from '../mymodal/mymodal.component'


import { timer } from 'rxjs/observable/timer';
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
  hist=[];
  cloud=[];
  graphexist=false;
  
  
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

  ErrorAlert(error){
      const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = error ;
    }


  resetClick()
  {
    this.graphexist=false;
    console.log("reset grafico ");
    this.chart.destroy();
    this.hist.destroy();
    this.cloud.destroy();
    

  }
  
  Submit(ConnectionData) {
    
    this.dataforsw.time=ConnectionData.time;  
    this.dataforsw.zona1=ConnectionData.zona1 ; 
    this.dataforsw.zona2=ConnectionData.zona2 ;
    this.dataforsw.smooth=ConnectionData.ss  ;
    this.dataforsw.polydeg=ConnectionData.dd  ;

    console.warn('Dati mandati: ',this.dataforsw );


    this.sqlservice.GetAndAnalyze(this.dataforsw).subscribe(res=> {  this.rixfromserver=res;this.update();}, error => this.ErrorAlert(error))
    }

  update(){
        //console.warn('Risposta: ', this.rixfromsql);
        console.log('Status analisi : ',this.rixfromserver.status);
        if (this.rixfromserver.status!=200)
        {
           const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = this.rixfromserver.message;
         
        }
        else 
        {
          
          const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = 'Grado e punto di settle wave calcolati ';
          
          this.createHist(this.rixfromserver.hist_count,this.rixfromserver.hist_division)
          this.createCloud(this.rixfromserver.DateTimeID,this.rixfromserver.SWDegrees)
          this.manageGraph()

            
                
          }
        

          

    
      
   
    }

    createHist(hist_count,hist_division) {

        if (this.graphexist==true){
          this.hist.destroy()
        }
        this.hist= new Chart('canvas_hist', {
                type:'bar',
                data: {
                labels: hist_division, //none
                datasets: [    //none 
                  {
                  label: 'N. SW detected ',
                  data: hist_count,//none
                  
                  borderColor: "#bae755",
                  borderDash: [5, 5],
                  backgroundColor: "#e755ba",
                  pointBackgroundColor: "#55bae7",
                  pointBorderColor: "#55bae7",
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

    }

    createCloud(DateTimeID, Degrees) {

        if (this.graphexist==true){
          this.cloud.destroy()
        }
        this.cloud= new Chart('canvas_cloud', {
                type:'line',
                data: {
                labels: DateTimeID, //none
                datasets: [    //none 
                  {
                  label: 'N. SW detected ',
                  data: Degrees,//none
                  
                  borderColor: "#55bae7",
                  borderDash: [5, 5],
                  //backgroundColor: "#e755ba",
                  pointBackgroundColor: "#55bae7",
                  pointBorderColor: "#55bae7",
                  pointHoverBackgroundColor: "#55bae7",
                  pointHoverBorderColor: "#55bae7",
                  fill: false ,
                  showLine: false
                  },
                  ]
                },
                options: {
                  legend:{
                  display:true
                  },
                  scales:{
                    xAxes:[{
                      display:false
                     }],
                    yAxes:[{
                      display:true,
                      ticks: {
                        min: -1,
                        max: 2
                        }
                      }]
                  },
                  pan: {
                    enabled: true,
                    mode: 'y',     
                    },
                  zoom: {
                    enabled: true,         
                    mode: 'y',     
                  },
                  responsive: true
                  },
                 
                })  

    }

    manageGraph(){
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
                
                
                

                if (this.chart.data.labels.length>5)
                {
                  this.chart.data.labels.pop();
                  this.chart.data.datasets[0].data.shift();
                  this.chart.data.datasets[1].data.shift();
                  this.chart.data.datasets[2].data.shift();
                  
                  
                }
                this.chart.update();
              }
    }








}