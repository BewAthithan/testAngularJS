(function () {
    'use strict';
    app.factory("zonePutAwayLocationFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.NewMaster + "ZonePutAwayLocation",
                filter: function (model) {
                    var urlRequest = this.url + "/Filter";
                    return clientService.get(urlRequest);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/Delete" ;
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url + "/Save";
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {
                    var urlRequest = this.url + "/Save";
                    return clientService.post(urlRequest, model);
                },
                search: function (model) {
                    var urlRequest = this.url+ "/Search";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();