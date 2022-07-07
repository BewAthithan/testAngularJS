(function () {
    'use strict';
    app.factory("cartAssignFactory",
        function ($q, $http, ngAuthSettings, localStorageService,  webServiceAPI, clientService) {
            var getData1 ;
            var getTime ;
            return { 
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "CartAssign",
                pickTicket: function (model) {
                    var urlRequest = this.url + "/PickTicket";
                    return clientService.post(urlRequest, model);
                }, 
                CheckCartNumberList: function (model) {                        
                    var urlRequest = this.url + "/CheckCartNumberList/" + model;
                    return clientService.post(urlRequest, model);
                }, 
                clearData: function (model) {                        
                    var urlRequest = this.url + "/clearData";
                    return clientService.post(urlRequest, model);
                }, 
                CheckStatusUpdate: function (model) {                        
                    var urlRequest = this.url + "/CheckStatusUpdate";
                    return clientService.post(urlRequest, model);
                },
                setParam: function (model){
                    getData1 = model;
                },
                getParam: function (){
                    return getData1;
                },
                setTime: function (model){
                    getTime = model;
                },
                getTime: function (){
                    return getTime;
                }, 
                checkCarton: function (model) {   
                    var urlRequest = this.url + "/CheckCarton";
                    return clientService.post(urlRequest, model);
                }, 
                checkPickingCartAssigned: function (model) {   
                    var urlRequest = this.url + "/CheckPickingCartAssigned";
                    return clientService.post(urlRequest, model);
                }, 
                checkPickingCartAssignedV2: function (model) {   
                    var urlRequest = this.url + "/CheckPickingCartAssignedV2";
                    return clientService.post(urlRequest, model);
                }, 
                checkAssignPicking: function (model) {   
                    var urlRequest = this.url + "/CheckAssignPicking";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();