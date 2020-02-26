import { Component, OnInit } from '@angular/core';
import { MainSocketService } from "../../main-socket.service";
import { Post } from "../../_interfaces/post";

@Component({
  selector: 'app-personal-posts',
  templateUrl: './personal-posts.component.html',
  styleUrls: ['./personal-posts.component.scss'],
  providers: [MainSocketService]
})
export class PersonalPostsComponent implements OnInit {
  public posts: Post[] = [];

  constructor(private mainSocket: MainSocketService) { 
    this.mainSocket.personalPosts();
  }

  ngOnInit() {
    this.mainSocket.posts$.subscribe(posts => this.posts = posts);
  }

}
