(function () {
    'use strict';
    app.factory("loadTruckFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.GI + "LoadToTruck",
                urlNewFW: webServiceAPI.NewFW + "loadToTruck",
                urlStoreNewFM: webServiceAPI.NewFW + "loadToTruck",
                urlScanLoad: webServiceAPI.GI + "ScanLoadToTruck",
                urlGI: webServiceAPI.NewFW + "GI/PutToStore",
                shipmentDispatch: function (model) {
                    var urlRequest = webServiceAPI.Provider + "InterfaceWMS/PostShippmentDispatch";
                    return clientService.post(urlRequest, model);
                },
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
                    var urlRequest = this.url+ "/search";
                    return clientService.post(urlRequest, model);
                },                        
                postImport: function (model,importround) {
                    var urlRequest = this.url + "/postImport";
                    return clientService.post(urlRequest,model,importround);
                },
                UpdateStatus: function (model) {
                    // var body = {
                    //     listTruckLoadViewModel: [{
                    //         documentStatus: 2,
                    //         truckLoadIndex: "ff09bca3-cfd4-4a61-b373-6a72c1342df0",
                    //         truckLoadNo: "TLD2012000001"
                    //     }]
                    // }; // 415
                    // var body = {
                    //     listTruckLoadViewModel: [{
                    //         documentStatus: 2,
                    //         truckLoadIndex: "9d9d1d0b-af19-405c-a41b-45a9db5bd869",
                    //         truckLoadNo: "TLD2012000005"
                    //     }
                    // ]}; //410
                    var urlRequest = this.url+ "/UpdateStatus";
                    return clientService.post(urlRequest, model);
                },
                filterPopup: function (model) {
                    var urlRequest = this.url + "/filterPopup" ;
                    return clientService.post(urlRequest,model);
                },
                getPlanGoodsIssuePickTickket: function (model) {
                    var urlRequest = this.url + "/getPlanGoodsIssuePickTickket/" + model;
                    return clientService.get(urlRequest);
                },
                getCartonStatus: function (body) {
                    var urlRequest =  this.urlNewFW + "/GetCartonStatus"
                    return clientService.post(urlRequest, body)
                },
                getTruckRoute: function(body) {
                    // var urlRequest = this.url + "/GetTruckRoute"
                    var urlRequest = this.urlNewFW + "/GetTruckRoute"
                    return clientService.post(urlRequest, body);
                },
                getStoreByRoute: function (body) {
                    // var urlRequest = this.url + "/GetStoreByRoute"
                    var urlRequest = this.urlNewFW + "/GetStoreByRoute"
                    return clientService.post(urlRequest, body)
                },
                getCartonStore: function (body) {
                    // var urlRequest = this.url + "/GetStoreByRoute"
                    var urlRequest = this.urlNewFW + "/GetCartonStore"
                    return clientService.post(urlRequest, body)
                },
                saveLoadHelper: function(body) {
                    var urlRequest = this.urlNewFW + "/SaveLoadHelper"
                    return clientService.post(urlRequest, body)
                },
                loadTruckLoadCarton: function(body) {
                    var urlRequest = this.urlScanLoad + "/loadTructLoadCartons"
                    return clientService.post(urlRequest, body)
                },
                getStore: function (body) {
                    var urlRequest = this.urlStoreNewFM + "/GetMasterStores"
                    return clientService.post(urlRequest, body)
                },
                getDefaultOwner: function(userId) {
                    var urlRequest = this.urlGI + "/GetDefaultOwner";
                    return clientService.post(urlRequest, { UserId: userId });
                },
            }
        });
})();