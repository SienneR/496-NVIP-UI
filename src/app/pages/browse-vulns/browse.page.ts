/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Session } from 'src/app/services/Auth/auth-service.service';
import { CookieService } from 'src/app/services/Cookie/cookie.service';
import { VulnService } from 'src/app/services/vuln/vuln.service';
/** Browse Vulnerabilities page */

//Vulnerability Interface
interface Vulnerability {
  CveID: string;
  Summary: string;
  Severity: string;
}

@Component({
  selector: 'nvip-recent',
  templateUrl: './browse.page.html',
  styleUrls: ['./browse.page.css'],
})

export class BrowsePage {
  // Array to store test data
  testData: Vulnerability[] = [];

  // Current page number
  currentPage: number = 1;

  // Items per page
  itemsPerPage: number = 10;

  //Number of vulnerabilties 
  numberOfEntries: number; 

  // Calculate the total number of pages
  get totalPages(): number {
    return Math.ceil(this.testData.length / this.itemsPerPage);
  }

  // Function to update the current page
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      this.currentPage = pageNumber;
    }
  }

  totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  constructor() {
    // Generating test data
     this.numberOfEntries = this.getRandomNumber(20, 60);

    // Generate test data entries
    for (let i = 0; i < this.numberOfEntries; i++) {
      this.testData.push({
        CveID: `CVE-2024-${i + 1}`,
        Summary: `This is the summary for CVE-2024-${i + 1}`,
        Severity: this.getRandomSeverity()
      });
    }
  }

  // Function to generate a random number between min and max (inclusive)
  private getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Function to generate a random severity
  private getRandomSeverity(): string {
    const severities = ['Low', 'Medium', 'High'];
    const randomIndex = Math.floor(Math.random() * severities.length);
    return severities[randomIndex];
  }

  // Function to get the items for the current page
  getItemsForCurrentPage(): Vulnerability[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.testData.slice(startIndex, endIndex);
  }
 
  getStartIndex(): number{
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number{
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  if (this.currentPage === (this.totalPages)){
    //number of empty spaces on the page 
     const emptySpaces = (startIndex + this.itemsPerPage) - this.numberOfEntries;
    if (emptySpaces === 9){
      return startIndex + 1; 
    }
    return this.numberOfEntries;
  }
  return startIndex + this.itemsPerPage;
  }
}

