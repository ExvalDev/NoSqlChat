import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {Post} from "./_interfaces/post";
import {User} from "../_interfaces/user";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class MainSocketService implements OnInit{
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public user$: BehaviorSubject<User> = new BehaviorSubject<User>({username: 'noName'});
  private socket: SocketIOClient.Socket = io(environment.socketHost);
  public userKey: String = localStorage.getItem('userKey'); 

  constructor() {
    /* Run after page opening */
    this.socket.on('post', (rawPost: string) => {
      const posts = this.posts$.getValue();
      posts.unshift(JSON.parse(rawPost));
      this.posts$.next(posts);
    });

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    
  }
  
  /**
   * Return all Posts 
   *
   * @memberof MainSocketService
   */
  public allPosts(){
    this.socket.emit('allPosts');
  }

  /**
   * Return own Posts
   *
   * @memberof MainSocketService
   */
  public personalPosts(){
    this.socket.emit('personalPosts', this.userKey);
  }

  /* functions between socket and server socket */
  
  public addPost(post: object) {
    post['userKey'] = this.userKey;
    this.socket.emit('post', JSON.stringify(post));
  }
  
  /**
   * socket function like post
   * @param postId 
   */
  public like(postId:String){
    var likeUserKey = "user:2"
    this.socket.emit('like',{postId:postId, userKey:likeUserKey});
    
  }

  public getUser(userKey:string){
    this.socket.emit('getUser',userKey);
    this.socket.on('userData', (rawUser: string) =>{
      console.log(rawUser);
      this.user$.next(JSON.parse(rawUser));
      console.log(this.user$);
    })
  }

  public follow(followUser:string){
    if (followUser != this.userKey) {
      this.socket.emit('follow', {followUser:followUser, followingUser:this.userKey});
    } else {
      alert ('du kannst dir nicht selber folgen!');
    }
  }


  public close(): void {
    this.socket.close();
    this.posts$.complete();
  } 

}
