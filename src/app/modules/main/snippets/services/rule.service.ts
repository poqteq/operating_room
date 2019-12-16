import { Injectable } from '@angular/core';
import { Observable , of} from 'rxjs';

import { delay , map} from 'rxjs/operators';
import { getRule, removeRule, saveRule } from './rule.data';
@Injectable()
export class RuleService {
    // '/rule': (req: MockRequest) => getRule(req.queryString),
    // 'DELETE /rule': (req: MockRequest) => removeRule(req.queryString.nos),
    // 'POST /rule': (req: MockRequest) => saveRule(req.body.description)
    constructor() {

    }
    getRule(p?: any): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return getRule(p);
        }));
    }
    delete(p: any): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return removeRule(p);
        }));
    }
    save(p: any): Observable<any> {
        return of(true).pipe(
            delay(200),
            map(_ => {
            return saveRule(p);
        }));
    }
}
