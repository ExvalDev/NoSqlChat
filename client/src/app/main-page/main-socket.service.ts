import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {Post} from "./_interfaces/post";
import {User} from "../_interfaces/user";
import {BehaviorSubject} from "rxjs";
import * as $ from "jquery";

@Injectable()
export class MainSocketService {
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public user$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  private socket: SocketIOClient.Socket = io(environment.socketHost);
  public userKey: String = localStorage.getItem('userKey'); 

  constructor() {
    /* Run after page opening */
    this.socket.on('post', (rawPost: string) => {
      const posts = this.posts$.getValue();
      posts.unshift(JSON.parse(rawPost));
      this.posts$.next(posts);
    });
    this.socket.on('userData', (rawUser: string) =>{
      this.user$.next(JSON.parse(rawUser));
    })
  }

  public allPosts(){
    this.socket.emit('allPosts');
  }

  /* functions between socket and server socket */
  
  public addPost(post: object) {
    console.log('addPostSocket');
    this.socket.emit('post', JSON.stringify(post));
  }
  
  /**
   * socket function like post
   * @param postId 
   */
  public like(postId:String){
    this.socket.emit('like',{postId:postId, userKey:this.userKey});
  }

  public getUser(userKey:string){
    this.socket.emit('getUser',userKey);
  }


  public close(): void {
    this.socket.close();
    this.posts$.complete();
  } 

}
