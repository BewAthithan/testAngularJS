(function () {
    'use strict';
    app.factory("scanTaskDropFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            return { 
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanTaskDrop",
                postPickConfirm: function (model) {
                    var urlRequest = webServiceAPI.Provider + "InterfaceWMS/PostPickConfirm";
                    return clientService.post(urlRequest, model);
                },
                receivePutToStaging: function (model) {
                    var urlRequest = this.url + "/ReceivePutToStaging";
                    return clientService.post(urlRequest, model);
                },
                checkCarton: function (model) {
                    var urlRequest = this.url + "/CheckCarton";
                    return clientService.post(urlRequest, model);
                },
                updateData: function (model) {
                    var urlRequest = this.url + "/UpdateData";
                    return clientService.post(urlRequest, model);
                },
                PrintCartonRF: function (model) {
                    var urlRequest = this.url + "/PrintCartonRF";
                    return clientService.post(urlRequest, model);
                },
                SaveToCallCenter: function (model) {
                    var urlRequest = this.url + "/SaveToCallCenter";
                    return clientService.post(urlRequest, model);
                },     
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