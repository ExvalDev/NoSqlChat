import { Component, OnInit } from '@angular/core';
import { EntrySocketService } from "./landing-page/entry-socket.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [EntrySocketService]
})
export class AppComponent implements OnInit{
  public authenticated:boolean;
  title = 'client';
  constructor(private entrySocket: EntrySocketService){
    if (localStorage.getItem('userKey') != undefined) {
      this.authenticated = true;
    }
  }

  ngOnInit() {
    
  }

}