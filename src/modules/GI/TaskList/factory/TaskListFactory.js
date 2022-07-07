(function () {
    'use strict';
    app.factory("taskListFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {
            var getData1;
            var getTime;
            return { 
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "TaskList",
                urlNewGI: webServiceAPI.NewGI,
                postPickConfirm: function (model) {
                    var urlRequest = webServiceAPI.Provider + "InterfaceWMS/PostPickConfirm";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                receivePutToStaging: function (model) {
                    var urlRequest = this.url + "/ReceivePutToStaging";
                    return clientService.post(urlRequest, model);
                },
                checkCarton: function (model) {
                    var urlRequest = this.url + "/CheckCarton";
                    return clientService.post(urlRequest, model);
                },
                confirmPrintCarton: function (model) {
                    var urlRequest = this.urlNewGI + "GI/ConfirmPrintCarton/ConfirmPrintCarton";
                    return clientService.post(urlRequest, model);
                },
                genTagOut: function (model) {
                    var urlRequest = this.url + "/GenTagOut";
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
                filterPickTicket: function (model) {
                    var urlRequest = this.url + "/filterPickTicket";
                    return clientService.post(urlRequest, model);
                },
                CheckTaskNo: function (model) {
                    var urlRequest = this.url + "/CheckTaskNo";
                    return clientService.post(urlRequest, model);
                },
                SaveToCallCenter: function (model) {
                    var urlRequest = this.url + "/SaveToCallCenter";
                    return clientService.post(urlRequest, model);
                },                
                setParam: function (model){
                    getData1 = model;
                },
                getParam: function (){
                    return getData1;
                },
                setTime: function (model){
                    getTime = model;
                },
                getTime: function (){
                    return getTime;
                }
            }
        });

})();