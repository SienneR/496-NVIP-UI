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

    /**
    Attempted to implement search in a different way

    search(searchParams: any): Observable<any> {
        // The base URL for searching vulnerabilities
        const url = `${Routes.vulnerability}`;

        // Create an instance of HttpParams
        let params = new HttpParams();

        // Add search parameters to 'params'
        Object.keys(searchParams).forEach(key => {
            // Check if the value is not null or undefined
            if (searchParams[key] != null) {
                params = params.set(key, searchParams[key].toString());
            }
        });
        // Make a GET request with the search parameters
        return this.http.get(url, { params });
    }
    */
    search(options: any, searchData: any): Observable<any> {
        let params = new HttpParams();
        console.log(searchData);
        Object.keys(options).forEach(key => {
            params = params.set(key, options[key]);
            console.log();
        });
        return this.http.post(Routes.vulnerability + searchData, {
            params
        })
    }
}
