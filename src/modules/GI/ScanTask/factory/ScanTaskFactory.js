(function () {
    'use strict';
    app.factory("scanTaskFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanTask",
                setParam: function (model) {
                    getData1 = model;
                },
                getParam: function () {
                    return getData1;
                },
                checkCartDataAssign: function (model) {
                    var urlRequest = this.url + "/CheckCartDataAssign";
                    return clientService.post(urlRequest, model);
                },
                cartDataPicking: function (model) {
                    var urlRequest = this.url + "/CartDataPicking";
                    return clientService.post(urlRequest, model);
                },
                cartDataScanPicking: function (model) {
                    var urlRequest = this.url + "/CartDataScanPicking";
                    return clientService.post(urlRequest, model);
                },
                CartDataScanConfirm: function (model) {
                    var urlRequest = this.url + "/CartDataScanConfirm";
                    return clientService.post(urlRequest, model);
                },
                cartPutToStaging: function (model) {
                    var urlRequest = this.url + "/CartPutToStaging";
                    return clientService.post(urlRequest, model);
                },
                cartConfirmDrop: function (model) {
                    var urlRequest = this.url + "/CartConfirmDrop";
                    return clientService.post(urlRequest, model);
                },
                checkUserAssign: function (model) {
                    var urlRequest = this.url + "/CheckUserAssign";
                    return clientService.post(urlRequest, model);
                },
                checkFormateTagout: function (model,taslid,equipmentIndex) {
                    var urlRequest = this.url + "/checkFormateTagout/" + model+"/"+taslid+"/"+equipmentIndex;
                    return clientService.get(urlRequest);
                },
                createCarton: function (model) {
                    var urlRequest = this.url + "/createCarton";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();