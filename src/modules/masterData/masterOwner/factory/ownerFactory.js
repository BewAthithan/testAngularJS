(function () {
    'use strict';
    app.factory("ownerFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Owner",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
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
                popupSearch: function (model) {
                    model = {userID: localStorageService.get('userTokenStorage')};
                    var urlRequest = this.url+ "/popupSearch";
                    return clientService.post(urlRequest, model);
                },
                getDefaultOwner: function () {
                    var urlRequest = this.url+ "/popupSearch";
                    return clientService.post(urlRequest, {userID: localStorageService.get('userTokenStorage')});
                },
                
            }
        });

})();