(function () {
    'use strict';
    app.factory("closePackStationFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.NewPacking,
                closePackStation: function (model) {
                    var urlRequest = this.url + "pack/PackingOrder/Cancel";
                    return clientService.post(urlRequest, model);
                },
                checkPackStation: function (model) {
                    var urlRequest = this.url + "pack/PackingOrder/validateID";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();