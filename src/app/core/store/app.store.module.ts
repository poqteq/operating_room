import { NgModule } from '@angular/core';
import { StoreModule, createSelector } from '@ngrx/store';
import {
  StoreRouterConnectingModule,
  RouterStateSerializer,
} from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {
  ActionReducerMap,
  ActionReducer,
  MetaReducer,
  createFeatureSelector,
} from '@ngrx/store';
import { environment } from '@env/environment';
import { RouterStateUrl, CustomRouterStateSerializer } from '@core/utils/router.util';
import * as fromRouter from '@ngrx/router-store';
import { storeFreeze } from 'ngrx-store-freeze';



export interface State {
  routerReducer: fromRouter.RouterReducerState<RouterStateUrl>;

}
export const reducers: ActionReducerMap<State> = {
  routerReducer: fromRouter.routerReducer,

};




export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function (state: State, action: any): State {
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [logger, storeFreeze]
  : [];


@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      maxAge: 5
    })
  ],
  providers: [
    /**
     * The `RouterStateSnapshot` provided by the `Router` is a large complex structure.
     * A custom RouterStateSerializer is used to parse the `RouterStateSnapshot` provided
     * by `@ngrx/router-store` to include only the desired pieces of the snapshot.
     */
    { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
  ],
})
export class AppStoreModule { }
