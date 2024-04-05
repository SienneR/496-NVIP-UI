import { Component } from '@angular/core';
import { Router, RouterConfigurationFeature } from '@angular/router';
import { SearchCriteria } from '../models/search-criteria.model';
import { SearchResultService } from '../../services/search-result.service';
import { VulnerabilitiesService } from '../../services/vulnerabilities.service';
import { NgForm } from '@angular/forms';
import { MainComponent } from './main.component';
import { CveUtilService } from '../cve-util-service';
import { SharedDataService } from '../shared-data-service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent{
    cveId: string = '';
    search = {} as SearchCriteria;
    searchResults: Array<any> = [];
    pageBlocks: Array<number> = [];
    pageRecord: Array<number> = [];
    currentPage = 0;
    totalPages = 0;
    pageLimit = 10;
    totalPageLimit = 0;

    results: any[] = [];
    itemsPerPage = 10;
    totalItems = 0;
    isLoading:boolean=false;
    final: any[] = [];
    didSearch = false;
    


    constructor (
        public vulnerabilityService: VulnerabilitiesService,
        public searchResultService: SearchResultService,
        public utilService:CveUtilService,
        public router: Router,
        private sharedDataService: SharedDataService
    ) { }

    getDidSearch() {
        return this.sharedDataService.ifSearched();
    }

    updateSharedArray(newArray: any[]) {
        this.sharedDataService.updateArray(newArray);
    }

    get sharedArray() {
        return this.sharedDataService.sharedArray;
    }


    searchVulns($event: any, f: NgForm): void {
        var options = {
            limit: this.itemsPerPage
        };
        // If only CVE-ID is provided, use findOne. Otherwise, use search.
        if (this.cveId && !this.search.startDate && !this.search.endDate) {
            //this.router.navigate(['/cve', 'CVE-' + this.cveId]);
            this.vulnerabilityService.findAll(options).subscribe((response) => {
                this.results = response.data;
                this.totalItems = response.total;
                this.isLoading=false;
            });
            this.final = this.results.filter(item=> item.cveId.includes(this.cveId));
            this.updateSharedArray(this.final);
            this.sharedDataService.updateSearch(true);
        } else {
            const searchParams = {
                cveId: this.cveId,
                startDate: this.search.startDate,
                endDate: this.search.endDate,
            };
            this.vulnerabilityService.search(searchParams).subscribe({
                next: (results) => {
                    this.searchResultService.storeResults(results);
                },
                error: (error) => console.error('Search error:', error)
            });
        }
    }

    updatePages(totalEntries: number) {
        // If there are no entries, skip this method
        if (totalEntries == 0) {
            this.pageBlocks = [];
            this.pageRecord = [0, 0];
            return;
        }

        var numPages =
            this.totalPageLimit <= 1 ? 0 : Math.floor(this.totalPageLimit / 2) - 1;
        var start =
            this.currentPage - numPages < 0 ? 0 : this.currentPage - numPages;
        var end =
            this.currentPage + numPages > this.totalPages
                ? this.totalPages
                : this.currentPage + numPages + 1;

        // If the ending page is before the total allowed number of pages, set it to the
        // total number of pages allowed
        if (end < this.totalPageLimit) end = this.totalPageLimit;
        var totalPages =
            this.totalPageLimit == 1 ? this.totalPageLimit : this.totalPageLimit + 1;
        var pageBlocks = [];
        for (let i = 0; i < totalPages && i < 10; i++) {
            pageBlocks.push(i);
        }

        // Calculate the record range based on the current page and the total
        // number of entries
        this.pageRecord = [
            this.currentPage * this.pageLimit + 1,
            (this.currentPage + 1) * this.pageLimit > totalEntries
                ? totalEntries
                : (this.currentPage + 1) * this.pageLimit,
        ];

        this.pageBlocks = pageBlocks;
    }
}
