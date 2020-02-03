import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { TryConnectionComponent } from './try-connection/try-connection.component';
import { SqlService } from './sql.service';
import { TopBarComponent } from './top-bar/top-bar.component';
import { AnalyzeComponent } from './analyze/analyze.component';
import { LoginComponent } from './login/login.component';



@NgModule({
  
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule, 
    NgbModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent },
      { path: 'tryconnection', component: TryConnectionComponent },
      {path:'analyze', component: AnalyzeComponent}
      
    ])
  ],
  declarations: [ AppComponent, TryConnectionComponent, TopBarComponent, AnalyzeComponent, LoginComponent,],
  bootstrap:    [ AppComponent ],
  providers: [SqlService],
  entryComponents: [  ],
})
export class AppModule { }
