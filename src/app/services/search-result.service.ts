import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Search Result Service */
@Injectable({
    providedIn: 'root'
})
export class SearchResultService {
    private results: Array<any> = [];

    getResults(): any[] {
        return this.results;
    }

    storeResults(results: Array<any>) {
        this.results = results;
        console.log("SearchResult Service: ", results);
    }
}