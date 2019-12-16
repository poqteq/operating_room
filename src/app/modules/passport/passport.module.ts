import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { PassportRoutingModule } from './passport-routing.module';

import { UserLoginComponent } from './login/login.component';

import { LayoutModule } from '../../layout/layout.module';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,
    PassportRoutingModule,
    LayoutModule
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
    UserLoginComponent
  ],
  // entryComponents: COMPONENT_NOROUNT
})
export class PassportModule { }
