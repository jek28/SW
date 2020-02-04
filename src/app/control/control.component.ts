import { Component, OnInit } from '@angular/core';
import {MymodalComponent} from '../mymodal/mymodal.component'
import {Router} from '@angular/router'
import {Chart} from 'chart.js';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { timer } from 'rxjs/observable/timer';
import { Observable } from 'rxjs/Observable';

import { ControlJSON } from  '../controljson'; 
import { SqlService } from '../sql.service';


@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.css']
})
export class ControlComponent implements OnInit {

  constructor(
     private router: Router,
    private sqlservice: SqlService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.controlForm = this.formBuilder.group({
      time: '',
      zona1: '',
      zona2: '',
      ss: '',
      dd: '',
      tableOUT: '',
      databaseOUT:'',

      });

      this.sqlservice.GetSettings().subscribe(res=> {  
      this.rixcontrol=res;
      this.controlForm = this.formBuilder.group({
      time: this.rixcontrol.control[0].time,
      zona1: this.rixcontrol.control[0].zona1,
      zona2: this.rixcontrol.control[0].zona2,
      ss: this.rixcontrol.control[0].ss,
      dd: this.rixcontrol.control[0].dd,
      tableOUT: this.rixcontrol.control[0].tableOUT,
      databaseOUT: this.rixcontrol.control[0].databaseOUT
      });
      
      }), error => alert(error);
  }

  ErrorAlert(error){
      const modalRef = this.modalService.open(MymodalComponent);
          modalRef.componentInstance.my_modal_content = error ;
    }


  ///////////////////////////////////////////////////////////////////////////////////////////////////
//                                         CONTROL
///////////////////////////////////////////////////////////////////////////////////////////////////

    controlForm;
    ControlPresence=false;
    mytimer: any;
    rixcontrol: any ;
    graphcontrolexist=false;
    chartControl=[];
    dataforcontrol= new ControlJSON();
    running="Control is not running";
    

    StartControl(ConnectionData) {
      console.log("controllo partito")

      this.dataforcontrol.time=ConnectionData.time;  
      this.dataforcontrol.zona1=ConnectionData.zona1 ; 
      this.dataforcontrol.zona2=ConnectionData.zona2 ;
      this.dataforcontrol.smooth=ConnectionData.ss  ;
      this.dataforcontrol.polydeg=ConnectionData.dd  ;
      this.dataforcontrol.tableOUT=ConnectionData.tableOUT  ;
      this.dataforcontrol.databaseOUT=ConnectionData.databaseOUT  ;

      var deltatm=parseFloat(ConnectionData.time);

      console.warn('Dati mandati: ',this.dataforcontrol );
      if (this.ControlPresence==false){
          if (deltatm>5 && deltatm<100) 
          {
            this.mytimer=timer(0, deltatm*1000).subscribe(()=>this.sqlservice.GetControlData(this.dataforcontrol).subscribe(res=> {  this.rixcontrol=res;this.updateControl();}), err=> this.ErrorAlert(err));

            const modalRef = this.modalService.open(MymodalComponent);
            modalRef.componentInstance.my_modal_content = 'Controllore partito';
            this.ControlPresence=true
            this.running="Control is running each " +ConnectionData.time + " seconds"
          }
          else{
            const modalRef = this.modalService.open(MymodalComponent);
            modalRef.componentInstance.my_modal_content = 'tempo immesso non valido';
          }
        }
      else{
        const modalRef = this.modalService.open(MymodalComponent);
        modalRef.componentInstance.my_modal_content = 'stoppare prima il controllore';
      }


    }

    StopControl(){
      if (this.ControlPresence==true){
        console.log("control stop")
        this.mytimer.unsubscribe();
        this.mytimer=null;

        const modalRef = this.modalService.open(MymodalComponent);
        modalRef.componentInstance.my_modal_content = 'Controllore fermato';
        this.ControlPresence=false
        this.running="Control is not running";
    }
    else {
      const modalRef = this.modalService.open(MymodalComponent);
      modalRef.componentInstance.my_modal_content = 'Nessun controllore attivo';
    }
      
    }

    updateControl(){
        
        console.log('Status control: ',this.rixcontrol);
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
                
                console.log('il grafico esiste allora lo aggiorno');
                var date = new Date(this.rixcontrol.Datetime * 1000).toISOString() //.match(/(\d{2}:\d{2}:\d{2})/)

                this.chartControl.data.labels.push(date);
                this.chartControl.data.datasets[0].data.push([this.rixcontrol.SWDegree]);
                this.chartControl.data.datasets[1].data.push([this.rixcontrol.SWPoint]);
                this.chartControl.data.datasets[2].data.push([this.rixcontrol.missing]);
                this.chartControl.data.datasets[3].data.push([this.rixcontrol.dataline]);
                
                

                if (this.chartControl.data.labels.length>10)
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