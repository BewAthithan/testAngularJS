(function () {
    'use strict';
    app.factory("scanTaskConfrimCartonFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanTaskConfrimCarton",
                PrintCartonRF: function (model) {
                    var urlRequest = this.url + "/PrintCartonRF";
                    return clientService.post(urlRequest, model);
                },        
                filterPickTicket: function (model) {
                    var urlRequest = this.url + "/filterPickTicket";
                    return clientService.post(urlRequest, model);
                }, 
                confirmPrintCarton: function (model) {
                    var urlRequest = this.url + "/ConfirmPrintCarton";
                    return clientService.post(urlRequest, model);
                },
                rePrint: function (model) {
                    var urlRequest = this.url + "/RePrint";
                    return clientService.post(urlRequest, model);
                },
                setParam: function (model){
                    getData1 = model;
                },
                getParam: function (){
                    return getData1;
                },
            }
        });

})();