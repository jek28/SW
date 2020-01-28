import { Component, OnInit } from '@angular/core';

import { TryJson } from '../tryjson'; 
import { SqlService } from '../sql.service';

@Component({
  selector: 'app-try-connection',
  templateUrl: './try-connection.component.html',
  styleUrls: ['./try-connection.component.css']
})
export class TryConnectionComponent implements OnInit {

  dataforsql: Try=[]
  constructor() { }

  ngOnInit() {
  }

}