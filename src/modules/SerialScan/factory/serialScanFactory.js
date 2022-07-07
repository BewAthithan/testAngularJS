(function () {
    'use strict';
    app.factory("serialScanFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                 url: webServiceAPI.GI + "SerialService",
                //url: "https://5dd18dcf-f9e5-49ce-b38e-8663af36ff87.mock.pstmn.io",
                GetOrderDetails: function (model) {                
                    var urlRequest = this.url + "/GetOrderDetail";
                    return clientService.post(urlRequest, model);
                },
                InsertSerial: function (model) {                
                    var urlRequest = this.url + "/InsertSerial";
                    return clientService.post(urlRequest, model);
                },
                DeleteSerial: function (model) {                
                    var urlRequest = this.url + "/DeleteSerialAt";
                    return clientService.post(urlRequest, model);
                },
                DeleteAllSerial: function (model) {                
                    var urlRequest = this.url + "/DeleteSerialAll";
                    return clientService.post(urlRequest, model);
                }
            }

        });
})();
