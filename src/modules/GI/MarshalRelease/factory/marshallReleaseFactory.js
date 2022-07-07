(function () {
    'use strict';
    app.factory("marshallReleaseFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "Marshall",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
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
                marshallSearch: function (model) {
                    var urlRequest = this.url+ "/marshallSearch";
                    return clientService.post(urlRequest, model);
                },
                GetMarshall: function(model) {
                    var urlRequest = this.url + "/GetMarshall/";
                    return clientService.post(urlRequest, model);
                },      
                checkMarchal: function (model) {
                    var urlRequest = this.url + "/CheckMarshal";
                    return clientService.post(urlRequest, model);
                },    
                GetMarshallAuto: function (model) {    
                    // var urlRequest = this.url + "/GetMarshallAuto/";
                    var urlRequest = this.url + "/GetMarshallAuto/" + model;
                    return clientService.get(urlRequest);
                },     
            }
        });

})();