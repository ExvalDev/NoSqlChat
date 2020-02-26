import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Md5} from 'ts-md5/dist/md5';
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
    const hashPW = Md5.hashStr(password);
    this.socket.emit('register',{username:username, password:hashPW});
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
    const hashPW = Md5.hashStr(password);
    this.socket.emit('login',{username:username, password:hashPW});
    this.socket.on('loginFailed',(err)=>{
      console.log(err);
    })
    this.socket.on('loginDone',(userKey:string)=>{
      console.log('login complete');
      localStorage.setItem('userKey',userKey);
      console.log(localStorage.getItem('userKey'));
      window.location.reload();
    })
  }
}
