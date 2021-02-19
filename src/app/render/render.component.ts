import { rendererTypeName } from '@angular/compiler';
import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-render',
  templateUrl: './render.component.html',
  styleUrls: ['./render.component.css'],
})
export class RenderComponent implements OnInit, OnChanges {
  @Input() cssCode: string;
  @Input() tsCode: string;
  @Input() htmlCode: string;

  code: SafeHtml;

  constructor(private _sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.render();
  }

  ngOnChanges(): void {
    this.render();
  }

  render() {
    this.code = this._sanitizer.bypassSecurityTrustHtml(
      '<html><head><script src="https://embedscript.com/assets/micro.js"></script></head><body>' +
        `<style>` +
        this.cssCode +
        `</style><script>` +
        this.tsCode +
        `</script>` +
        this.htmlCode +
        '</body></html>'
    );
  }
}
