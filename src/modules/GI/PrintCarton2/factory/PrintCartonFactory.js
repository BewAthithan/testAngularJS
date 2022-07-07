(function () {
    'use strict';
    app.factory("printCartonFactoryTwo",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "PrintCarton",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                printCarton: function(model) {
                    var urlRequest = this.url + "/Print/";
                    return clientService.post(urlRequest, model);
                }, 
                printCartonearch: function (model) {
                    var urlRequest = this.url+ "/printcartonSearch2";
                    return clientService.post(urlRequest, model);
                },            
            }
        });

})();