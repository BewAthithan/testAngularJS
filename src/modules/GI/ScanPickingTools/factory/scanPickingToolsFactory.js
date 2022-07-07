(function () {
    'use strict';
    app.factory("scanPickingToolsFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ScanPickingTools",
                ScanTaskID: function (model) {   
                    var urlRequest = this.url + "/TaskID";
                    return clientService.post(urlRequest, model);
                }, 
                ScanProduct: function (model) {              
                    var urlRequest = this.url + "/Product";
                    return clientService.post(urlRequest, model);
                },
                
                
            }
        });

})();