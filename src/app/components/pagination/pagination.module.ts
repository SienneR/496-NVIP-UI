import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { PaginationComponent } from "./component/pagination/pagination.component";

@NgModule({
    imports: [CommonModule],
    declarations: [PaginationComponent],
    exports: [PaginationComponent]
})
    
export class PaginationModule{}