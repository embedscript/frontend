import { Component, OnInit } from '@angular/core';
import * as files from '@m3o/services/files';
import { FileService } from "../file.service";
import * as _ from "lodash";

@Component({
  selector: 'app-gist-list',
  templateUrl: './gist-list.component.html',
  styleUrls: ['./gist-list.component.css']
})
export class GistListComponent implements OnInit {
  pageSize = 9;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchTerm: string = "";

  files: files.File[][];

  constructor(private fs: FileService) { }

  ngOnInit(): void {
    this.fs.list().then(files => {
      this.files = _(files).groupBy(function(v) {
        return v.project;
      }).map(function(items) {
        return items
      }).value();
    })
   
  }

  getStyle(files: files.File[]): files.File {
    return files.filter(f => f.path.includes("style"))[0]
  }

  getTs(files: files.File[]): files.File {
    return files.filter(f => f.path.includes("main"))[0]
  }

  getHtml(files: files.File[]): files.File {
    return files.filter(f => f.path.includes("index"))[0]
  }
}
