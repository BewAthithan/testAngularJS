(function () {
    'use strict';
    app.factory("stockFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Inquiry",
                search: function (model) {
                    var urlRequest = this.url + "/searchInquiryStockMovement";
                    return clientService.post(urlRequest, model);
                },
                ExportStockMovement: function(model) {
                    var urlRequest = this.url+ "/ExportStockMovement";
                    return clientService.downloadInquiry(urlRequest, model);
                },
            }
        });
})();

