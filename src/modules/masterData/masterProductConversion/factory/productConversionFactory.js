(function () {
    'use strict';
    app.factory("productConversionFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {

            var getData1 ;

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.Master + "ProductConversion",


                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest);
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
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },
                getIndex: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.post(urlRequest);
                },
                setParam: function (model){
                    getData1 = model;
                },
                getParam: function (){
                    return getData1;
                },     
                productConversionPopupSearch: function (model) {
                    var urlRequest = this.url+ "/productConversionPopupSearch";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();