import { Component, OnInit } from '@angular/core';
import * as d from '../data';
import { PageEvent } from '@angular/material/paginator';
import { FileService } from '../file.service';
import * as _ from 'lodash';
import * as types from '../types';

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
  files: types.File[][];
  pageSize = 9;
  ids = ['datastore-example-v2', 'datastore-example-v2-admin'];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchTerm: string = '';

  constructor(private fs: FileService) {}

  ngOnInit(): void {
    this.fs.list('', '', this.ids).then((files) => {
      this.files = _(files)
        .filter((v) => {
          return this.ids.includes(v.project);
        })
        .groupBy(function (v) {
          return v.project;
        })
        .map(function (items) {
          return items;
        })
        .value();
    });
  }
}
