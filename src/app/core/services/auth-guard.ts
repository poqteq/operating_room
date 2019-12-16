import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MenuService, Menu } from 'fui-theme';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class CanActivateGuard implements CanActivate {
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
       return  this.http.get('./assets/data.json').pipe(
             map((result: any) => {
                const  menus: Menu[] = result.menus
                this.menuS.add(menus);
                return true;
        }),
         catchError((el) => of(false))
        );
       
    }
    constructor(private http: HttpClient,   public menuS: MenuService,) {}
}
