import { Component, OnInit } from '@angular/core';
import {EntrySocketService} from "../entry-socket.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [EntrySocketService]
})
export class RegisterComponent implements OnInit {

  constructor(private socket: EntrySocketService) { }

  ngOnInit() {
  }

  register(username:string, password:string, passwordCheck:string){
    if (password == passwordCheck){
      /* alert(username + ' ' + password); */
      this.socket.register(username,password);
    }
  }

}
