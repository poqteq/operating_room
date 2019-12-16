import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";

// import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from "./fullscreen/fullscreen.component";

// import { LayoutHorizontalComponent } from './horizontal/horizontal.component';
import { HeaderSearchComponent } from "./components/search.component";
import { HeaderNotifyComponent } from "./components/notify.component";
import { HeaderTaskComponent } from "./components/task.component";
import { HeaderIconComponent } from "./components/icon.component";
import { HeaderFullScreenComponent } from "./components/fullscreen.component";
// import { HeaderI18nComponent } from "./components/i18n.component";
import { HeaderStorageComponent } from "./components/storage.component";
import { HeaderUserComponent } from "./components/user.component";

const COMPONENTS = [
  // LayoutDefaultComponent,
  LayoutFullScreenComponent,
  VerticalComponent,


  FunHeaderComponent,


  
  FixedTopSidebarComponent,

  // LayoutHorizontalComponent
];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderNotifyComponent,
  HeaderTaskComponent,
  HeaderIconComponent,
  HeaderFullScreenComponent,
  // HeaderI18nComponent,
  HeaderStorageComponent,
  HeaderUserComponent,
  FooterComponent
];

// passport
import { LayoutPassportComponent } from "./passport/passport.component";
import { VerticalComponent } from "./static/vertical/vertical.component";


import { FixedTopSidebarComponent } from "./fixed/fixed-top-sidebar/fixed-top-sidebar.component";
import { FooterComponent } from "./components/footer.component";


import { FunHeaderComponent } from "./headers/fun-header/fun-header.component";


// import { HeaderComponent } from './fixed/fixed-top-sidebar/header/header.component';
// import { SidebarComponent } from './static/vertical/sidebar/sidebar.component';

const PASSPORT = [LayoutPassportComponent];

@NgModule({
  imports: [SharedModule],
  providers: [],
  declarations: [
    ...COMPONENTS,
    ...HEADERCOMPONENTS,
    ...PASSPORT

    //  HeaderComponent,

    // SidebarComponent,
  ],
  exports: [...COMPONENTS, ...PASSPORT, HEADERCOMPONENTS]
})
export class LayoutModule {}
