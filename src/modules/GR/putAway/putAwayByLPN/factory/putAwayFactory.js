(function () {
    'use strict';
    app.factory("putAwayFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getdata ;
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "GoodsReceive",
                urlNewGR: webServiceAPI.NewFWGR + "GR/GoodsReceive",
                url_NewGR : webServiceAPI.NewFWGR + "GR",
                CheckTAGPutAwayByLPN: function (model) {
                    var urlRequest = this.url + "/CheckTAGPutAwayByLPN";
                    return clientService.post(urlRequest, model);
                },
                CheckTAGPutAwayBySku: function (model) {
                    model.ownerIndex = localStorageService.get('ownerVariableIndex');
                    var urlRequest = this.urlNewGR + "/CheckTAGPutAwayBySku";
                    return clientService.post(urlRequest, model);
                },
                Save: function (model) {
                    var urlRequest = this.urlNewGR + "/SaveTAGPutAwayByLPN";
                    return clientService.post(urlRequest, model);
                },
                SaveSku: function (model) {   
                    var urlRequest = this.urlNewGR + "/SaveTAGPutAwayBySku";
                    // var urlRequest = this.url + "/SaveTAGPutAwayBySku";
                    return clientService.post(urlRequest, model);
                },
                DeleteTagItem: function (model) {                    
                    var urlRequest = this.url + "/DeleteTagItem";
                    return clientService.post(urlRequest,model);
                },
                CheckPalletLocationLPN: function (model) {
                    var urlRequest = this.url + "/CheckPalletLocationLPN";
                    return clientService.post(urlRequest, model);
                },
                ReSuggest: function (model) {
                    var urlRequest = this.url_NewGR + "/Location/ReSuggest";
                    return clientService.post(urlRequest, model);
                }, 
                RetrieveLocationByProduct : function (model) {
                    var urlRequest = this.url_NewGR + "/Putaway/RetrieveLocationByProduct";
                    return clientService.post(urlRequest, model);
                },         
                            
            }
        });

})();