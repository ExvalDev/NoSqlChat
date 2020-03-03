import { Component, OnInit, ViewChild } from '@angular/core';
import {EntrySocketService} from "../entry-socket.service";
import { LandingPageComponent } from '../landing-page.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private socket: EntrySocketService) { }

  ngOnInit() {
  }

  register(username:string, password:string, passwordCheck:string){
    if (password == passwordCheck){
      this.socket.register(username,password);
    }
  }

}
