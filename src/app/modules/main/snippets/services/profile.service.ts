import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';

import { delay , map} from 'rxjs/operators';
import { basicProgress, advancedOperation3, advancedOperation1, advancedOperation2 } from './profile.data';
@Injectable()
export class ProfileService {
    // 'GET /profile/progress': basicProgress,
    // 'GET /profile/goods': basicGoods,
    // 'GET /profile/advanced': { advancedOperation1, advancedOperation2, advancedOperation3 }
    getProfileProgress(): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return basicProgress;
        }));
    }
    getProfileGoods(): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return basicProgress;
        }));
    }
    getProfileAdvanced(ps?: any): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
                return { advancedOperation1, advancedOperation2, advancedOperation3 };
            })
        );
    }
}
