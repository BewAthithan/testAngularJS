(function () {
    'use strict';
    app.factory("runWaveFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) { 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "RunWave",
                urlRunwaveNew: webServiceAPI.NewRunwave + "RunWave",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.delete(urlRequest);
                },
                add: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },  
                search: function (model) {
                    var urlRequest = this.url+ "/Search";
                    return clientService.post(urlRequest, model);
                }, 
                RunWave: function (model) {                    
                    var urlRequest = this.urlRunwaveNew + "/RunWaveV2";
                    return clientService.post(urlRequest,model);
                },
                runWavesearch: function (model) {
                    var urlRequest = this.url+ "/runWaveSearch";
                    return clientService.post(urlRequest, model);
                },
                runWavePickManual: function (model) {
                    var urlRequest = this.url+ "/RunWavePickManual";
                    return clientService.post(urlRequest, model);
                }  ,
                test: function (model) {
                    var urlRequest = this.url+ "/test";
                    return clientService.post(urlRequest, model);
                }
            }
        });

})();