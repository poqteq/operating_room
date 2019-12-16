import { NgModule } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { MainRoutingModule } from "./main-routing.module";
import { MainComponent } from "./views/main/main.component";
import { ServicesModule } from "./snippets/services/services.module";
import { FeatureEffectsModule } from "./snippets/effects/feature.effects.module";
import { FeatureStoreModule } from "./snippets/store/feature.store.module";

import { DashboardAnalysisComponent } from "./views/dashboard/analysis/analysis.component";
import { DashboardWorkplaceComponent } from "./views/dashboard/workplace/workplace.component";
import { DashboardV1Component } from "./views/dashboard/v1/v1.component";
import { DashboardMonitorComponent } from "./views/dashboard/monitor/monitor.component";
import { Exception403Component } from "./views/exception/403.component";
import { Exception404Component } from "./views/exception/404.component";
import { Exception500Component } from "./views/exception/500.component";
import { LayoutModule } from "../../layout/layout.module";
import { VisualizationComponent } from './views/visual-map/visualization.component';
import { DataNtegrationComponent } from './views/visual-list/data-ntegration/data-ntegration.component';

const COMPONENT_NOROUNT = [];

@NgModule({
  imports: [
    SharedModule,

    MainRoutingModule,
    LayoutModule,
    ServicesModule,
    FeatureEffectsModule,
    FeatureStoreModule
  ],
  declarations: [
    ...COMPONENT_NOROUNT,
    MainComponent,

    DashboardAnalysisComponent,
    DashboardWorkplaceComponent,
    DashboardV1Component,
    DashboardMonitorComponent,
    Exception403Component,
    Exception404Component,
    Exception500Component,
    VisualizationComponent,
    DataNtegrationComponent
  ]
  // entryComponents: COMPONENT_NOROUNT
})
export class MainModule {}
