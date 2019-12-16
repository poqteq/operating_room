
import { throwIfAlreadyLoaded } from '@core/module-import-guard';

import { NgModule, LOCALE_ID, APP_INITIALIZER, Injector, Optional, SkipSelf } from '@angular/core';
import { HttpClient, HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';




import { AppStoreModule } from '@core/store/app.store.module';
import { AppEffectsModule } from '@core/effects/app.effects.module';

import { StartupService } from '@core/services/startup.service';
import { DefaultInterceptor } from '@core/services/default.interceptor';
import { CanActivateGuard } from './services/auth-guard';







@NgModule({
  imports: [
    AppStoreModule,
    AppEffectsModule,
  ],
  providers: [
    StartupService,
    CanActivateGuard,
    {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true}
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
