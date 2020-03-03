import { Component, OnInit, Input } from '@angular/core';
import { MainSocketService } from "../../main-socket.service";
import { User } from "../../../_interfaces/user";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: User | null = null;
  public followers = [];
  public followings = [];
  public showFollow:boolean = true;

  constructor(private mainSocket: MainSocketService) {
    this.mainSocket.getUser(localStorage.getItem('userKey'));

  }

  ngOnInit() {
    this.mainSocket.user$.subscribe(user => this.user = user);
    this.mainSocket.followers$.subscribe(followers => this.followers = followers);
    this.mainSocket.followings$.subscribe(followings => this.followings = followings);
  }

  changeFollow(btn:string){
    if (btn == 'Follower') {
      this.showFollow = true;
    } else {
      this.showFollow = false;
    }
  }

}
