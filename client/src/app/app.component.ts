import { Component, OnInit } from '@angular/core';
import { EntrySocketService } from "./landing-page/entry-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [EntrySocketService]
})
export class AppComponent implements OnInit{
  public authenticated:boolean = false;
  title = 'client';
  constructor(private entrySocket: EntrySocketService){
    console.log('app: ' + localStorage.getItem('userKey'));
    if (localStorage.getItem('userKey') != undefined) {
     
      this.authenticated = true;
    }
  }

  ngOnInit() {
    
  }

}