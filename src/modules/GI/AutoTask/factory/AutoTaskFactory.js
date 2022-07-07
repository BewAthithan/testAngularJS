(function () {
    'use strict';
    app.factory("autoTaskFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "AutoTask",
                dropdownUser: function (model) {
                    var urlRequest = this.url + "/dropdownUser";
                    return clientService.post(urlRequest, model);
                },
                dropdownDocumentType: function (model) {
                    var urlRequest = this.url + "/dropdownDocumentType";
                    return clientService.post(urlRequest, model);
                },
                dropdownRoute: function (model) {
                    var urlRequest = this.url + "/dropdownRoute";
                    return clientService.post(urlRequest, model);
                },
                dropdownRound: function (model) {
                    var urlRequest = this.url + "/dropdownRound";
                    return clientService.post(urlRequest, model);
                },
                dropdownZone: function (model) {
                    var urlRequest = this.url + "/dropdownZone";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                confirm: function (model) {
                    var urlRequest = this.url + "/confirm";
                    return clientService.post(urlRequest, model);
                },
                cancel: function (model) {
                    var urlRequest = this.url + "/cancel";
                    return clientService.post(urlRequest, model);
                },
            }
        });
})();