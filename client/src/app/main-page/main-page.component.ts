import { Component, OnInit, OnDestroy } from '@angular/core';
import { MainSocketService } from "./main-socket.service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  providers: [MainSocketService]
})
export class MainPageComponent implements OnInit, OnDestroy {

  constructor(private socket: MainSocketService) { }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    this.socket.close();
  }

  counter(i:number){
    return new Array(i);
  }

}
