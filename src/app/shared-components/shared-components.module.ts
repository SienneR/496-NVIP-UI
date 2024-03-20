import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from './page-header/page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpinnerComponent } from './spinner/spinner.component';
import { TreeComponent } from './tree/tree.component';
import { NoDataComponent } from './no-data/no-data.component';

@NgModule({
    declarations: [PageHeaderComponent,SpinnerComponent, TreeComponent, NoDataComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [PageHeaderComponent,SpinnerComponent,TreeComponent,NoDataComponent],
})
export class SharedComponentsModule {}
