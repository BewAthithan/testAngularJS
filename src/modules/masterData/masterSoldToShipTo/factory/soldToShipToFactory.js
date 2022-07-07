(function () {
    'use strict';
    app.factory("soldToShipToFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData; 
            return {
                get: clientService.get,
                post: clientService.post,
                    url: webServiceAPI.Master + "SoldToShipTo",
                    filter: function (model) {                        
                        var urlRequest = this.url;
                        return clientService.get(urlRequest);
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
                    search: function (model) {
                        var urlRequest = this.url+ "/search";
                        return clientService.post(urlRequest, model);
                    },
                    FilterSoldtoShipTo: function (model){
                        var urlRequest = this.url+ "/FilterSoldtoShipTo";
                        return clientService.post(urlRequest, model);
                    }              
            }
        });

})();