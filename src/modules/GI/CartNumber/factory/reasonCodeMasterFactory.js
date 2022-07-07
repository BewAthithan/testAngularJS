(function () {
    'use strict';
    app.factory("reasonCodeMasterFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ReasonCode",               
                filter: function (model) {
                    var urlRequest = this.url;
                    return clientService.get(urlRequest, model);
                },
            }
        });

})();