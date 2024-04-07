import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Search Result Service */
@Injectable({
    providedIn: 'root'
})
export class SearchResultService {
    private results: any[] = [];

    storeResults(results: any[]): void {
        this.results = results;
    }

    getResults(): any[] {
        return this.results;
    }
}