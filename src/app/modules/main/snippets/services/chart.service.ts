import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable , of} from 'rxjs';

import { delay , map} from 'rxjs/operators';
import { format } from 'date-fns';
import { ChartData } from './chart.data';
import * as Mock from 'mockjs';
@Injectable()
export class ChartService {

    constructor(@Inject('BASE_CONFIG') private config, private cData: ChartData) { }
    // tslint:disable-next-line:no-inferrable-types
    loading: boolean = false;
    getChart(): Observable<any> {
        this.loading = true;
        return of(true).pipe(
            delay(200),
            map(_ => {
            this.loading = false;
            return this.cData.getChartData();
        }));
    }
    getChartTag(): Observable<any> {
        this.loading = true;
        return of(true).pipe(
            delay(200),
            map(_ => {
            this.loading = false;
            return Mock.mock({
                'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
            });
        }));
    }
    getChartVisist(): Observable<any> {
        this.loading = true;
        return of(true).pipe(
            delay(200),
            map(_ => {
            this.loading = false;
            return this.cData.visitData;
        }));
    }
}
