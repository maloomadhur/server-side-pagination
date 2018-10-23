import { Component, OnInit } from '@angular/core';
import { HttpRequestType } from './pagination/http-request-types';
import { PaginationFilterModel } from './pagination/pagination-filter-model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{

  title = 'server-side-pagination';
  sampleValues:SampleValues[]=new Array<SampleValues>();
  dataUrl:string="";
  httpRequestType:HttpRequestType=HttpRequestType.Get;
  totalRecords:number=0;
  pageSize:number=10;
  isRefreshCurrentPage:boolean=false;
  filterParams:PaginationFilterModel[] = new Array<PaginationFilterModel>();

  ngOnInit(): void {
    this.dataUrl="http://localhost:5000/api/v1/sv";
  }

  getPaginationResults(data){
    this.totalRecords=data.totalRecords;
    this.sampleValues=data.sampleValues;
  }
}

class SampleValues{
  id:number;
  value:string;  
}