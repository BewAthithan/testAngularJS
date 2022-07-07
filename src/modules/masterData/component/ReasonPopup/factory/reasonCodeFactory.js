(function () {
    'use strict';
    app.factory("reasonCodeFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "ReasonCode",
                urlGr: webServiceAPI.GR + "GoodsReceive",
                filter: function (model) {
                    var urlRequest = this.url + "/filterPlangoodsIssue";
                    return clientService.get(urlRequest, model);
                },
                GrReasonCode: function (model) {
                    var urlRequest = this.urlGr + "/ReasonCode";
                    return clientService.get(urlRequest, model);
                }
                
            }
        });

})();