(function () {
    'use strict';
    app.factory("inquiryLocationFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Inquiry",
                search: function (model) {
                    var urlRequest = this.url + "/getInquiryLocationDetails";
                    return clientService.post(urlRequest, model);
                },
                GetStockDetails: function (model) {                
                    var urlRequest = this.url + "/getInquirySKU_StockDetails";
                    return clientService.post(urlRequest, model);
                },
                searchPutawaySuggest: function (model) {
                    var urlRequest = this.url + "/getInquiryPutawaySuggestionLocation";
                    return clientService.post(urlRequest, model);
                },
                ExportLocationDetails: function(model) {
                    var urlRequest = this.url+ "/ExportLocationDetails";
                    return clientService.downloadInquiry(urlRequest, model);
                    //return clientService.downloadExcelInquiry(urlRequest, model);
                },
                ExportPutawaySuggestionLocation: function(model) {
                    var urlRequest = this.url+ "/ExportPutawaySuggestionLocation";
                    return clientService.downloadInquiry(urlRequest, model);
                },
            }
        });
})();

