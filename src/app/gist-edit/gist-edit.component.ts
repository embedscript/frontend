import { Component, OnInit, Input } from '@angular/core';
import * as d from '../data';
import * as t from '../types';
import * as files from '@m3o/services/files';
import { UserService } from '../user.service';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

function makeid(length) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// @todo make this secure
// https://stackoverflow.com/questions/6732501/what-makes-jsfiddle-secure-from-xss-based-attacks

@Component({
  selector: 'app-gist-edit',
  templateUrl: './gist-edit.component.html',
  styleUrls: ['./gist-edit.component.css'],
})
export class GistEditComponent implements OnInit {
  loggedIn = false;
  id: string = 'helloworld';
  edited = false;
  @Input() edit: boolean = false;

  // @todo automatic layout doesnt seem to fix the issue of
  // monaco editor not snapping back to flexlayout defined size
  // https://github.com/microsoft/monaco-editor/issues/28
  tsEditorOptions = {
    language: 'javascript',
    automaticLayout: true,
    //theme: 'vs-light',
    theme: 'vs-dark',
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
  tsCode: string = ``;
  tsCodeRendered: string = ``;

  htmlEditorOptions = {
    theme: 'vs-dark',
    language: 'html',
    automaticLayout: true,
    //theme: 'vs-light',
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
  htmlCode = ``;
  htmlCodeRendered = '';
  owner = '';

  cssEditorOptions = {
    theme: 'vs-dark',
    language: 'css',
    automaticLayout: true,
    //theme: 'vs-light',
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
  cssCode = ``;
  cssCodeRendered = '';

  constructor(
    private route: ActivatedRoute,
    private fs: FileService,
    private us: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.id = params.get('id');
      } else {
        this.render();
      }
      this.load();
    });
    this.loggedIn = this.us.user?.id != ""
    this.us.isUserLoggedIn.subscribe((v) => {
      this.loggedIn = v;
    });
  }

  load(): void {
    this.fs.list(this.id).then((files) => {
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
          this.owner = f.owner;
          if (f.path.includes('main')) {
            this.tsCode = f.file_contents;
          }
          if (f.path.includes('index')) {
            this.htmlCode = f.file_contents;
          }

          if (f.path.includes('style')) {
            this.cssCode = f.file_contents;
          }
          this.render();
        });
      }
    });
  }

  save(): Promise<void> {
    return this.fs
      .save([
        {
          id: this.id + ':' + 'main.ts',
          path: 'main.ts',
          file_contents: this.tsCode,
          is_directory: false,
          project: this.id,
          owner: this.us.user.id,
        },
        {
          id: this.id + ':' + 'index.html',
          path: 'index.html',
          file_contents: this.htmlCode,
          is_directory: false,
          project: this.id,
          owner: this.us.user.id,
        },
        {
          id: this.id + ':' + 'style.css',
          path: 'style.css',
          file_contents: this.cssCode,
          is_directory: false,
          project: this.id,
          owner: this.us.user.id,
        },
      ])
      .catch((e) => {
        console.log('hii');
        this.toastr.error(e.error.Detail);
      });
  }

  editView() {
    if (!this.us.user || !this.us.user.id) {
      this.toastr.error('Log in first to edit a script');
      return;
    }
    if (!this.owner) {
      this.toastr.error('Script has no owner... something is wrong');
      return;
    }
    if (!this.edited && this.us.user.id != this.owner) {
      this.id += '-' + makeid(6);
      this.save().then(() => {
        this.load();
        this.edited = true;
        this.edit = true;
      });
      return;
    }
    this.edited = true;
    this.edit = true;
  }

  render() {
    this.tsCodeRendered = this.tsCode;
    this.htmlCodeRendered = this.htmlCode;
    this.cssCodeRendered = this.cssCode;
  }
}
