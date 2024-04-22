import { Component, EventEmitter, Output } from '@angular/core';
import { Router, RouterConfigurationFeature } from '@angular/router';
import { SearchCriteria } from '../models/search-criteria.model';
import { SearchResultService } from '../../services/search-result.service';
import { VulnerabilitiesService } from '../../services/vulnerabilities.service';
import { ApiService } from '../../services/api.service';
import { NgForm } from '@angular/forms';
import { Attribute, Attributes, DateRange } from '../models/utils.model';
import { CveUtilService } from '../cve-util-service';

const vdo: Attribute[] = [
    {
        key: 'Context',
        values: [
            'Application',
            'Channel',
            'Firmware',
            'Guest Os',
            'Host Os',
            'Hypervisor',
            'Physical Hardware',
        ],
    },
    {
        key: 'Mitigation',
        values: [
            'ASLR',
            'HPKP/HSTS',
            'Multi Factor',
            'Authentication',
            'Physical Security',
            'Sandboxed',
        ],
    },
    {
        key: 'Logical Impact',
        values: [
            'Indirect Disclosure',
            'Privilige Escalation',
            'Read',
            'Resource Removal',
            'Service Interrupt',
            'Write',
        ],
    },
    {
        key: 'Attack Theater',
        values: ['Limited Rmt', 'Local', 'Physical', 'Remote'],
    },
    {
        key: 'Impact Method',
        values: [
            'Authentication',
            'Bypass',
            'Code Execution',
            'Context Escape',
            'Man-in-the-Middle',
            'Trust Failure',
        ],
    },
];

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {
    vdo = vdo;
    cvss: string[] = ['Low', 'Medium', "High", "Critical"]

    @Output() searchCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private vulnerabilityService: VulnerabilitiesService,
        public utilService: CveUtilService,
        private searchResultService: SearchResultService,
        private router: Router
    ) { }

    ngOnInit(): void { }

    updateContent(event: any) { }

    search() {
        console.log("It goes here for search.")
        this.vulnerabilityService.search({}, this.utilService.searchObject).subscribe((response) => {
            this.utilService.vulnerabilities = response.data;
            this.utilService.paginationObject.totalPages = response.total;
        })
    }

    onCvssChange(event: any, item: string) {
        var checked = event.target.checked;
        if (checked == false) {
            var index = this.utilService.searchObject.cvss.indexOf(item);
            this.utilService.searchObject.cvss.splice(index, 1);
        } else {
            this.utilService.searchObject.cvss.push(item);
        }
        this.updateContent(event);
    }

    onDateChange(event: any, field: string) {
        if (field === 'fromDate') {
            this.utilService.searchObject.publishedDate.fromDate = event.target.value;
        } else if (field === 'toDate') {
            this.utilService.searchObject.publishedDate.toDate = event.target.value;
        }
    }
}
