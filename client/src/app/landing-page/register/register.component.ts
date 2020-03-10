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

  /**
   * Send Register User Data to Socket
   *
   * @param {string} username
   * @param {string} password
   * @param {string} passwordCheck
   * @memberof RegisterComponent
   */
  register(username:string, password:string, passwordCheck:string){
    if (password == passwordCheck){
      this.socket.register(username,password);
    }
  }

}
