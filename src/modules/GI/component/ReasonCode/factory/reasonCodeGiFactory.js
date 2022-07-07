(function () {
    'use strict';
    app.factory("reasonCodeGiFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ReasonCode",
                urlNew: webServiceAPI.NewMaster + "ReasonCode",
                filterCallcenter: function (model) {
                    var urlRequest = this.url + "/filterCallcenter";
                    return clientService.get(urlRequest, model);
                },
                filterMarshall: function (model) {
                    var urlRequest = this.url + "/filterMarshall";
                    return clientService.get(urlRequest, model);
                },
                filterCallcenterCancel: function (model) {
                    var urlRequest = this.urlNew + "/ReasonCodeCancel";
                    return clientService.get(urlRequest, model);
                }                
            }
        });

})();