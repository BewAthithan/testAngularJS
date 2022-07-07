(function () {
    'use strict';
    app.factory("TransferStockAdjustmentFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferStockAdjustment",
                urlNew: webServiceAPI.NewTransfer + "TransferStockAdjustment",
                filterowner: function () {
                    var urlRequest = this.urlNew + "/filterOwner?ownerIndex=" + localStorageService.get("ownerVariableIndex");
                    return clientService.get(urlRequest);
                },
                filterWarehouse: function () {
                    var urlRequest = this.urlNew + "/filterWarehouse?warehouseIndex=" + localStorageService.get("warehouseVariableIndex");
                    return clientService.get(urlRequest);
                },
                confirm: function (model) {
                    var urlRequest = this.urlNew + "/ConfirmMarshall";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.urlNew;
                    return clientService.post(urlRequest, model);
                }, 
                ScanLocation: function (model) {
                    var urlRequest = this.urlNew + "/ScanLocation";
                    return clientService.post(urlRequest, model);
                },  
                SumQty: function (model) {
                    var urlRequest = this.urlNew + "/SumQty";
                    return clientService.post(urlRequest, model);
                },  
                ScanProduct: function (model) {
                    var urlRequest = this.urlNew + "/ScanProduct";
                    return clientService.post(urlRequest, model);
                },  
                CheckScanLocation: function (model) {
                    var urlRequest = this.urlNew + "/CheckLocation";
                    return clientService.post(urlRequest, model);
                },                       
            }
        });

})();