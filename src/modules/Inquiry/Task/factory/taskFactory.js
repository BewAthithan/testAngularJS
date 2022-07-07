(function () {
    'use strict';
    app.factory("taskFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Report + "Inquiry",
                search: function (model) {
                    var urlRequest = this.url + "/searchInquiryTask";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();

