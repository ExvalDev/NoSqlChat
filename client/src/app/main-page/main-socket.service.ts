import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {Post} from "./_interfaces/post";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class MainSocketService {
  /* public posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]); */
  private socket: SocketIOClient.Socket = io(environment.socketHost);

  constructor() {

    /* Run after page opening */
    this.socket.on('post', (rawPost: string) => {
      /* const posts = this.posts$.getValue();
      posts.unshift(JSON.parse(rawPost));
      this.posts$.next(posts); */
    });
    this.socket.on('test', (test: string) => {
      console.log(test);
    })
  }

  /* functions between socket and server socket */
  /* public register(username: string){
    this.socket.emit('register',{username:username, password:'12345'});
  }

  public addPost(post: object) {
    this.socket.emit('post', JSON.stringify(post));
  }

  public plusLike(postId:String){
    this.socket.emit('like',postId);
    
  }

  */
  public close(): void {
    this.socket.close();
    /* this.posts$.complete(); */
  } 

}
