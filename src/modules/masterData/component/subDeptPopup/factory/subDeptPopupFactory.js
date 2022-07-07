(function () {
    'use strict';
    app.factory("subDeptPopupFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.NewMaster + "ProductSubType",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
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
                    var urlRequest = this.url + "/SaveZonePutAway";
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {
                    var urlRequest = this.url + "/SaveZonePutAway";
                    return clientService.post(urlRequest, model);
                },
                search: function (model) {
                    var urlRequest = this.url+ "/searchZonePutAway";
                    return clientService.post(urlRequest, model);
                },
                popupSearch: function (model) {
                    var urlRequest = this.url+ "/PopupSearch";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();