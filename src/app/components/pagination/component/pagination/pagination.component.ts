import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core"; 

@Component({
    selector: 'pagination', 
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.css']
})

export class PaginationComponent implements OnInit{
    @Input() currentPage: number = 1; 
    @Input() total: number = 0; 
    @Input() limit: number = 20; 
    @Output() changePage = new EventEmitter<number>(); 

    pages: number[] = []; 

    ngOnInit(): void{
        const PagesCount = Math.ceil(this.total/this.limit); 
        this.pages = this.range(1, PagesCount); 
        console.log(PagesCount);
        console.log(this.pages); 
    }

    range(start:number, end:number): number[]{
        return [...Array(end).keys()].map(el => el + start); 
    }
}