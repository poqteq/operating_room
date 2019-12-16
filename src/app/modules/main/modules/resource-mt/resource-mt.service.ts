import { Injectable, Inject } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class ResourceMtService {
  constructor(
    private http: HttpClient,
    @Inject("BASE_CONFIG") private config
  ) {}
}
