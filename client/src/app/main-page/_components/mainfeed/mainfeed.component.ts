import { Component, OnInit } from '@angular/core';
import { MainSocketService } from "../../main-socket.service";
import { Post } from "../../_interfaces/main";

@Component({
  selector: 'app-mainfeed',
  templateUrl: './mainfeed.component.html',
  styleUrls: ['./mainfeed.component.scss']
})
export class MainfeedComponent implements OnInit {
  public posts: Post[] = [];

  constructor(private mainSocket: MainSocketService) { 
    
  }

  ngOnInit(): void {
    this.mainSocket.posts$.subscribe(posts => this.posts = posts);
  }
}
