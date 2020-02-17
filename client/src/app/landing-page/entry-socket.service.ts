import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {User} from "../_interfaces/user";
import {BehaviorSubject, Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class EntrySocketService {
  private socket: SocketIOClient.Socket = io(environment.socketHost);
  loggedIn: boolean;
  constructor() { 
    this.loggedIn = false;
  }

  /**
   *Socket function for register
   *
   * @param {string} username
   * @param {string} password
   * @memberof EntrySocketService
   */
  public register(username: string, password:string){
    this.socket.emit('register',{username:username, password:password});
    this.socket.on('registerFailed', () =>{
      return 'failed';
    });
    this.socket.on('registered', (user:string) =>{
      console.log(user);
    });
  }

  /**
   *Socket function for login
   *
   * @param {string} username
   * @param {string} password
   * @memberof EntrySocketService
   */
  public login(username:string, password:string){
    this.socket.emit('login',{username:username, password:password});
    this.socket.on('loginFailed',(err)=>{
      console.log(err);
    })
    this.socket.on('loginDone',()=>{
      console.log('login complete');
      localStorage.setItem('loggedIn','true');
      window.location.reload();
    })
  }
}
