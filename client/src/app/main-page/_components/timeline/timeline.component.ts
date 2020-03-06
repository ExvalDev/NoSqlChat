import { Component, OnInit } from '@angular/core';
import { MainSocketService } from "../../main-socket.service";
import { Post } from "../../_interfaces/main";

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  public posts: Post[] = [];

  constructor(private mainSocket: MainSocketService) { }

  ngOnInit() {
    this.mainSocket.timelinePosts$.subscribe(posts => this.posts = posts);
  }

}
