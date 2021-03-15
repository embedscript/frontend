import { Component, OnInit, Input } from '@angular/core';
import { FileService } from '../file.service';
import * as _ from 'lodash';
import * as types from '../types';

@Component({
  selector: 'app-gist-list',
  templateUrl: './gist-list.component.html',
  styleUrls: ['./gist-list.component.css'],
})
export class GistListComponent implements OnInit {
  @Input() ownerName: string;
  @Input() files: types.File[][];
  pageSize = 9;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchTerm: string = '';

  constructor(private fs: FileService) {}

  ngOnInit(): void {
    if (this.files) {
      return;
    }
    const prom =
      this.ownerName != '' ? this.fs.list('', this.ownerName) : this.fs.list();
    prom.then((files) => {
      this.files = _(files)
        .groupBy(function (v) {
          return v.project;
        })
        .map(function (items) {
          return items;
        })
        .value();
    });
  }

  getStyle(files: types.File[]): types.File {
    return files.filter((f) => f.path.includes('style'))[0];
  }

  getTs(files: types.File[]): types.File {
    return files.filter((f) => f.path.includes('main'))[0];
  }

  getHtml(files: types.File[]): types.File {
    return files.filter((f) => f.path.includes('index'))[0];
  }
}
