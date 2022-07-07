(function () {
    'use strict';
    app.factory("callCenterFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "CallCenter",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                filterRealtime: function (model) {
                    var urlRequest = this.url + "/filterRealTime";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.delete(urlRequest);
                },
                add: function (model) {  
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                }, 
                filterPopup: function (model) {
                    var urlRequest = this.url + "/filterPopup";
                    return clientService.get(urlRequest, model);
                },   
                search: function (model) {
                    var urlRequest = this.url+ "/Search";
                    return clientService.post(urlRequest, model);
                },
                UpdateReasonCode: function (model) {  
                    var urlRequest = this.url + "/UpdateReasonCode";
                    return clientService.post(urlRequest, model);
                }, 
                Close: function (model) {  
                    var urlRequest = this.url + "/Close";
                    return clientService.post(urlRequest, model);
                },      
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                resetUser: function (model) {
                    var urlRequest = this.url + "/resetUser/" + model;
                    return clientService.get(urlRequest);
                },        
            }
        });

})();