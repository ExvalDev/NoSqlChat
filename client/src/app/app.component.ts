import { Component, OnInit } from '@angular/core';
import { EntrySocketService } from "./landing-page/entry-socket.service";
import { MainSocketService } from './main-page/main-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [EntrySocketService, MainSocketService]
})
export class AppComponent implements OnInit{
  public authenticated:boolean = false;
  title = 'client';
  constructor(){
    if (localStorage.getItem('userKey') != undefined) {
      this.authenticated = true;
    }
  }

  ngOnInit() {
    
  }

}