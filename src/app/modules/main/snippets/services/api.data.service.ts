import { Injectable } from '@angular/core';

import { getFakeList, getNotice, getActivities } from './api.data';
import { Observable , of} from 'rxjs';

import { delay , map} from 'rxjs/operators';
@Injectable()
export class ApiDataService {

    getApiList(count?: number): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return getFakeList(count);
        }));
    }
    getNotice(): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return getNotice();
        }));
    }
    getActivities(): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return getActivities();
        }));
    }

}

