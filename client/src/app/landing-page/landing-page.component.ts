import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public showRegister: boolean;
  public activeView:boolean;
  constructor() { }

  ngOnInit() {
    this.showRegister = false;
    this.activeView = true;
  }

  /**
   * Toggle View Login / Register
   *
   * @param {string} view
   * @memberof LandingPageComponent
   */
  public toggle(view:string): void {
    if(view == 'login'){
      this.activeView = true;
      this.showRegister = false;
    }else{
      this.activeView = false;
      this.showRegister = true;
    }
      
  }
}
