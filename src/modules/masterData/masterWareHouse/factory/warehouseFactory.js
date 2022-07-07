(function () {
    'use strict';
    app.factory("warehouseFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Warehouse",
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
                popupSearch: function (model) {
                    model.userID = localStorageService.get('userTokenStorage');
                    var urlRequest = this.url+ "/popupSearch";
                    return clientService.post(urlRequest, model);
                },
                getDefaultwarehouse: function () {
                    var urlRequest = this.url+ "/popupSearch";
                    return clientService.post(urlRequest, {userID: localStorageService.get('userTokenStorage')});
                },
            }
        });

})();