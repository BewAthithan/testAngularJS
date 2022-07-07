(function () {
    'use strict';
    app.factory("tranferPalletFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TransferPallet",
                urlNew: webServiceAPI.NewTransfer + "TransferPallet",
                filter: function (model) {
                    var urlRequest = this.urlNew + "/filter";
                    return clientService.get(urlRequest, model);
                },
                groupProduct: function (model) {
                    var urlRequest = this.urlNew + "/GroupProduct";
                    return clientService.post(urlRequest, model);
                },                     
                scanLocation: function (model) {
                    var urlRequest = this.urlNew + "/ScanLocation" ;
                    return clientService.post(urlRequest, model);
                },                     
                scanLpnNo: function (model) {
                    var urlRequest = this.urlNew + "/ScanLpnNo" ;
                    return clientService.post(urlRequest, model);
                },                    
                CheckBinBalance: function (model) {
                    var urlRequest = this.urlNew + "/CheckBinBalance";
                    return clientService.post(urlRequest, model);
                },                    
                Save: function (model) {
                    var urlRequest = this.urlNew + "/Confirm";
                    return clientService.post(urlRequest, model);
                },  
                SumQty: function (model) {
                    var urlRequest = this.urlNew + "/SumQty";
                    return clientService.post(urlRequest, model);
                },                
            }
        });

})();