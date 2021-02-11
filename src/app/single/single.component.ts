import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FileService } from "../file.service";
import * as d from "../data";
import * as t from "../types";
import * as files from '@m3o/services/files';

@Component({
  selector: "app-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.css"],
})
export class SingleComponent implements OnInit {
  embedID: string;
  embed: t.Embed;
  editorOptions = {theme: 'vs-dark', language: 'typescript'};
  code: string= 'function x() {\n\tconsole.log("Hello world!");\n}';

  constructor(private route: ActivatedRoute, private fs: FileService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.embedID = params.get("id");
      this.embed = d.embeds.filter((e) => e.ID == this.embedID)[0];
    });
  }
}
