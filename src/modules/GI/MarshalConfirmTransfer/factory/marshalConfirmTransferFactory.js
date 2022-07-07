(function () {
    'use strict';
    app.factory("marshalConfirmTransferFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ConfirmMarshall",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url+ "/getDelete";
                    return clientService.post(urlRequest, model);
                }, 
                add: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },                  
                confirmMarshallSearch: function (model) {
                    var urlRequest = this.url+ "/confirmMarshallSearch";
                    return clientService.post(urlRequest, model);
                },    
                ConfirmMarshall: function(model) {
                    var urlRequest = this.url + "/ConfirmMarshall/";
                    return clientService.post(urlRequest, model);
                },    
                filterPopup: function (model) {                    
                    var urlRequest = this.url + "/filterPopup/" + model;
                    return clientService.get(urlRequest,);
                },       
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/popupSearch";
                    return clientService.post(urlRequest, model);
                }, 
            }
        });

})();