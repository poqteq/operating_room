import { NgModule, LOCALE_ID, APP_INITIALIZER } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { registerLocaleData } from "@angular/common";
import zh from "@angular/common/locales/zh";
registerLocaleData(zh);

import { CoreModule } from "@core/core.module";
import { StartupService } from "@core/services/startup.service";
import { AppComponent } from "./app.component";


// import { PassportRoutingModule } from './modules/passport/passport-routing.module';
import { AppRoutingModule } from "./app-routing.module";
import { PassportModule } from "./modules/passport/passport.module";

import { FuiThemeModule } from "fui-theme";

import { FuiABCModule, AdPageHeaderConfig } from "fui-abc";
import { FuiFormModule } from "fui-form";

import { NgZorroAntdModule, NZ_I18N, zh_CN } from "ng-zorro-antd";


// fui-abc 配置
export function pageHeaderConfig(): AdPageHeaderConfig {
  return Object.assign(new AdPageHeaderConfig(), { home_i18n: "home" });
}


export function StartupServiceFactory(
  startupService: StartupService
): Function {
  return () => startupService.load();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FuiThemeModule.forRoot(),
    FuiABCModule.forRoot(),
    FuiFormModule.forRoot(),


    NgZorroAntdModule,
    CoreModule,
    PassportModule,
    AppRoutingModule,

  
  ],
  providers: [
    {
      provide: "BASE_CONFIG",
      useValue: {
        urm: "http://localhost:3000",
        server: "/api"
      }
    },
    { provide: LOCALE_ID, useValue: "zh-Hans" },
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: AdPageHeaderConfig, useFactory: pageHeaderConfig },
    {
      provide: APP_INITIALIZER,
      useFactory: StartupServiceFactory,
      deps: [StartupService],
      multi: true
    }
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
