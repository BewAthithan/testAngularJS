(function () {
    'use strict';
    app.factory("productOwnerFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ProductOwner",
                filter: function (model) {
                    var urlRequest = this.url;
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
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },  
                productPopup: function (model) {                        
                    var urlRequest = this.url + "/ProductPopup/" + model;
                    return clientService.get(urlRequest);
                },
                productPopupSearch: function (model) {
                    var urlRequest = this.url+ "/productPopupSearch";
                    return clientService.post(urlRequest, model);
                },
                getProduct: function (model) {                        
                    var urlRequest = this.url + "/getProduct";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();