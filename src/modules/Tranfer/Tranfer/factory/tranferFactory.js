(function () {
    'use strict';
    app.factory("tranferFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferItem",
                urlNew: webServiceAPI.NewTransfer + "TransferItem",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                CheckBinBalance: function (model) {
                    var urlRequest = this.urlNew + "/CheckBinBalance";
                    return clientService.post(urlRequest, model);
                },                    
                scanTagNo: function (model) {
                    var urlRequest = this.urlNew + "/ScanTagNo";
                    return clientService.post(urlRequest, model);
                }, 
                Save: function (model) {
                    var urlRequest = this.urlNew + "/SaveDataRelocation";
                    return clientService.post(urlRequest, model);
                },                     
                scanTagNoReserve: function (model) {
                    var urlRequest = this.urlNew + "/ScanTagNoReserve";
                    return clientService.post(urlRequest, model);
                },                     
                checkProductList: function (model) {
                    var urlRequest = this.url + "/CheckProductList/" + model;
                    return clientService.post(urlRequest, {});
                },  
                SumQty: function (model) {
                    var urlRequest = this.urlNew + "/SumQty";
                    return clientService.post(urlRequest, model);
                }                 
            }
        });

})();