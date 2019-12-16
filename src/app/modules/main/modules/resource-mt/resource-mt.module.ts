import { NgModule } from "@angular/core";
import { MedicalWorkersComponent } from "./medical-workers/medical-workers.component";
import { EquipmentComponent } from "./equipment/equipment.component";
import { AddressCodeComponent } from "./address-code/address-code.component";
import { UserDataComponent } from "./user-data/user-data.component";
import { SharedModule } from "@shared/shared.module";
import { ResourceMtRoutingModule } from "./resource-mt-routing.module";
import { EditAddressComponent } from "./user-data/edit-address/edit-address.component";
import { ResidentComponent } from './resident/resident.component';
import { SpecialGroupComponent } from './special-group/special-group.component';
import { HouseholdComponent } from './household/household.component';
import { MaterialComponent } from './material/material.component';
import { LocateComponent } from './locate/locate.component';
import { OrganizeComponent } from './organize/organize.component';

@NgModule({
  imports: [SharedModule, ResourceMtRoutingModule],
  declarations: [
    MedicalWorkersComponent,
    EquipmentComponent,
    AddressCodeComponent,
    UserDataComponent,
    EditAddressComponent,
    ResidentComponent,
    SpecialGroupComponent,
    HouseholdComponent,
    MaterialComponent,
    LocateComponent,
    OrganizeComponent
  ]
})
export class ResourceMtModule {}
