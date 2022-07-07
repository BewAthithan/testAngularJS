(function() {
    'use strict';
    app.factory("cartonFactory",
        function($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

        return {
            get: clientService.get,
            post: clientService.post,
            urlGI: webServiceAPI.NewFW + "GI/PutToStore",
            usrlTruckLoad: webServiceAPI.NewFW + "loadToTruck",
            getDefaultOwner: function(userId) {
                var urlRequest = this.urlGI + "/GetDefaultOwner";
                return clientService.post(urlRequest, { UserId: userId });
            },
            getCartonStatus: function (body) {
                var urlRequest = this.usrlTruckLoad + "/GetCartonStatus"
                return clientService.post(urlRequest, body)
            },
            getTruckRoute: function(body) {
                var urlRequest = this.usrlTruckLoad + "/GetTruckRoute"
                return clientService.post(urlRequest, body);
            },
            getStoreByRoute: function (body) {
                var urlRequest = this.usrlTruckLoad + "/GetStoreByRoute"
                return clientService.post(urlRequest, body)
            },
            getCartonStore: function(body){
                var urlRequest = this.usrlTruckLoad + "/GetCartonStore"
                return clientService.post(urlRequest, body)
            },
            updateCartonStatus: function(body){
                var urlRequest = this.usrlTruckLoad + "/UpdateCartonStatus"
                return clientService.post(urlRequest, body)
            }
        }
    });
})();