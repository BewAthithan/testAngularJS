(function () {
    'use strict';
    app.factory("scanPutToCartonFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanPutToCaton",
                ScanTransferNo: function (model) {   
                    var urlRequest = this.url + "/TransferNo";
                    return clientService.post(urlRequest, model);
                }, 
                ScanPickTicket: function (model) {
                    var urlRequest = this.url + "/PickTicket";
                    return clientService.post(urlRequest, model);
                },
                checkGoodReceiveItem: function (model) {              
                    var urlRequest = this.url + "/GoodsIssueItem";
                    return clientService.post(urlRequest, model);
                },
                ScanProduct: function (model) {              
                    var urlRequest = this.url + "/ProductBarcode";
                    return clientService.post(urlRequest, model);
                }, 
                ScanQTY: function (model) {              
                    var urlRequest = this.url + "/CheckQty";
                    return clientService.post(urlRequest, model);
                }, 
                add: function (model) {   
                    var urlRequest = this.url + "/Confirm";
                    return clientService.post(urlRequest, model);
                },
                getSkip: function (model) {   
                    var urlRequest = this.url + "/skip";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();