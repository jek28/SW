import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-mymodal',
  templateUrl: './mymodal.component.html',
  styleUrls: ['./mymodal.component.css']
})
export class MymodalComponent implements OnInit {

  //@Input() my_modal_title;
  @Input() my_modal_content;
 
  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
  }
  

}