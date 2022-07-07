(function () {
    'use strict';
    app.factory("locationFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "Location",
                new_url: webServiceAPI.NewMaster + "Location",
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
                CheckLocation: function (model) {
                    var urlRequest = this.url + "/CheckLocation";
                    return clientService.post(urlRequest, model);
                },
                CheckPutAwayLocation: function (model) {
                    var urlRequest = this.url + "/CheckPutAwayLocation";
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
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                LocationSearch: function (model) {
                    var urlRequest = this.url+ "/LocationSearch";
                    return clientService.post(urlRequest, model);
                },
                PopupSearch: function (model) {
                    var urlRequest = this.new_url+ "/PopupSearch";
                    return clientService.post(urlRequest, model);
                },
                FilterSearch: function (model) {
                    var urlRequest = this.new_url+ "/filter";
                    return clientService.post(urlRequest, model);
                },

            }
        });

})();