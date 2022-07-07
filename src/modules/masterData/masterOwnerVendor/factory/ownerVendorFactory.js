(function () {
    'use strict';
    app.factory("ownerVendorFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ownerVendor",
                filter: function (model) {
                    var urlRequest = this.url + "?OwnerIndex=" + localStorageService.get('ownerVariableIndex');
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
                vendorPopup: function (model) {                        
                    var urlRequest = this.url + "/VendorPopup/" + model;
                    return clientService.get(urlRequest, model);
                },                  
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                vendorPopupSearch: function (model) {
                    var urlRequest = this.url+ "/vendorPopupSearch";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();