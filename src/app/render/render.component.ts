import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})
export class RenderComponent implements OnInit {
  @Input() cssCode: string;
  @Input() tsCode: string;
  @Input() htmlCode: string;

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {}

  render(): SafeHtml {
    return this._sanitizer.bypassSecurityTrustHtml(
      '<html><head><script src="https://embedscript.com/assets/micro.js"></script></head><body>' +
        this.tsCode
    );
  }
}
