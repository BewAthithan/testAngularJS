(function () {
    'use strict';
    app.factory("scanReceiveFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "goodsReceive",
                ProductBarcode: function (model) {
                    var urlRequest = this.url + "/ProductBarcode";
                    return clientService.post(urlRequest, model);
                },
                ProductDetail: function (model) {
                    var urlRequest = this.url + "/ProductDetail";
                    return clientService.post(urlRequest, model);
                },
                CheckTAG: function (model) {
                    var urlRequest = this.url + "/CheckTAG";
                    return clientService.post(urlRequest, model);
                },
                CheckReceiveQty: function (model) {   
                    var urlRequest = this.url + "/CheckReceiveQty";
                    return clientService.post(urlRequest, model);
                },
                SaveTag: function (model) {              
                    var urlRequest = this.url + "/SaveTag";
                    return clientService.post(urlRequest, model);
                }, 
                scanGR: function (model) {
                    console.log(model);
                    var urlRequest = this.url + "/scanGR";
                    return clientService.post(urlRequest, model);
                }, 
                checkGoodReceiveItem: function (model) {              
                    var urlRequest = this.url + "/CheckGoodReceiveItem";
                    return clientService.post(urlRequest, model);
                }, 
                filterSacn: function (model) {
                    var urlRequest = this.url + "/filterTag";
                    return clientService.post(urlRequest,model);
                },
                getDeleteScan: function (model) {                    
                    var urlRequest = this.url + "/getDeleteScan";
                    return clientService.post(urlRequest,model);
                },
                CreateScanLPN: function (model) {              
                    var urlRequest = this.url + "/CreateScanLPN";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssignScanReceive: function (model) {
                    var urlRequest = this.url + "/updateUserAssignScanReceive";
                    return clientService.post(urlRequest, model);
                },
                checkUserAssign: function (model) {
                    var urlRequest = this.url + "/checkUserAssign";
                    return clientService.post(urlRequest, model);
                },
                deleteUserAssign: function (model) {
                    var urlRequest = this.url + "/deleteUserAssign";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url + "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                checkUserAssignScanReceive: function (model) {
                    var urlRequest = this.url + "/checkUserAssignScanReceive";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();