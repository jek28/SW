import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { TryConnectionComponent } from './try-connection/try-connection.component';
import { SqlService } from './sql.service';


@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: TryConnectionComponent },
      
    ])
  ],
  declarations: [ AppComponent, TryConnectionComponent ],
  bootstrap:    [ AppComponent ],
  providers: [SqlService]
})
export class AppModule { }
