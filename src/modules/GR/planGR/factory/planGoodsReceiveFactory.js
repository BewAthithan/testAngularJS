(function () {
    'use strict';
    app.factory("planGoodsReceiveFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GR + "PlanGoodsReceive",
                urlNewFWProvider: webServiceAPI.NewFWProvider + "PO",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.get(urlRequest, model);
                },
                filterPopup: function (model) {    
                    var urlRequest = this.url + "/filterPopup";
                    return clientService.post(urlRequest,model);                    
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
                confirmStatus: function (model) {
                    var urlRequest = this.url + "/confirmStatus";
                    return clientService.post(urlRequest,model);
                },
                search: function (model) {
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },               
                planGrsearch: function (model) {
                    model.userId = localStorageService.get('userTokenStorage');
                    var urlRequest = this.url+ "/planGRSearch";
                    return clientService.post(urlRequest, model);
                },
                closeDocument: function (model) {
                    model.userId = localStorageService.get('userTokenStorage');
                    var urlRequest = this.url + "/CloseDocument";
                    return clientService.post(urlRequest,model);
                },    
                FilterPlanGR: function (model){
                    var urlRequest = this.url+ "/FilterPlanGR";
                    return clientService.post(urlRequest, model);
                },  
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },        
                deleteUserAssign: function (model) {
                    var urlRequest = this.url + "/deleteUserAssign";
                    return clientService.post(urlRequest, model);
                },
                CheckDocumentStatus: function (model) {
                    var urlRequest = this.url + "/CheckDocumentStatus";
                    return clientService.post(urlRequest, model);
                },  
                PlanGoodsIssuePopup: function (model) {
                    var urlRequest = this.url + "/PlanGoodsIssuePopup";
                    return clientService.post(urlRequest, model);
                },
               closePO: function (model) {
                   var urlRequest = this.urlNewFWProvider + "/manualClosePO";
                   return clientService.post(urlRequest, model);
               }
            }
        });
})();