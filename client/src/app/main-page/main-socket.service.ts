import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import {environment} from "../../environments/environment";
import {Post} from "./_interfaces/main";
import {Follower} from "./_interfaces/main";
import {User} from "../_interfaces/user";
import {BehaviorSubject, EMPTY} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class MainSocketService{
  public posts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public timelinePosts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public personalPosts$: BehaviorSubject<Post[]> = new BehaviorSubject<Post[]>([]);
  public followers$: BehaviorSubject<Follower[]> = new BehaviorSubject<Follower[]>([]);
  public followings$: BehaviorSubject<Follower[]> = new BehaviorSubject<Follower[]>([]);
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

    this.socket.on('timelinePost', (rawPost: string) => {
      const posts = this.timelinePosts$.getValue();
      posts.unshift(JSON.parse(rawPost));
      this.timelinePosts$.next(posts);
    });

    this.socket.on('personalPost', (rawPost: string) => {
      const posts = this.personalPosts$.getValue();
      posts.unshift(JSON.parse(rawPost));
      this.personalPosts$.next(posts);
    });

    this.socket.on('follower', (rawFollower: string) => {
      let followers = this.followers$.getValue();
      followers.unshift(JSON.parse(rawFollower));
      this.followers$.next(followers);
    });

    this.socket.on('following', (rawFollowing: string) => {
      let followings = this.followings$.getValue();
      followings.unshift(JSON.parse(rawFollowing));
      this.followings$.next(followings);
    });

    this.socket.on('userData', (rawUser: string) =>{
      this.user$.next(JSON.parse(rawUser));
    })

    

  }
  
  /**
   * Return all Posts 
   *
   * @memberof MainSocketService
   */
  public allPosts(){
    this.socket.emit('allPosts');
    this.socket.emit('personalPosts', this.userKey);
    this.socket.emit('timelinePosts', this.userKey);
  }


  /* functions between socket and server socket */
  
  public addPost(post: object) {
    post['userKey'] = this.userKey;
    this.socket.emit('post', JSON.stringify(post));
  }
  
  /**
   * socket function like post
   * @param postId 
   * 
   */
  public like(postId:String){
    this.socket.emit('like',{postId:postId, userKey:this.userKey});
  }

  public dislike(postId:String){
    this.socket.emit('dislike',{postId:postId, userKey:this.userKey});
  }

  public getUser(userKey:string){
    this.socket.emit('getUser',userKey);
    this.socket.emit('getFollower', userKey);
    this.socket.emit('getFollowing', userKey);
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
