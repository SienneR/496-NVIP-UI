import { Injectable } from '@angular/core';
import {
    HttpClient,
    HttpContext,
    HttpHeaders,
    HttpParams,
} from '@angular/common/http';
import { Observer } from 'rxjs';
import { Routes } from './apiRoutes';

export interface HttpRequest {
    url: string;
    options: HttpRequestOptions;
}

export interface HttpRequestOptions {
    method: string;
    headers?: HttpHeaders | { [header: string]: string | string[] } | undefined;
    context?: HttpContext | undefined;
    params?: HttpRequestParams;
    reportProgress?: boolean;
    withCredentials?: boolean;
}

export type HttpRequestParams =
    | HttpParams
    | {
        [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>;
    };

@Injectable({
    providedIn: 'root',
})

export class ApiService {
    private GET_OPTIONS: HttpRequestOptions = {
        method: 'GET',
    };
    private POST_OPTIONS: HttpRequestOptions = {
        method: 'POST',
    };

    constructor(private httpClient: HttpClient) { }

    cveSearch(searchRequest: any) {
        return this.httpClient
            .get(Routes.vulnerability, this.injectGetParameters({ ...searchRequest }, searchRequest.token))
    }

    vulnServGetByDate(date: string, token: string) {
        return this.httpClient.get(
            Routes.vulnerability + '/date/' + date,
            this.injectGetParameters({}, token)
        );
    }

    private injectGetParameters(params: HttpRequestParams, token: string) {
        return {
            ...this.GET_OPTIONS,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            params: params
        };
    }
}