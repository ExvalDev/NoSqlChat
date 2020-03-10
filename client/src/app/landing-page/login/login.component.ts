import { Component, OnInit } from '@angular/core';
import {EntrySocketService} from "../entry-socket.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private socket: EntrySocketService) { }

  ngOnInit() {
  }

  /**
   * Send Login data to Socket
   *
   * @param {string} username
   * @param {string} password
   * @memberof LoginComponent
   */
  submitLogin(username:string,password:string){
   this.socket.login(username, password);
  }
}
