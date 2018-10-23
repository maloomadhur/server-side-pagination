# ServerSidePagination

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.3.


# Disclaimer

This is a demonstration of how server side pagination can be implemented through Angular. The code is not a full fledged plug n play component. Some modifications are required suiting your project server side architecture.


# Description

The code is an implementation of server side pagination using Angular v6 and EntityFramework at the back end. It accepts several parameters (detailed below) and returns the search results in json format which can be further customized for display.


# Parameters

 1) dataUrl - endpoint URL for fetching data
 2) httpRequestType - GET/POST/PUT/DELETE
 3) totalRecords - total number of records for determining number of pages
 4) pageSize - number of records per page
 5) isRefreshCurrentPage - flag for refreshing current page
 6) filterParams - parameters for filtering the values at server side. Eg. { ParameterName : IsActive, Parameter Value : true }
