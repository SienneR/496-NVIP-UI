import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterConfigurationFeature } from '@angular/router';
import { SearchCriteria } from '../models/search-criteria.model';
import { SearchResultService } from '../../services/search-result.service';
import { VulnerabilitiesService } from '../../services/vulnerabilities.service';
import { ApiService } from '../../services/api.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.css']
})
export class SearchComponent {
    search = {} as SearchCriteria;
    searchResults: Array<any> = [];
    filteredSearchResults: Array<any> = [];
    cvssScores = [];
    vdoNounGroups = {} as Record<string, Array<any>>;
    vdoNounGroupLabels = [] as Array<any>;
    vdoEntityLabels = {} as Record<string, Array<any>>;
    pageBlocks: Array<number> = [];
    pageRecord: Array<number> = [];
    currentPage = 0;
    totalPages = 0;
    pageLimit = 10;
    totalPageLimit = 0;
    resultTotalCount = 0;
    searchSuccess = false;

    @Output() searchCompleted = new EventEmitter<any[]>();

    constructor(
        private vulnerabilityService: VulnerabilitiesService,
        private searchResultService: SearchResultService,
        private router: Router
    ) { }

    searchVulns(formData: any): void {
        this.searchResults = [];
        this.filteredSearchResults = [];
        const searchParams = {
            cveId: formData.cveId,
            startDate: formData.startDate,
            endDate: formData.endDate,
        };
        console.log(this.search);
        if (searchParams.cveId != null && searchParams.cveId != '') {
            /**
            this.vulnerabilityService.search(searchParams.cveId)
                .subscribe(results => {
                    this.searchCompleted.emit(results);
                })

            ()*/

            this.vulnerabilityService.findOne(searchParams.cveId)
                .subscribe(results => {
                    this.searchResultService.storeResults([results]);
                    this.handleRes([results]);
                    this.searchCompleted.emit(results);
                    console.log("Search Component: ", results)
                }, error => {
                    console.error('Search error: ', error)
                });
        }
        if (searchParams.startDate != null && searchParams.endDate != null) {
            console.log(this.search);
            console.log('Start Date: ', searchParams.startDate);
            console.log('End Date: ', searchParams.endDate);
        }
        /**this.vulnerabilityService.search(searchParams).subscribe({
            next: (results: any) => {
                this.searchResultService.storeResults([results]);
                this.handleRes([results]);

            },
            error: (error) => console.error('Search error:', error)
        });**/
    }
    /**searchVulns($event: any, f: NgForm): void {
        // If only CVE-ID is provided, use findOne. Otherwise, use search.
        if (this.cveId && !this.search.startDate && !this.search.endDate) {
            this.router.navigate(['/cve', this.cveId]);
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
    }**/
    /**
    ngOnInit(): void {
        this.vulnerabilityService
    }
    */
    /**searchVuln(x) {
        console.log(x);
    }**/
    handleRes(res: any) {
        this.resultTotalCount = res.length;
        this.searchResults = res;
        console.log("Handle Res", this.searchResults)
        this.searchSuccess = true;
        if (this.resultTotalCount < 10) {
            this.totalPageLimit = 1;
        } else {
            this.totalPageLimit = Math.ceil(this.resultTotalCount / 10) - 1;
        }
        this.filteredSearchResults = this.searchResults.slice(0, this.pageLimit);
        this.getTotalPages();
        this.updatePages(this.searchResults.length);
        console.log(res)
    }

    getTotalPages() {
        var totalPages =
            this.resultTotalCount % this.pageLimit == 0
                ? this.resultTotalCount / this.pageLimit
                : Math.floor(this.resultTotalCount / this.pageLimit) + 1;

        // Set the total number of pages
        this.totalPages = totalPages;
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
