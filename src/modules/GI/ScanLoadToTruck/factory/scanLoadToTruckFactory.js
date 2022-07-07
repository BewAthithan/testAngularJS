(function () {
    'use strict';
    app.factory("scanLoadToTruckFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanLoadToTruck",
                ScanLoadNo: function (model) {   
                    var urlRequest = this.url + "/LoadNo";
                    return clientService.post(urlRequest, model);
                }, 
                ScanRoute: function (model) {              
                    var urlRequest = this.url + "/Route";
                    return clientService.post(urlRequest, model);
                },
                ScanRound: function (model) {              
                    var urlRequest = this.url + "/Round";
                    return clientService.post(urlRequest, model);
                }, 
                ScanDockDoor: function (model) {              
                    var urlRequest = this.url + "/DockDoor";
                    return clientService.post(urlRequest, model);
                }, 
                ScanDockDoorConfirm: function (model) {              
                    var urlRequest = this.url + "/DockDoorConfirm";
                    return clientService.post(urlRequest, model);
                }, 
                ScanCarton: function (model) {              
                    var urlRequest = this.url + "/Carton";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();