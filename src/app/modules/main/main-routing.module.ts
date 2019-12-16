import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MainComponent } from "./views/main/main.component";


import { DashboardV1Component } from "./views/dashboard/v1/v1.component";
import { DashboardAnalysisComponent } from "./views/dashboard/analysis/analysis.component";
import { DashboardMonitorComponent } from "./views/dashboard/monitor/monitor.component";
import { DashboardWorkplaceComponent } from "./views/dashboard/workplace/workplace.component";
// import { Exception403Component } from "./views/exception/403.component";
// import { Exception404Component } from "./views/exception/404.component";
// import { Exception500Component } from "./views/exception/500.component";
import { VisualizationComponent } from './views/visual-map/visualization.component';
import { DataNtegrationComponent } from "./views/visual-list/data-ntegration/data-ntegration.component";
const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            { path: "", redirectTo: "dashboard/v1", pathMatch: "full" },
            {
                path: "dashboard",
                redirectTo: "dashboard/v1",
                pathMatch: "full"
            },
            { path: "dashboard/v1", component: DashboardV1Component },
            {
                path: "dashboard/analysis",
                component: DashboardAnalysisComponent
            },
            { path: "dashboard/monitor", component: DashboardMonitorComponent },
            {
                path: "dashboard/workplace",
                component: DashboardWorkplaceComponent
            },
            {
                path: "widgets",
                loadChildren: "./modules/widgets/widgets.module#WidgetsModule"
            },
            {
                path: "style",
                loadChildren: "./modules/style/style.module#StyleModule"
            },
            {
                path: 'visual-map',
                component: VisualizationComponent
            },
         
            {
                path: "extras",
                loadChildren: "./modules/extras/extras.module#ExtrasModule"
            },
           
            { path: "pro", loadChildren: "./modules/pro/pro.module#ProModule" },
           
        ]
    },
    {
        path: 'layout',
        loadChildren: './modules/layout/layoutT.module#LayoutTModule'
    },

    
    // { path: "exception", redirectTo: "exception/403", pathMatch: "full" },
    // { path: "exception/403", component: Exception403Component },
    // { path: "exception/404", component: Exception404Component },
    // { path: "exception/500", component: Exception500Component },

    { path: "visualization" },
    // 数据可视化集成平台
    { path: "visualization/data-integration", component: DataNtegrationComponent },

    // { path: 'lock', component: UserLockComponent, data: { title: '锁屏', titleI18n: 'lock' } },

    {
        path: "**",

        redirectTo: "/app/dashboard/v1"
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MainRoutingModule {}
