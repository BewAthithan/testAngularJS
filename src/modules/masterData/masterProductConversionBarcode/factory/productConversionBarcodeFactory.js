(function () {
    'use strict';
    app.factory("productConversionBarcodeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ProductConversionBarcode",
                filter: function (model) {
                    // var urlRequest = this.url;
                    // return clientService.get(urlRequest);
                    var urlRequest = this.url + "/GetProductConversionBarcode";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.delete(urlRequest);
                },
                add: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                }, 
                scanBarcode: function (model) {
                    var urlRequest = this.url + "/ScanBarcode";
                    return clientService.post(urlRequest, model);
                },                    
                scanProductCon: function (model) {
                    var urlRequest = this.url + "/ScanProductCVBarcode/" + model;
                    return clientService.post(urlRequest, {});
                },    
            }
        });

})();