import { Injectable } from '@angular/core';
import { Routes } from './apiRoutes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class VulnerabilitiesService {
    constructor(private http: HttpClient) { }

    findAll(options: any): Observable<any> {
        console.log("Step 3: findAll function outputs vulnerabilties with these parameters.", options)
        return this.http.get(Routes.vulnerability, {
            params: options,
        });
    }

    findOne(cveId: string): Observable<any> {
        return this.http.get(Routes.vulnerability + "/" + cveId);
    }

    findByCveId(cveId: string): Observable<any> {
        // Construct the URL with the CVE ID as part of the path
        const url = `${Routes.vulnerability}/${cveId}`;

        // Make a GET request to the constructed URL
        return this.http.get(url);
    }

    search(options: any, searchData: any): Observable<any> {
        let params = new HttpParams();
        console.log("Step 4: search function receives data from the API.")
        console.log("Vulnerability Service Options: ", options);
        console.log("Vulnerability Service Search Data: ", searchData);
        Object.keys(options).forEach(key => {
            params = params.set(key, options[key]);
        });
        return this.http.post(Routes.vulnerability + "/search", searchData, {
            params
        })
    }
}
