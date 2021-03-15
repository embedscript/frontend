import { Component, OnInit } from '@angular/core';
import * as d from '../data';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  exampleCode = `
Embed.post("datastore/create", {
  "project":  "projectid-1337",
  "table":    "comments",
  "value":    \`{"name":"joe", "comment": "Nice article!"}\`
}`;
  embeds = d.embeds;
  length = d.embeds.length;
  pageSize = 9;
  ids = ['datastore-example-v2', 'datastore-example-v2-admin'];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchTerm: string = '';

  constructor() {}

  ngOnInit(): void {
    this.embeds = d.embeds;
  }

  filter() {
    if (this.searchTerm.length == 0) {
      this.embeds = d.embeds;
    }
    this.embeds = d.embeds.filter(
      (e) =>
        e.description.toLowerCase().includes(this.searchTerm) ||
        e.name.toLowerCase().includes(this.searchTerm)
    );
  }
}
