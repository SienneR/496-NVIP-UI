import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { VulnerabilitiesService } from '../../services/vulnerabilities.service';
import { Router } from '@angular/router';
import { CveUtilService } from '../cve-util-service';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
    vulnerabilities: any[] = [];
    itemsPerPage: number = 10;
    cardRefs: ElementRef[] = [];

    maxSize: number = 5;
    totalItems: number = 0;
    isLoading: boolean = false;

    @ViewChildren('card') cards: QueryList<ElementRef>;

    constructor(
        private vulnerabilityService: VulnerabilitiesService,
        public utilService: CveUtilService,
        public router: Router
    ) { }
    ngOnInit(): void {
        this.paginate(this.utilService.paginationObject.currentPage);
    }

    pageChanged(event: any) {
        this.utilService.paginationObject.currentPage = event;
        this.paginate(event);
    }

    paginate(currentPage: number) {
        var options = {
            limit: this.itemsPerPage,
            skip: (currentPage - 1) * this.itemsPerPage,
        };
        this.isLoading = true;
        this.totalItems = 0;
        this.vulnerabilityService.findAll(options).subscribe((response) => {
            console.log("Response Data: ", response.data)
            this.vulnerabilities = response.data;
            console.log(this.vulnerabilities)
            this.totalItems = response.total;
            this.isLoading = false;
        });
    }

    handleSearchResults(searchData: any): void {
        this.isLoading = true;
        this.totalItems = 0;

        // Check if only CVE ID is provided
        if (searchData.cveId && !searchData.startDate && !searchData.endDate) {
            this.vulnerabilityService.findByCveId(searchData.cveId).subscribe((response) => {
                this.processSearchResponse([response]);
            });
        } else {
            // Use for searches with more select options
            const options = { limit: this.itemsPerPage };
            this.vulnerabilityService.search(options, searchData).subscribe((response) => {
                this.processSearchResponse(response.data);
            });
        }
    }

    private processSearchResponse(results: any[]): void {
        this.vulnerabilities = results;
        console.log("Main Component Vulnerabilities: ", this.vulnerabilities)
        this.totalItems = results.length;
        this.isLoading = false;
    }


    scrollToCard(index: number) {
        const cardElement = this.cards.toArray()[index].nativeElement;
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
}
