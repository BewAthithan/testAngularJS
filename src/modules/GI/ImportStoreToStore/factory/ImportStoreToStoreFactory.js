(function () {
    'use strict';
    app.factory("importStoreToStoreFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "planGoodsIssue",
                urlNewOutbound: webServiceAPI.NewOutbound,
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
                    return clientService.post(urlRequest,model);
                },
                add: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                }, 
                filterPopup: function (model) {                    
                    var urlRequest = this.url + "/FilterPopup";
                    return clientService.post(urlRequest,model);
                },   
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },      
                planGIsearch: function (model) {
                    model.userId = localStorageService.get('userTokenStorage');
                    var urlRequest = this.url+ "/planGIsearch";
                    return clientService.post(urlRequest, model);
                },   
                UpdateStatus: function (model) {
                    var urlRequest = this.url+ "/UpdateStatus";
                    return clientService.post(urlRequest, model);
                },      
                copySo: function (model) {
                    var urlRequest = this.url+ "/CopySo";
                    return clientService.post(urlRequest, model);
                },
                updateReason: function (model) {
                    var urlRequest = this.url+ "/updateReason";
                    return clientService.post(urlRequest, model);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                resetUser: function (model) {
                    var urlRequest = this.url + "/resetUser/" + model;
                    return clientService.get(urlRequest);
                },
                pickupExcel: function (model) {
                    var urlRequest = this.urlNewOutbound + "/replenishment/importTempSalesOrder";
                    return clientService.post(urlRequest, model);
                },
                importExcel: function (model) {
                    var urlRequest = this.urlNewOutbound + "/replenishment/processImportSalesOrder";
                    return clientService.post(urlRequest, model);
                },
                
            }
        });

})();