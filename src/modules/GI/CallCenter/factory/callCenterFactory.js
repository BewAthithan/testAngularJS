(function () {
    'use strict';
    app.factory("callCenterFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "CallCenter",
                urlSubstitute: webServiceAPI.Substitute + "Substitute",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                filterRealtime: function (model) {
                    var urlRequest = this.url + "/filterRealTime";
                    return clientService.post(urlRequest, model);
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
                filterPopup: function (model) {
                    var urlRequest = this.url + "/filterPopup";
                    return clientService.get(urlRequest, model);
                },   
                search: function (model) {
                    var urlRequest = this.url+ "/Search";
                    return clientService.post(urlRequest, model);
                },
                UpdateReasonCode: function (model) {  
                    var urlRequest = this.url + "/UpdateReasonCode";
                    return clientService.post(urlRequest, model);
                }, 
                Close: function (model) {  
                    var urlRequest = this.url + "/Close";
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
                getConfig: function (model) {
                    model.userID = localStorageService.get('userTokenStorage');
                    model.configIssue = "CALLCENTER";
                    model.configGroupKey = "SUBSTITUTE";
                    model.configKey = "IS_DEDUCTSTOCK";
                    var urlRequest = this.urlSubstitute + "/GetConfig";
                    return clientService.post(urlRequest, model);
                },
                getList: function (model) {
                    var urlRequest = this.urlSubstitute + "/GetList";
                    return clientService.post(urlRequest, model);
                },
                checkLocation: function (model) {
                    var urlRequest = this.urlSubstitute + "/CheckLocation";
                    return clientService.post(urlRequest, model);
                },
                checkProductLocation: function (model) {
                    var urlRequest = this.urlSubstitute + "/CheckProductLocation";
                    return clientService.post(urlRequest, model);
                },
                reserveProductLocation: function (model) {
                    var urlRequest = this.urlSubstitute + "/ReserveProductLocation";
                    return clientService.post(urlRequest, model);
                },
                clearReserveProductLocation: function (model) {
                    var urlRequest = this.urlSubstitute + "/ClearReserveProductLocation";
                    return clientService.post(urlRequest, model);
                },
                confirmSubstitute: function (model) {
                    var urlRequest = this.urlSubstitute + "/ConfirmSubstitute";
                    return clientService.post(urlRequest, model);
                },
                cancelSubstitute: function (model) {
                    var urlRequest = this.urlSubstitute + "/CancelSubstitute";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();