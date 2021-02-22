import { rendererTypeName } from '@angular/compiler';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})
export class RenderComponent implements OnInit, OnChanges {
  @Input() name: string;

  code: SafeHtml;

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  ngOnChanges(): void {}

  iframeURL(): SafeUrl {
    return this._sanitizer.bypassSecurityTrustResourceUrl(
      'https://backend.m3o.dev/v1/serve?project=' + this.name
    );
  }
}
