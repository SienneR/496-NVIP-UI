import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  sharedArray: any[] = [];
  didSearch = false;

  updateArray(newArray: any[]) {
    this.sharedArray = newArray;
  }

  ifSearched() {
    return this.didSearch;
  }

  updateSearch(value: boolean ): void {
    this.didSearch = value;
  }

  getArray() {
    return this.sharedArray;
  }
}