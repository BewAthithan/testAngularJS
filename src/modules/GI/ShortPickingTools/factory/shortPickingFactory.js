(function () {
    'use strict';
    app.factory("shortPickingFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
 
            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "PickShort",
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
                getTaskPickShort: function (model) {
                    var urlRequest = this.url + "/getTaskPick/" + model;
                    return clientService.get(urlRequest);
                },  
                checkUser: function (model) {
                    var urlRequest = this.url + "/checkUser/" + model;
                    return clientService.get(urlRequest);
                },     
                getIdconfirm: function (model) {
                    var urlRequest = this.url + "/getIdconfirm/" + model;
                    return clientService.get(urlRequest);
                },      
                getIdCount: function (model) {                        
                    var urlRequest = this.url + "/getIdCount";
                    return clientService.post(urlRequest, model);
                },   
            }
        });

})();