import { Component, OnInit, Input } from '@angular/core';
import { MainSocketService } from "../../main-socket.service";
import { User } from "../../../_interfaces/user";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MainSocketService]
})
export class ProfileComponent implements OnInit {
  @Input() public user: User | null = null;

  constructor(private mainSocket: MainSocketService) {
    
  }

  ngOnInit() {
    
  }

}
