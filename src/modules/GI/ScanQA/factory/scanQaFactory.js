(function () {
    'use strict';
    app.factory("scanQaFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanQa",
                ScanPickTicket: function (model) {
                    var urlRequest = this.url + "/PickTicket";
                    return clientService.post(urlRequest, model);
                }, 
                confirmData: function (model) {              
                    var urlRequest = this.url + "/ConfirmData";
                    return clientService.post(urlRequest, model);
                },
                // ScanSoNo: function (model) {              
                //     var urlRequest = this.url + "/SONo";
                //     return clientService.post(urlRequest, model);
                // }, 
                // ScanPickBy: function (model) {              
                //     var urlRequest = this.url + "/PickBy";
                //     return clientService.post(urlRequest, model);
                // }, 
            }
        });

})();