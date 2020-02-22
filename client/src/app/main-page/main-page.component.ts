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
  public user: User;

  constructor(private mainSocket: MainSocketService) {
    
   }

  ngOnInit() {
    this.mainSocket.getUser(localStorage.getItem('userKey'));
    console.log(localStorage.getItem('userKey'));
    this.mainSocket.user$.subscribe(user => this.user = user[0]);
  }

  ngOnDestroy(): void {
    this.mainSocket.close();
  }


  logout(){
    localStorage.removeItem('userKey');
    window.location.reload();
  }

}
