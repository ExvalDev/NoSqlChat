import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {Post} from "./_interfaces/post";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class MainSocketService {
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  private socket: SocketIOClient.Socket = io(environment.socketHost);

  constructor() {
    
    /* Run after page opening */
    this.socket.on('post', (rawPost: string) => {
      const posts = this.posts$.getValue();
      posts.unshift(JSON.parse(rawPost));
      this.posts$.next(posts);
    });
  }

  public allPosts(){
    this.socket.emit('allPosts');
  }

  /* functions between socket and server socket */
  
  public addPost(post: object) {
    console.log('addPostSocket');
    this.socket.emit('post', JSON.stringify(post));
  }
  /*
  public plusLike(postId:String){
    this.socket.emit('like',postId);
    
  }

  */
  public close(): void {
    this.socket.close();
    this.posts$.complete();
  } 

}
