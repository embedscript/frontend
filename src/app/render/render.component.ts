import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../user.service';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})
export class RenderComponent implements OnInit, OnChanges {
  @Input() name: string;

  code: SafeHtml;
  iframe: SafeUrl;

  constructor(private _sanitizer: DomSanitizer, public us: UserService) {}

  ngOnInit(): void {
    this.iframe = this.iframeURL();
    this.us.isUserLoggedIn.subscribe((v) => {
      if (v) {
        this.iframe = this.iframeURL();
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
