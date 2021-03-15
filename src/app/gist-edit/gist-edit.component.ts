import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import * as d from '../data';
import * as t from '../types';
import * as files from '@m3o/services/files';
import { UserService } from '../user.service';
import { FileService } from '../file.service';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import * as bcrypt from 'bcryptjs';
import { Md5 } from 'ts-md5/dist/md5';

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
  @ViewChild('outlet', { read: ViewContainerRef }) outletRef: ViewContainerRef;
  @ViewChild('content', { read: TemplateRef }) contentRef: TemplateRef<any>;
  @ViewChild('loading', { read: TemplateRef }) loadingRef: TemplateRef<any>;

  loggedIn = false;
  loading = false;
  page = 'render';
  id: string = 'helloworld';
  previewID: string = '';
  edited = false;
  @Input() edit: boolean = true;

  // @todo automatic layout doesnt seem to fix the issue of
  // monaco editor not snapping back to flexlayout defined size
  // https://github.com/microsoft/monaco-editor/issues/28
  tsEditorOptions = {
    language: 'javascript',
    automaticLayout: true,
    theme: 'vs-light',
    //theme: 'vs-dark',
    folding: false,
    readOnly: true,
    glyphMargin: false,
    //lineNumbers: false,
    //lineDecorationsWidth: 0,
    //lineNumbersMinChars: 0,
    renderLineHighlight: false,
    renderIndentGuides: false,
    minimap: {
      enabled: false,
    },
    //scrollbar: {
    //  vertical: 'hidden',
    //  horizontal: 'hidden',
    //},
  };
  tsCode: string = ``;
  tsCodeRendered: string = ``;

  htmlEditorOptions = {
    //theme: 'vs-dark',
    language: 'html',
    automaticLayout: true,
    theme: 'vs-light',
    folding: false,
    readOnly: true,
    //glyphMargin: false,
    // lineNumbers: false,
    //lineDecorationsWidth: 0,
    //lineNumbersMinChars: 0,
    renderLineHighlight: false,
    renderIndentGuides: false,
    minimap: {
      enabled: false,
    },
    //scrollbar: {
    //  vertical: 'hidden',
    //  horizontal: 'hidden',
    //},
  };
  htmlCode = ``;
  owner = '';

  cssEditorOptions = {
    //theme: 'vs-dark',
    language: 'css',
    automaticLayout: true,
    theme: 'vs-light',
    folding: false,
    readOnly: true,
    glyphMargin: false,
    //lineNumbers: false,
    //lineDecorationsWidth: 0,
    //lineNumbersMinChars: 0,
    //renderLineHighlight: false,
    //renderIndentGuides: false,
    minimap: {
      enabled: false,
    },
    //scrollbar: {
    //  vertical: 'hidden',
    //  horizontal: 'hidden',
    //},
  };
  cssCode = ``;

  constructor(
    private route: ActivatedRoute,
    private fs: FileService,
    private us: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.id = params.get('id');
      }
      this.previewID = this.id;
      this.load();
    });

    this.loggedIn = this.us.loggedIn();
    this.us.isUserLoggedIn.subscribe((v) => {
      this.loggedIn = v;
      if (this.loggedIn) {
        this.tsEditorOptions.readOnly = false;
        this.htmlEditorOptions.readOnly = false;
        this.cssEditorOptions.readOnly = false;
      }
    });
  }

  setPage(page: string) {
    this.page = page;
    // only do preview magic if user is owner.
    // no one else can edit the script so it's ok
    if (this.page == 'render' && this.isOwner()) {
      if (this.id == this.previewID) {
        this.previewID = 'preview-' + makeid(15);
      }
      this.save(this.previewID);
    }
  }

  load(): Promise<void> {
    return this.fs.list(this.id).then((files) => {
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
        });
      }
    });
  }

  ngAfterViewInit() {
    this.outletRef.createEmbeddedView(this.contentRef);
  }

  projectID(): string {
    if (!this.us.user?.id) {
      return '';
    }
    const md5 = new Md5();
    return md5.appendStr(this.us.user.id).end().toString();
  }

  save(projectID: string): Promise<void> {
    if (this.outletRef) {
      this.outletRef.clear();
      this.outletRef.createEmbeddedView(this.loadingRef);
    }
    this.loading = true;

    const arr = [
      {
        id: projectID + ':' + 'main.ts',
        path: 'main.ts',
        file_contents: this.tsCode,
        is_directory: false,
        project: projectID,
        owner: this.us.user.id,
      },
      {
        id: projectID + ':' + 'index.html',
        path: 'index.html',
        file_contents: this.htmlCode,
        is_directory: false,
        project: projectID,
        owner: this.us.user.id,
      },
      {
        id: projectID + ':' + 'style.css',
        path: 'style.css',
        file_contents: this.cssCode,
        is_directory: false,
        project: projectID,
        owner: this.us.user.id,
      },
    ];

    return this.fs
      .save(arr)
      .then(() => {
        this.outletRef.clear();
        this.outletRef.createEmbeddedView(this.contentRef);
        this.loading = false;
      })
      .catch((e) => {
        this.toastr.error(e.error.Detail);
      });
  }

  editView() {
    this.edit = true;
  }

  isOwner(): boolean {
    return this.owner && this.us.user.id == this.owner;
  }

  saveGuard() {
    if (!this.us.user || !this.us.user.id) {
      this.toastr.error('Log in first to edit a script');
      return;
    }
    this.page = 'render';
    if (!this.edited && !this.isOwner()) {
      this.id += '-' + makeid(6);
      this.save(this.id).then(() => {
        this.load();
        this.edited = true;
        this.edit = true;
      });
      return;
    }
    this.save(this.id);
  }
}
