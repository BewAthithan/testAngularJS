(function () {
    'use strict';
    app.factory("goodsReceiveFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "goodsReceive",
                urlNewFWGR: webServiceAPI.NewFWGR + "GR",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                getDelete: function (model) {
                    var urlRequest = this.url + "/getDelete";
                    return clientService.post(urlRequest, model);
                },
                add: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                grSearch: function (model) {
                    model.userId = localStorageService.get('userTokenStorage');
                    console.log(model);
                    var urlRequest = this.url + "/grSearch";
                    return clientService.post(urlRequest, model);
                },
                GoodsReceiveConfirm: function (model) {
                    var urlRequest = this.url + "/GoodsReceiveConfirm";
                    return clientService.post(urlRequest, model);
                },
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/Confirm";
                    return clientService.post(urlRequest, model);
                },
                AutoScanReceive: function (model) {
                    var urlRequest = this.url + "/AutoScanReceive";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url + "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                checkUserAssign: function (model) {
                    var urlRequest = this.url + "/checkUserAssign";
                    return clientService.post(urlRequest, model);
                },
                deleteUserAssign: function (model) {
                    var urlRequest = this.url + "/deleteUserAssign";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssignKey: function (model) {
                    var urlRequest = this.url + "/updateUserAssignKey";
                    return clientService.post(urlRequest, model);
                },
                allocateCrossDock: function(model){
                    var urlRequest = this.urlNewFWGR + "/Allocation/AllocateCrossDock";
                    return clientService.post(urlRequest, model);
                }            
            }
        });

})();