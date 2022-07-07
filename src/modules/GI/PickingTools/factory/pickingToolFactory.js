(function () {
    'use strict';
    app.factory("pickingToolFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "PickingTool",
                url_new: webServiceAPI.NewGI + "GI/PickingTool",
                postPickConfirm: function (model) {
                    var urlRequest = webServiceAPI.Provider + "InterfaceWMS/PostPickConfirm";
                    return clientService.post(urlRequest, model);
                },
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
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
                confirm: function (model) {                        
                    var urlRequest = this.url + "/ConfirmMarshall";
                    return clientService.post(urlRequest, model);
                },
                edit: function (model) {                        
                    var urlRequest = this.url;
                    return clientService.post(urlRequest, model);
                },  
                CloneMarshall: function(model) {
                    var urlRequest = this.url + "/CloneMarshall/";
                    return clientService.post(urlRequest, model);
                },  
                ProductBarcode: function (model) {
                    var urlRequest = this.url + "/ProductBarcode";
                    return clientService.post(urlRequest, model);
                },    
                checkQty: function (model) {
                    
                    var urlRequest = this.url + "/CheckQty";
                    return clientService.post(urlRequest, model);
                },    
                Replace: function (model) {                        
                    var urlRequest = this.url + "/Replace";
                    return clientService.post(urlRequest, model);
                },
                SaveConfirmMarshal: function (model) {                        
                    var urlRequest = this.url + "/SaveConfirmMarshal";
                    return clientService.post(urlRequest, model);
                },
                ConfirmMarshallEnd: function (model) {                        
                    var urlRequest = this.url + "/ConfirmMarshallEnd";
                    return clientService.post(urlRequest, model);
                },   
                Shortpick: function (model) {
                    var urlRequest = this.url + "/shortpick";
                    return clientService.post(urlRequest, model);
                },  
                ScanQTY: function (model) {                        
                    var urlRequest = this.url + "/ScanQTY";
                    return clientService.post(urlRequest, model);
                },   
                resetUser: function (model) {
                    var urlRequest = this.url + "/resetUser/" + model;
                    return clientService.get(urlRequest);
                },   
                getIdconfirm: function (model) {
                    var urlRequest = this.url + "/getIdconfirm/" + model;
                    return clientService.get(urlRequest);
                },     
                getCheckReplace: function (model) {
                    var urlRequest = this.url + "/getCheckReplace/" + model;
                    return clientService.get(urlRequest);
                },  
                getIdCount: function (model) {                        
                    var urlRequest = this.url + "/getIdCount";
                    return clientService.post(urlRequest, model);
                },      
                getBinbalanceByProduct: function (model) {
                    var urlRequest = this.url_new + "/getBinbalanceByProduct";
                    return clientService.post(urlRequest, model);
                },         
            }
        });

})();