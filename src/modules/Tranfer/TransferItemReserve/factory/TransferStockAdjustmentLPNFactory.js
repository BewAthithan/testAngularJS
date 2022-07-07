(function () {
    'use strict';
    app.factory("TransferStockAdjustmentLPNFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferStockAdjustmentLPN",
                urlNew: webServiceAPI.NewTransfer + "TransferStockAdjustmentLPN",
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
                ScanLPN: function (model) {
                    var urlRequest = this.urlNew + "/ScanLPN";
                    return clientService.post(urlRequest, model);
                },  
                ScanProduct: function (model) {
                    var urlRequest = this.urlNew + "/ScanProduct";
                    return clientService.post(urlRequest, model);
                },  
                SumQty: function (model) {
                    var urlRequest = this.urlNew + "/SumQty";
                    return clientService.post(urlRequest, model);
                },      
                CheckScanLPN: function (model) {
                    var urlRequest = this.urlNew + "/CheckScanLPN";
                    return clientService.post(urlRequest, model);
                },                   
            }
        });

})();