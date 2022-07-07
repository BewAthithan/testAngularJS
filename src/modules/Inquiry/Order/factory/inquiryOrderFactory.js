(function () {
    'use strict';
    app.factory("inquiryOrderFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Inquiry",
                searchOrderStatus: function (model) {
                    var urlRequest = this.url + "/getInquiryOrderStatus";
                    return clientService.post(urlRequest, model);
                },
                searchOrderHistory: function (model) {
                    var urlRequest = this.url + "/getInquiryOrderHistory";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();

