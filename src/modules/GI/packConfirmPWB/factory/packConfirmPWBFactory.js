(function () {
    'use strict';
    app.factory("packConfirmPWBFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.AutoPOS + "POS",
                urlAutoPOS: webServiceAPI.AutoPOS + "AutoPOS",
                urlProvider: webServiceAPI.Provider + "InterfaceWMS",
                filter: function (model) {
                    var urlRequest = this.url + "/filter";
                    return clientService.post(urlRequest, model);
                },
                getId: function (model) {
                    var urlRequest = this.url + "/" + model;
                    return clientService.get(urlRequest);
                },
                Close: function (model) {
                    var urlRequest = this.url + "/Close/" + model;
                    return clientService.get(urlRequest);
                },
                Confirm: function (model) {
                    var urlRequest = this.url + "/Confirm";
                    return clientService.post(urlRequest, model);
                },
                ConfirmCloseNotSuccess: function (model) {
                    var urlRequest = this.url + "/ConfirmCloseNotSuccess/" + model;
                    return clientService.get(urlRequest);
                },
                updateUserAssign: function (model) {
                    var urlRequest = this.url+ "/updateUserAssign";
                    return clientService.post(urlRequest, model);
                },
                resetUser: function (model) {
                    var urlRequest = this.url + "/resetUser/" + model;
                    return clientService.get(urlRequest);
                },  

                postInvoice: function (model) {
                    var urlRequest = this.urlAutoPOS + "/postInvoice";
                    return clientService.post(urlRequest,model);
                }, 
                postReceipt: function (model) {
                    var urlRequest = this.urlAutoPOS + "/postReceipt";
                    return clientService.post(urlRequest,model);
                }, 
                PostShippmentDispatch: function (model) {
                    var urlRequest = this.urlAutoPOS + "/PostShippmentDispatch";
                    return clientService.post(urlRequest,model);
                }, 
                ConfirmShipment: function (model) {
                    var urlRequest = this.urlAutoPOS + "/ConfirmShipment";
                    return clientService.post(urlRequest,model);
                }, 
                checkUser: function (model) {
                    var urlRequest = this.url + "/checkUser/" + model;
                    return clientService.get(urlRequest);
                }, 
                ConfirmPacked: function (model) {
                    var urlRequest = this.urlProvider + "/AutoPostShippmentDispatchInvoice";
                    return clientService.post(urlRequest,model);
                }, 
                ConfirmPackedReconfirm: function (model) {
                    var urlRequest = this.urlProvider + "/AutoPostShippmentDispatchInvoiceReconfirm";
                    return clientService.post(urlRequest,model);
                }, 

            }
        });

})();