(function() {
    'use strict';
    app.factory("packingFactory",
        function($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.NewPacking,
                urlInterface: webServiceAPI.NewInterface,
                urlReport : webServiceAPI.NewReport,
                urlMaster : webServiceAPI.NewMaster + "MasterData/",
                getCartonList: function(OwnerId, OrderNo) {
                    var urlRequest = this.url + "Pack/PackingOrder/CartonList/" + OwnerId + "/" + OrderNo;
                    return clientService.get(urlRequest);
                },
                getCancelOrder: function(OwnerId, OrderNo) {
                    var urlRequest = this.url + "Pack/PackingOrder/CancelOrder/" + OwnerId + "/" + OrderNo;
                    return clientService.get(urlRequest);
                },
                getPackStation: function(packStationId) {
                    var urlRequest = this.url + "Pack/PackingOrder/PackStation/" + packStationId;
                    return clientService.get(urlRequest);
                },
                createNewCarton: function(model) {
                    var urlRequest = this.url + "Pack/PackingOrder/CreateNewCarton";
                    return clientService.post(urlRequest, model);
                },
                deleteCarton: function(model) {
                    var urlRequest = this.url + "Pack/PackingOrder/DeleteCarton";
                    return clientService.post(urlRequest, model);
                },
                confirmPackOrder: function(model) {
                    var urlRequest = this.url + "Pack/PackingOrder/ConfirmPackOrder";
                    return clientService.post(urlRequest, model);
                },
                generateLPNPackStation: function(model) {
                    var urlRequest = this.url + "Pack/PackingOrder/GenerateLPNPackStation";
                    return clientService.post(urlRequest, model);
                },
                printConfirmPackOrder: function(model) {
                    var urlRequest = this.urlReport + "report/printPackCartonLabels";
                    return clientService.post(urlRequest, model);
                },
                closePackStation: function (model) {
                    var urlRequest = this.url + "pack/PackingOrder/Cancel";
                    return clientService.post(urlRequest, model);
                },
                getDefaultPackingOption: function () {
                    var urlRequest = this.url + "Pack/PackingOrder/GetDefaultPackingOption";
                    return clientService.get(urlRequest);
                },
                getBoxMaster: function () {
                    var urlRequest = this.url + "Pack/PackingOrder/GetBoxMaster";
                    return clientService.get(urlRequest);
                },
                savePackingItem: function (model) {
                    var urlRequest = this.url + "Pack/PackingOrder/SavePackingItem";
                    return clientService.post(urlRequest, model);
                },
                savePackingItem: function (model) {
                    var urlRequest = this.url + "Pack/PackingOrder/SavePackingItem";
                    return clientService.post(urlRequest, model);
                },
                getPackingItem: function (ownerId, planGoodsIssueNo, tagOutNo) {
                    var urlRequest = this.url + "Pack/PackingOrder/GetPackingItem/" + ownerId + "/" +
                    planGoodsIssueNo + "/" + tagOutNo;
                    return clientService.get(urlRequest);
                },
                validateBoxQty: function (model) {
                    var urlRequest = this.url + "Pack/PackingOrder/ValidateBoxQty";
                    return clientService.post(urlRequest, model);
                },
                packconfirmByOrder: function (model) {
                    var urlRequest = this.urlInterface + "Order/PackconfirmByOrder";
                    return clientService.post(urlRequest, model);
                },
                getAddress: function (id) {
                    var urlRequest = this.urlMaster + "Address/GetAddressList/" + id;
                    return clientService.get(urlRequest);
                },
                updateAddress: function (model) {
                    var urlRequest = this.url + "Pack/PackingOrder/UpdatePackingAddress";
                    return clientService.post(urlRequest, model);
                },
            }
        });

})();