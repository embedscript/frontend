import { Component, OnInit } from '@angular/core';
import * as d from "../data";
import * as t from "../types";
import * as files from '@m3o/services/files';
import { FileService } from "../file.service";
import { ActivatedRoute } from "@angular/router";
import { mainModule } from 'process';
import * as _ from "lodash";

@Component({
  selector: 'app-gist-edit',
  templateUrl: './gist-edit.component.html',
  styleUrls: ['./gist-edit.component.css']
})
export class GistEditComponent implements OnInit {
  id: string;

  tsEditorOptions = {theme: 'vs-dark', language: 'typescript'};
  tsCode: string= 'function x() {\n\tconsole.log("Hello world!");\n}';
  
  htmlEditorOptions = {theme: 'vs-dark', language: 'html'};
  htmlCode = '<div>\n\t\n</div>'

  cssEditorOptions = {theme: 'vs-dark', language: 'css'};
  cssCode = 'div {\n\t\n}'

  constructor(private route: ActivatedRoute, private fs: FileService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.id = params.get("id");
      this.fs.list().then(files => {
        var fs = _(files).groupBy(function(v) {
          return v.project;
        }).map(function(items) {
          return items
        }).filter(v => {
          return v[0].project == this.id
        }).value();

        if (fs.length > 0) {
          fs[0].forEach(f => {
          if (f.path.includes("main")) {
            this.tsCode = f.file_contents
          }
          if (f.path.includes("index")) {
            this.htmlCode = f.file_contents
          }

          if (f.path.includes("stype")) {
            this.tsCode = f.file_contents
          }
        })
      }
      })
    });
  }

  save(): void {
    this.fs.save([{
      id: this.id + ":" +"main.ts",
      path: "main.ts",
      file_contents: this.tsCode,
      is_directory: false,
      project: this.id,
    }, {
      id: this.id + ":" +"index.html",
      path: "index.html",
      file_contents: this.htmlCode,
      is_directory: false,
      project: this.id,
    }, {
      id: this.id + ":" +"style.css",
      path: "style.css",
      file_contents: this.cssCode,
      is_directory: false,
      project: this.id,
    }])
  }
}
