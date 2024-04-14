import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { VulnerabilitiesService } from '../../services/vulnerabilities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CveUtilService } from '../cve-util-service';
import { HttpLoadingService } from '../../services/shared/http-loading.service';

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
        public router: Router,
        public loadingService: HttpLoadingService,
        private activatedRoute: ActivatedRoute

    ) { }
    ngOnInit(): void {
        var type = performance.getEntriesByType("navigation")[0].entryType;
        console.log(type)
        this.activatedRoute.queryParams.subscribe((params) => {
            this.utilService.paginationObject.currentPage = params['page'] || 1;
            this.queryMethod();

        });
    }

    pageChanged(event: any) {
        const isSearch = this.activatedRoute.snapshot.queryParams['search'] || false;
        this.router.navigate(['/vulnerabilities'], {
            queryParams: { page: event, search: isSearch },
        });
    }

    paginate() {
        this.totalItems = 0;
        this.vulnerabilityService
            .findAll(this.getOptions())
            .subscribe((response) => {
                this.utilService.vulnerabilities = response.data;
                this.utilService.paginationObject.totalPages = response.total;
            });
    }

    queryMethod() {
        const isSearch = this.activatedRoute.snapshot.queryParams['search'] || 'false';
        if (isSearch == 'true') {
            this.search();
            this.getOptions();
        } else {
            this.paginate();
        }
    }

    onSearch() {
        const isSearch = this.activatedRoute.snapshot.queryParams['search'] || false;
        const page = this.activatedRoute.snapshot.queryParams['page'];
        console.log("Entering onSearch")
        if (page == '1' && isSearch == 'true') {
            this.queryMethod();

        } else {
            this.router.navigate(['/vulnerabilities'], {
                queryParams: { page: 1, search: 'true' },
            });
        }

    }
    search() {
        this.totalItems = 0;
        this.vulnerabilityService
            .search(this.getOptions(), this.utilService.searchObject)
            .subscribe((response) => {
                this.utilService.vulnerabilities = response.data;
                this.utilService.paginationObject.totalPages = response.total;
            });
    }

    getOptions() {
        const skip = this.utilService.paginationObject.currentPage
            ? (this.utilService.paginationObject.currentPage -
                1) * this.itemsPerPage
            : 0;

        var options = {
            limit: this.itemsPerPage,
            skip: skip
        };

        return options;
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
