import { Component, Input, Output, OnInit, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PaginationFilterModel } from './pagination-filter-model';
import { HttpClient } from '@angular/common/http';
import { HttpRequestType } from './http-request-types';
import { subscribeOn, map } from 'rxjs/operators';

@Component({
  selector: 'pagination',
  templateUrl: './pagination.component.html',
  styleUrls:['./pagination.component.css']
})

export class PaginationComponent implements OnInit, OnChanges {

  @Input()
  filterParams: PaginationFilterModel[] = new Array<PaginationFilterModel>();

  @Input()
  dataUrl: string = "";

  //componnents should specify the request type to fetch the data
  @Input()
  httpRequestType: HttpRequestType;

  //every component implementing pagination control must return the total number of records along with the resultset
  @Input()
  totalRecords: number = 0;

  @Input()
  pageSize: number = 0;

  @Input()
  isRefreshCurrentPage: boolean = false;

  @Output()
  result: EventEmitter<any> = new EventEmitter();

  totalPages: number = 0;
  pages: number[] = [];
  currentPage: number = 1;
  startPage: number = 1;
  endPage: number = 10;

  pageModelInternal: PaginationFilterModel[] = new Array<PaginationFilterModel>();

  constructor(private http: HttpClient) { }
  
  //this method will determine the number of pages based on the total records
  getNoOfPages(): void {
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
  }

  /**
   * 
   * @param dataUrl
   * @param params
   */
  getResultData(dataUrl: string, params: PaginationFilterModel[]): void {
    if (this.httpRequestType === HttpRequestType.Get) {
      //this.http.get(dataUrl).pipe(map(res => this.result.emit(res)));
      this.http.get(dataUrl).pipe(map(res => res)).subscribe(res =>{this.result.emit(res) })
    }
    else if (this.httpRequestType === HttpRequestType.Post) {
      this.http.post(dataUrl, params).pipe(map(res => this.result.emit(res)));
    }
    else if (this.httpRequestType === HttpRequestType.Put) {
      this.http.put(dataUrl, params).pipe(map(res => this.result.emit(res)));
    }
    else if (this.httpRequestType === HttpRequestType.Delete) {
      this.http.delete(dataUrl).pipe(map(res => this.result.emit(res)));
    }
    else {
      //bad request indication
      this.result.emit("Bad Request");
    }
  }

  //get the page results corresponding to the page number clicked
  loadResults(page: number): void {

    //recreate the model sent as part of the Http request with updated parameters.
    this.currentPage = page;
    this.pageModelInternal = [];
    let pgObj: PaginationFilterModel[] = new Array<PaginationFilterModel>(
      { name: "Skip", value: ((page - 1) * this.pageSize).toString() },
      { name: "Take", value: this.pageSize.toString() }
    );
    pgObj = pgObj.concat(this.filterParams);
    this.pageModelInternal = pgObj;

    //Fetch the records based on new params. URL will remain as supplied as earlier request
    this.getResultData(this.dataUrl, this.pageModelInternal);
    this.setPageButtons();
  }


  ngOnInit(): void {
    this.getNoOfPages();

    //ensure current page is always in range
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    else if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.loadResults(1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.recordCount) {
      this.totalRecords = changes.totalRecords.currentValue;
      this.getNoOfPages();
      this.setPageButtons();
    }
    if (changes.isRefreshCurrentPage) {
      this.isRefreshCurrentPage = changes.isRefreshCurrentPage.currentValue;
      if (this.isRefreshCurrentPage) {
        this.refreshCurrentPage();
        this.isRefreshCurrentPage = false;
      }
    }

  }

  //sets the pagination buttons to show if total pages exceed 10
  setPageButtons() {
    if (this.totalPages <= 10) {
      this.startPage = 1;
      this.endPage = this.totalPages;
    }

    else {
      if (this.currentPage <= 6) {
        this.startPage = 1;
        this.endPage = 10;
      }
      else if (this.currentPage + 4 >= this.totalPages) {
        this.startPage = this.totalPages - 9;
        this.endPage = this.totalPages;
      }
      else {
        this.startPage = this.currentPage - 5;
        this.endPage = this.currentPage + 4;
      }
    }

    //set the page buttons to display
    this.pages = Array.from(Array((this.endPage + 1) - this.startPage).keys()).map(i => this.startPage + i);
  }

  refreshCurrentPage() {
    this.loadResults(this.currentPage);
  }
}