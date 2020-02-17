import { Component, OnInit } from '@angular/core';
import {EntrySocketService} from "../entry-socket.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [EntrySocketService]
})
export class LoginComponent implements OnInit {

  constructor(private socket: EntrySocketService) { }

  ngOnInit() {
  }

  submitLogin(username:string,password:string){
   this.socket.login(username, password);
  }
}
