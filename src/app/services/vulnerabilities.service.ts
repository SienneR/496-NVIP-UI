import { Injectable } from '@angular/core';
import { Routes } from './apiRoutes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class VulnerabilitiesService {
    constructor(private http: HttpClient) {}

    findAll(options: any): Observable<any> {
        return this.http.get(Routes.vulnerability, {
            params: options,
        });
    }

    findOne(cveId: string): Observable<any> {
        return this.http.get(Routes.vulnerability + cveId);
    }
}
