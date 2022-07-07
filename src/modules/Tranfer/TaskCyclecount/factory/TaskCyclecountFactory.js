(function () {
    'use strict';
    app.factory("taskcyclecountFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "TaskCycleCount",

                userfilter: function (model) {
                    var urlRequest = this.url + "/userfilter";
                    return clientService.post(urlRequest, model);
                },
                scanSearch: function (model) {
                    var urlRequest = this.url + "/scanSearch";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {   
                    debugger
                    var urlRequest = this.url + "/find";
                    return clientService.post(urlRequest, model);
                },
                scanLoc: function (model) {
                    var urlRequest = this.url + "/ScanLoc";
                    return clientService.post(urlRequest, model);
                },
                scanLpn: function (model) {
                    var urlRequest = this.url + "/ScanLpn";
                    return clientService.post(urlRequest, model);
                },
                scanBarcode: function (model) {
                    var urlRequest = this.url + "/ScanBarcode";
                    return clientService.post(urlRequest, model);
                },
                scanCount: function (model) {
                    var urlRequest = this.url + "/ScanCount";
                    return clientService.post(urlRequest, model);
                },
                confirmLocation: function (model) {
                    var urlRequest = this.url + "/ConfirmLocation";
                    return clientService.post(urlRequest, model);
                },
                dropdownItemStatus: function (model) {
                    var urlRequest = this.url + "/dropdownItemStatus";
                    return clientService.post(urlRequest, model);
                },
                product: function (model) {
                    var urlRequest = this.url + "/product";
                    return clientService.post(urlRequest, model);
                },
                dropdownTaskGroup: function (model) {
                    var urlRequest = this.url + "/dropdownTaskGroup";
                    return clientService.post(urlRequest, model);
                },
                CheckQtyDiff: function (model) {
                    var urlRequest = this.url + "/CheckQtyDiff";
                    return clientService.post(urlRequest, model);
                },
                filterReasonCode: function (model) {
                    var urlRequest = this.url + "/filterReasonCode";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();