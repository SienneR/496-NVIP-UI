import { Component, OnInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { VulnerabilitiesService } from '../../services/vulnerabilities.service';
import { ActivatedRoute, Router } from '@angular/router';
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
        public router: Router,
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

    queryMethod() {
        const isSearch = this.activatedRoute.snapshot.queryParams['search'] || 'false';
        if (isSearch == 'true') {
            this.search();
            this.getOptions();
        } else {
            this.paginate();
        }
    }

    pageChanged(event: any) {
        const isSearch = this.activatedRoute.snapshot.queryParams['search'] || false;
        this.router.navigate(['/vulnerabilities'], {
            queryParams: { page: event, search: isSearch },
        });
    }

    onSearch() {
        const isSearch = this.activatedRoute.snapshot.queryParams['search'] || false;
        const page = this.activatedRoute.snapshot.queryParams['page'];
        console.log("Hits here.")
        if (page == '1' && isSearch == 'true') {
            this.queryMethod();

        } else {
            this.router.navigate(['/vulnerabilities'], {
                queryParams: { page: 1, search: 'true' },
            });
        }

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

    paginate() {
        this.totalItems = 0;
        this.vulnerabilityService
            .findAll(this.getOptions())
            .subscribe((response) => {
                this.utilService.vulnerabilities = response.data;
                console.log(this.utilService.vulnerabilities)
                this.utilService.paginationObject.totalPages = response.total;
            });
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

    scrollToCard(index: number) {
        const cardElement = this.cards.toArray()[index].nativeElement;
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
    }
}
