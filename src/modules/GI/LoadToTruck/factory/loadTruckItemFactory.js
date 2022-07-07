(function () {
    'use strict';
    app.factory("loadTruckItemFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "LoadToTruckItem",
                getByTruckLoadId: function (id) {
                    var urlRequest = this.url + "/GetByTruckLoadId/" +id;
                    return clientService.get(urlRequest);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getTruckLoadCarton: function (model) {            
                    var urlRequest = this.url + "/GetTruckLoadCarton";
                    return clientService.post(urlRequest,model);
                },
                getTruckLoadCartonbyId: function (id) {            
                    var urlRequest = this.url + "/GetTruckLoadCartonById/" +id;
                    return clientService.get(urlRequest);
                },
                deleteCarton: function(model) {
                    var urlRequest = this.url + "/DeleteCarton/";
                    return clientService.post(urlRequest, model);
                }, 
            }
        });

})();