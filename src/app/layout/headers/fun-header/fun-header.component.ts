import { Component, OnInit, Input } from "@angular/core";
import { SettingsService } from "fui-theme";

@Component({
  // tslint:disable-next-line:component-selector
  selector: "fun-header",
  templateUrl: "./fun-header.component.html",
  styleUrls: ["./fun-header.component.less"]
})
export class FunHeaderComponent implements OnInit {
  searchToggleStatus: boolean;
  isFetching: boolean;
  _dark = true;
  @Input()
  set type(value: string) {
    if (value === "light") {
      this._dark = false;
    }
  }
  constructor(public settings: SettingsService) {}

  ngOnInit() {}
  toggleCollapsedSidebar() {
    this.settings.setLayout("collapsed", !this.settings.layout.collapsed);
  }

  searchToggleChange() {
    this.searchToggleStatus = !this.searchToggleStatus;
  }
}
