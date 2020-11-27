import { Component, OnInit } from "@angular/core";
import * as d from "../data";
import {PageEvent} from '@angular/material/paginator';

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
})
export class ListComponent implements OnInit {
  embeds = d.embeds;
  length = d.embeds.length;
  pageSize = 9;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  constructor() {}

  ngOnInit(): void {}
}
