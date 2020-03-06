import { Component, OnInit, Input } from '@angular/core';
import { Post } from "../../_interfaces/main";
import { MainSocketService } from "../../main-socket.service";
import { CompileShallowModuleMetadata } from '@angular/compiler';

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
    if(localStorage.getItem("userLikes") != undefined){
      var userLikes = JSON.parse(localStorage.getItem('userLikes'));
      this.mainSocket.like(post);
      if(!userLikes.includes(post))
      {
        var likeCount = Number(document.getElementById('likeCount'+post).innerText);
        likeCount += 1;
        document.getElementById('likeCount'+post).innerHTML = String(likeCount);
        document.getElementById('likeArea'+post).style.color = '#fdc13f';
        userLikes.push(post);
        localStorage.setItem('userLikes', JSON.stringify(userLikes));
        console.log(JSON.parse(localStorage.getItem('userLikes')));
      }
    }
    else{
      this.mainSocket.like(post);
      var likeCount = Number(document.getElementById('likeCount'+post).innerText);
      likeCount += 1;
      document.getElementById('likeCount'+post).innerHTML = String(likeCount);
      document.getElementById('likeArea'+post).style.color = '#fdc13f';
      var userLikesArray: string[] = [];
      userLikesArray.push(post);
      localStorage.setItem('userLikes', JSON.stringify(userLikesArray));
      console.log(JSON.parse(localStorage.getItem('userLikes')));
    }
  }

  dislike(post:string){
    if(localStorage.getItem("userDislikes") != undefined){
      var userDislikes = JSON.parse(localStorage.getItem('userDislikes'));
      this.mainSocket.dislike(post);
      if(!userDislikes.includes(post))
      {
        var dislikeCount = Number(document.getElementById('dislikeCount'+post).innerText);
        dislikeCount += 1;
        document.getElementById('dislikeCount'+post).innerHTML = String(dislikeCount);
        document.getElementById('dislikeArea'+post).style.color = '#a57555';
        userDislikes.push(post);
        localStorage.setItem('userDislikes', JSON.stringify(userDislikes));
      }
    }
    else{
      this.mainSocket.like(post);
      var dislikeCount = Number(document.getElementById('dislikeCount'+post).innerText);
      dislikeCount += 1;
      document.getElementById('dislikeCount'+post).innerHTML = String(dislikeCount);
      document.getElementById('dislikeArea'+post).style.color = '#a57555';
      var userDislikesArray: string[] = [];
      userDislikesArray.push(post);
      localStorage.setItem('userDislikes', JSON.stringify(userDislikesArray));
    }
  }

  follow(followUser:string){
    this.mainSocket.follow(followUser);
  }

}
