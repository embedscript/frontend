import { Component, OnInit } from '@angular/core';
import * as d from '../data';
import * as t from '../types';
import * as files from '@m3o/services/files';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import { mainModule } from 'process';
import * as _ from 'lodash';

// @todo make this secure
// https://stackoverflow.com/questions/6732501/what-makes-jsfiddle-secure-from-xss-based-attacks

@Component({
  selector: 'app-gist-edit',
  templateUrl: './gist-edit.component.html',
  styleUrls: ['./gist-edit.component.css'],
})
export class GistEditComponent implements OnInit {
  id: string = 'name-this-script-please';

  // @todo automatic layout doesnt seem to fix the issue of
  // monaco editor not snapping back to flexlayout defined size
  // https://github.com/microsoft/monaco-editor/issues/28
  tsEditorOptions = {
    language: 'html',
    automaticLayout: true,
    theme: 'vs-light',
    folding: false,
    glyphMargin: false,
    //lineNumbers: false,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 0,
    renderLineHighlight: false,
    renderIndentGuides: false,
    minimap: {
      enabled: false,
    },
    scrollbar: {
      vertical: 'hidden',
      horizontal: 'hidden',
    },
  };
  tsCode: string = `<html>

  <head>
    <style>
      @import url('https://fonts.googleapis.com/css? 
  family=Roboto:300, 300i, 400, 400i');
    </style>
  
    <style>
      html,
      body {
        font-family: 'Roboto', sans-serif;
      }
  
      #btn {
        background-color: #fafafa;
        border: 1px solid #444;
        border-radius: 5px;
        padding: 1em;
      }
  
      h1 {
        display: inline-block;
        padding: 0.5em;
        font-weight: normal;
        background: #444444;
        color: #fcfcfc;
        border-radius: 5px;
        font-size: 3em;
      }
  
      h2 {
        font-weight: normal;
      }
  
      #container {
        text-align: center;
        padding-top: 3em;
      }
    </style>
  </head>
  
  <body>
    <script>
      document.addEventListener("DOMContentLoaded", function (event) {
                document.getElementById("btn").onclick = function () {
                    Micro.post(
                    "helloworld/call",
                        "backend",
                        {
                            name: "Joe",
                        },
                        function (data) {
                            alert(JSON.stringify(data))
                        }
                    );
                }
            });
    </script>
  
    <div id="container">
      <div>
        <h1>
          Embed scripts on any site
        </h1>
        <div>
          <h2>
            Have access to a wide range of APIs like a database, users service and
            more.
          </h2>
        </div>
        <div>
          <h2>
            You will never neeed a backend again.
          </h2>
        </div>
      </div>
      <div>
        <button id="btn">Click to call Helloworld service</button>
      </div>
    </div>
  </body>
  
  </html>`;
  tsCodeRendered: string = ``;

  //htmlEditorOptions = { theme: 'vs-dark', language: 'html' };
  //htmlCode = '<div>\n\t\n</div>';

  //cssEditorOptions = { theme: 'vs-dark', language: 'css' };
  //cssCode = 'div {\n\t\n}';

  constructor(private route: ActivatedRoute, private fs: FileService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.id = params.get('id');
      } else {
        this.render();
      }

      this.fs.list().then((files) => {
        var fs = _(files)
          .groupBy(function (v) {
            return v.project;
          })
          .map(function (items) {
            return items;
          })
          .filter((v) => {
            return v[0].project == this.id;
          })
          .value();

        if (fs.length > 0) {
          fs[0].forEach((f) => {
            if (f.path.includes('main')) {
              this.tsCode = f.file_contents;
              this.render();
            }
            //if (f.path.includes('index')) {
            //  this.htmlCode = f.file_contents;
            //}

            //if (f.path.includes('style')) {
            //  this.cssCode = f.file_contents;
            //}
          });
        }
      });
    });
  }

  save(): void {
    this.fs.save([
      {
        id: this.id + ':' + 'main.ts',
        path: 'main.ts',
        file_contents: this.tsCode,
        is_directory: false,
        project: this.id,
      },
      //{
      //  id: this.id + ':' + 'index.html',
      //  path: 'index.html',
      //  file_contents: this.htmlCode,
      //  is_directory: false,
      //  project: this.id,
      //},
      //{
      //  id: this.id + ':' + 'style.css',
      //  path: 'style.css',
      //  file_contents: this.cssCode,
      //  is_directory: false,
      //  project: this.id,
      //},
    ]);
  }

  render() {
    this.tsCodeRendered = this.tsCode;
  }
}
