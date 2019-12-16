import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BuildingComponent } from "./medical-workers/medical-workers.component";
import { AddressCodeComponent } from "./address-code/address-code.component";
import { EquipmentComponent } from "./equipment/equipment.component";
import { UserDataComponent } from "./user-data/user-data.component";
import { ResidentComponent } from "./resident/resident.component";
import { SpecialGroupComponent } from './special-group/special-group.component';
import { HouseholdComponent } from './household/household.component';
import { MaterialComponent } from './material/material.component';
import { LocateComponent } from './locate/locate.component';
import { OrganizeComponent } from './organize/organize.component';

const routes: Routes = [
  { path: "medical-workers", component: BuildingComponent },
  { path: "address-code", component: AddressCodeComponent },
  { path: "equipment", component: EquipmentComponent },
  { path: "user-data", component: UserDataComponent },
  { path: "resident", component: ResidentComponent },
  { path: "special-group", component: SpecialGroupComponent },
  { path: "household", component: HouseholdComponent },
  { path: "locate", component: LocateComponent},
  { path: "material", component: MaterialComponent},
  { path: "organize", component: OrganizeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceMtRoutingModule {}
