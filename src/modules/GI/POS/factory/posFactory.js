(function () {
    'use strict';
    app.factory("posFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "POS",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                Close: function (model) {
                    var urlRequest = this.url + "/Close/" + model;
                    return clientService.get(urlRequest);
                },
                Confirm: function (model) {
                    var urlRequest = this.url + "/Confirm";
                    return clientService.post(urlRequest, model);
                },
                ConfirmCloseNotSuccess: function (model) {
                    var urlRequest = this.url + "/ConfirmCloseNotSuccess/" + model;
                    return clientService.get(urlRequest);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                resetUser: function (model) {
                    var urlRequest = this.url + "/resetUser/" + model;
                    return clientService.get(urlRequest);
                },  
                checkUser: function (model) {
                    var urlRequest = this.url + "/checkUser/" + model;
                    return clientService.get(urlRequest);
                }, 
            }
        });

})();