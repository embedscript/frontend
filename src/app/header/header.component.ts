import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import * as types from '../types';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: types.Account;

  constructor(
    public us: UserService,
  ) { }

  ngOnInit(): void {
    this.user = this.us.user;
  }

  logout(): void {
    this.us.logout()
  }
}
