import { Component, OnInit } from '@angular/core';
import { MainSocketService } from "../../main-socket.service";
import * as $ from "jquery";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";



@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit {

  constructor(private mainSocket: MainSocketService
    ) { }

  ngOnInit() {
  }

  /**
   *Submit a Post
   *
   * @param {string} title
   * @param {string} content
   * @memberof PostFormComponent
   */
  submitPost(title:string, content:string) {
    console.log('submitPost');
    this.mainSocket.addPost({title,content});
  }

}
