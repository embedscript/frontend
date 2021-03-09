import {
  Component,
  Input,
  OnInit,
  OnChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../user.service';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})
export class RenderComponent implements OnInit, OnChanges {
  @Input() name: string;
  @ViewChild('theiframe', { static: false }) theiframe: ElementRef;

  code: SafeHtml;
  iframe: SafeUrl;

  constructor(private _sanitizer: DomSanitizer, public us: UserService) {}

  ngOnInit(): void {
    this.iframe = this.iframeURL();
    this.us.isUserLoggedIn.subscribe((v) => {
      if (v) {
        this.iframe = this.iframeURL();
        //setInterval(function () {
        //  (document.getElementById(
        //    'theiframe'
        //  ) as any).contentWindow.console.addEventListener(
        //    'log',
        //    function (value) {
        //      alert(value);
        //      console.log.apply(null, value);
        //    }
        //  );
        //}, 500);
      }
    });
  }

  ngOnChanges(): void {}

  iframeURL(): SafeUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      'https://backend.m3o.dev/v1/serve?script=' +
        this.name +
        '&project=' +
        this.us.projectID()
    );
  }
}

var console = {
  __on: {},
  addEventListener: function (name, callback) {
    this.__on[name] = (this.__on[name] || []).concat(callback);
    return this;
  },
  dispatchEvent: function (name, value) {
    this.__on[name] = this.__on[name] || [];
    for (var i = 0, n = this.__on[name].length; i < n; i++) {
      this.__on[name][i].call(this, value);
    }
    return this;
  },
  log: function () {
    var a = [];
    // For V8 optimization
    for (var i = 0, n = arguments.length; i < n; i++) {
      a.push(arguments[i]);
    }
    this.dispatchEvent('log', a);
  },
};
