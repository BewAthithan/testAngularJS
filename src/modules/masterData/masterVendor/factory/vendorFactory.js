(function () {
    'use strict';
    app.factory("vendorFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Vendor",
                filter: function (model) {
                    var urlRequest = this.url + "/filter?ownerIndex=" + localStorageService.get('ownerVariableIndex');
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
                FilterVendor: function (model){
                    var urlRequest = this.url+ "/FilterVendor";
                    return clientService.post(urlRequest, model);
                },
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/popupSearch";
                    return clientService.post(urlRequest, model);
                },                
            }
        });

})();