import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainSocketService } from "./main-socket.service";
import { User } from "../_interfaces/user";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [MainSocketService]
})
export class MainPageComponent implements OnInit, OnDestroy {
  public feed:string = 'mainfeed';
  

  constructor(private mainSocket: MainSocketService) {
    
   }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    this.mainSocket.close();
  }

  chooseFeed(feedName:string){
    this.feed = feedName;
  }


  logout(){
    localStorage.removeItem('userKey');
    window.location.reload();
  }

}
