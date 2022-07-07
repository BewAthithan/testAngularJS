(function () {
    'use strict';
    app.factory("cartNumberFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "CartNumber",
                searchTask: function (model) {
                    var urlRequest = this.url + "/SearchTask/" + model;
                    return clientService.post(urlRequest, model);
                },
                Confirm: function (model) {
                    var urlRequest = this.url + "/Confirm" ;
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url;
                    return clientService.get(urlRequest, model);
                },
                upDateQtyScan: function (model) {
                    var urlRequest = this.url + "/UpdateQtyScan";
                    return clientService.post(urlRequest, model);
                },
                upDateUserAssign: function (model) {
                    var urlRequest = this.url + "/UpdateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                checkUserAssign: function (model) {
                    var urlRequest = this.url + "/CheckUserAssign";
                    return clientService.post(urlRequest, model);
                },
                updateStatusTaskItem: function (model) {
                    var urlRequest = this.url + "/ConfirmStatus" ;
                    return clientService.post(urlRequest, model);
                },
                setParam: function (model){
                    getData1 = model;
                },
                getParam: function (){
                    return getData1;
                },
                checkResultCart: function (model) {
                    var urlRequest = this.url + "/CheckResultCart" ;
                    return clientService.post(urlRequest, model);
                },
                checkPickingQty: function (model) {
                    var urlRequest = this.url + "/CheckPickingQty" ;
                    return clientService.post(urlRequest, model);
                },
                checkStatusConfirmCarton: function (model) {
                    var urlRequest = this.url + "/CheckStatusConfirmCarton" ;
                    return clientService.post(urlRequest, model);
                },
                checkCartDataAssign: function (model) {
                    var urlRequest = this.url + "/CheckCartDataAssign/" + model ;
                    return clientService.post(urlRequest, model);
                },
                checkCartDataAssignV2: function (model) {
                    var urlRequest = this.url + "/CheckCartDataAssignV2";
                    return clientService.post(urlRequest, model);
                },
                cartDataPickingV2: function (model) {
                    var urlRequest = this.url + "/CartDataPickingV2";
                    return clientService.post(urlRequest, model);
                },
                cartDataScanPickingV2: function (model) {
                    var urlRequest = this.url + "/CartDataScanPickingV2";
                    return clientService.post(urlRequest, model);
                },
                CartDataScanConfirmV2: function (model) {
                    var urlRequest = this.url + "/CartDataScanConfirmV2";
                    return clientService.post(urlRequest, model);
                },
                cartPutToStagingV2: function (model) {
                    var urlRequest = this.url + "/CartPutToStagingV2";
                    return clientService.post(urlRequest, model);
                },
                cartConfirmDropV2: function (model) {
                    var urlRequest = this.url + "/CartConfirmDropV2";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();