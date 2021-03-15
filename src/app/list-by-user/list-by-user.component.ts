import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list-by-user',
  templateUrl: './list-by-user.component.html',
  styleUrls: ['./list-by-user.component.css'],
})
export class ListByUserComponent implements OnInit {
  owner = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.owner = params.get('id');
      }

    });
  }

}
