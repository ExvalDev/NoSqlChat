import { Component, OnInit } from '@angular/core';
import { MainSocketService } from "../../main-socket.service";



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

  submitPost(title:string, content:string) {
    console.log('submitPost');
    this.mainSocket.addPost({title,content});
  }

}
