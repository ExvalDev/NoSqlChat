import { Component, OnInit, Input } from '@angular/core';
import { Post } from "../../_interfaces/post";
import { MainSocketService } from "../../main-socket.service";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss'],
  providers: [MainSocketService]
})
export class PostComponent implements OnInit {
  @Input() public post: Post | null = null;
  public userKey: String = localStorage.getItem('userKey');
  

  constructor(private mainSocket: MainSocketService) { }

  ngOnInit() {
  }

  like(post:string){
    this.mainSocket.like(post);
  }

  follow(followUser:string){
    this.mainSocket.follow(followUser);
  }

}
