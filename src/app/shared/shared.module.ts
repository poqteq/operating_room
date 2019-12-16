import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// i18n

import { FuiABCModule } from "fui-abc";
import { FuiThemeModule } from "fui-theme";
// region: third libs
import { NgZorroAntdModule } from "ng-zorro-antd";




import { FuiFormModule } from "fui-form";

const THIRDMODULES = [
  NgZorroAntdModule,

];
// endregion

// region: your componets & directives
const COMPONENTS = [];
const DIRECTIVES = [];
// endregion

@NgModule({
  imports: [],
  declarations: [],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FuiThemeModule,

    FuiFormModule,

    FuiABCModule,
    // i18n
    // TranslateModule,
    // third libs
    ...THIRDMODULES
  ]
})
export class SharedModule {}
