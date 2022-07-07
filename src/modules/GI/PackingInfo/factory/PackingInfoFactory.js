(function () {
    'use strict';
    app.factory("packingInfoFactory",
        function ($q, $http, ngAuthSettings, localStorageService, webServiceAPI, clientService) {

            return {
                get: clientService.get,
                post: clientService.post,
                url: webServiceAPI.AutoPOS + "POS",
                urlAutoPOS: webServiceAPI.AutoPOS + "AutoPOS",
                urlInterface: webServiceAPI.NewInterface + "Order",
                urlProvider: webServiceAPI.Provider + "InterfaceWMS",
                filter: function (model) {
                    var urlRequest;
                    var dateFrom = "", dateTo = "";
                    if(model.planGoodsIssueDueDateFrom) {
                        dateFrom = model.planGoodsIssueDueDateFrom.substring(0, 4) +
                        "-" + model.planGoodsIssueDueDateFrom.substring(4, 6) +
                        "-" + model.planGoodsIssueDueDateFrom.substring(6, 8);
                    }
                    if(model.planGoodsIssueDueDateTo) {
                        dateTo = model.planGoodsIssueDueDateTo.substring(0, 4) +
                        "-" + model.planGoodsIssueDueDateTo.substring(4, 6) +
                        "-" + model.planGoodsIssueDueDateTo.substring(6, 8);
                    }
                    if(!model.soNo && !model.documentTypeId) {
                        urlRequest = this.urlInterface + "/GetPackingInfoList?ownerId=" + localStorageService.get('ownerVariableId') +
                        "&soNo=&soType=&planGoodsIssueDueDateFrom=" +  dateFrom + "&planGoodsIssueDueDateTo=" +  dateTo;
                    } else {
                        var ownerId, soNo, documentTypeId, planGoodsIssueDueDateFrom, planGoodsIssueDueDateTo;
                        if(model.ownerId) {
                            ownerId = "ownerId=" +  model.ownerId;
                        } else {
                            ownerId = "";
                        }
                        if(model.soNo) {
                            soNo = "&soNo=" +  model.soNo;
                        } else {
                            soNo = "";
                        }
                        if(model.documentTypeId) {
                            documentTypeId = "&soType=" +  encodeURIComponent(model.documentTypeId);
                        } else {
                            documentTypeId = "";
                        }
                        if(model.planGoodsIssueDueDateFrom) {
                            planGoodsIssueDueDateFrom = "&planGoodsIssueDueDateFrom=" +  dateFrom;
                        } else {
                            planGoodsIssueDueDateFrom = "";
                        }
                        if(model.planGoodsIssueDueDateTo) {
                            planGoodsIssueDueDateTo = "&planGoodsIssueDueDateTo=" +  dateTo;
                        } else {
                            planGoodsIssueDueDateTo = "";
                        }
                        urlRequest = this.urlInterface + "/GetPackingInfoList?" +  ownerId + soNo + documentTypeId + 
                        planGoodsIssueDueDateFrom + planGoodsIssueDueDateTo;
                    }
                    return clientService.get(urlRequest);
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
                    console.log(model);
                    var urlRequest = this.urlInterface + "/GetReportPackingInfo?ownerId=" + model.owner +
                    "&planGoodsIssueNo=" + model.planGoodsIssue_No + "&packNo=" + model.pack_no;
                    console.log(urlRequest);
                    // var urlRequest = this.urlAutoPOS + "/postReceipt";
                    return clientService.get(urlRequest);
                    // return clientService.post(urlRequest,model);
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
            }
        });

})();