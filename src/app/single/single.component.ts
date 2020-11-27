import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import * as d from "../data";
import * as t from "../types";

@Component({
  selector: "app-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.css"],
})
export class SingleComponent implements OnInit {
  embedID: string;
  embed: t.Embed;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.embedID = params.get("id");
      this.embed = d.embeds.filter((e) => e.ID == this.embedID)[0];
    });
  }
}
