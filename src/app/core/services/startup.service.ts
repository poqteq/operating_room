import { Injectable, Inject } from "@angular/core";
import { Observable, combineLatest } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { SettingsService, TitleService } from "fui-theme";

import { catchError } from "rxjs/operators";
@Injectable()
export class StartupService {
  constructor(
    private httpClient: HttpClient,
    private settingService: SettingsService,
    private titleService: TitleService,
    @Inject("BASE_CONFIG") private config
  ) {}
  load(): any {
    this.httpClient
      .get(`./assets/data.json`)

      .pipe(
        catchError((results: any) => {
          return results;
        })
      )
      .subscribe((results: any) => {
        this.settingService.setApp(results.app);
        this.titleService.suffix = results.app.name;
      });
  }
}
