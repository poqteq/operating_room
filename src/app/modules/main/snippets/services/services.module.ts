import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartService } from './chart.service';
import { ChartData } from './chart.data';
import { ApiDataService } from './api.data.service';
import { RuleService } from './rule.service';
import { ProfileService } from './profile.service';


@NgModule({
    declarations: [],
    imports: [ CommonModule ],
    exports: [],
    providers: [
        ChartService,
        ChartData,
        ApiDataService,
        RuleService,
        ProfileService
       ]
})
export class ServicesModule {}
