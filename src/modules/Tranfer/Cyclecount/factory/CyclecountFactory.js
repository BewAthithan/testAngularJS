(function () {
    'use strict';
    app.factory("cyclecountFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Transfer + "Cyclecount",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                find: function (model) {   
                    var urlRequest = this.url + "/find/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {                    
                    var urlRequest = this.url + "/delete";
                    return clientService.post(urlRequest,model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.url + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownStatus: function (model) {
                    var urlRequest = this.url + "/DropdownProcess";
                    return clientService.post(urlRequest, model);
                },
                BinSearch: function (model) {
                    var urlRequest = this.url + "/BinSearch";
                    return clientService.post(urlRequest, model);
                },
                SaveCycleCount: function (model) {   
                    var urlRequest = this.url + "/SaveCycleCount";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();