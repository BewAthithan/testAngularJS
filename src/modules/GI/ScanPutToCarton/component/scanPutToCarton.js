(function () {
    'use strict'
    app.component('scanPutToCarton', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/ScanPutToCarton/component/scanPutToCarton.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, scanPutToCartonFactory) {
            var $vm = this;

            $scope.isFilter = true;
            $scope.filterModel = {};
            var viewModel = scanPutToCartonFactory;
            var qtyConfirmMarshallItem = 0;

            $scope.ScanTransferNo = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendTransferNo($vm.filterModel).then(function success(res) {

                    if (res.data.length > 0) {
                        // $vm.filterModel.ConfirmMarshallNo = res.data[0].confirmMarshallNo;
                        // $vm.filterModel.productConversionIndex = res.data[0].productConversion_Index;
                        // $vm.filterModel.productConversionId = res.data[0].productConversion_Id;
                        // $vm.filterModel.productConversionName = res.data[0].productConversion_Name;
                        // $vm.filterModel.refDocumentNo = res.data[0].refDocumentNo;
                        $vm.filterModel.confirmMarshallIndex = res.data[0].confirmMarshallIndex;
                        $vm.filterModel.confirmMarshallItemIndex = res.data[0].confirmMarshallItemIndex;
                        // //$vm.filterModel.productName = res.data[0].product_Id + ' - ' + res.data[0].product_Name;
                        // $vm.filterModel.productName = res.data[0].product_Name;
                        // $vm.filterModel.product_Id = res.data[0].product_Id;
                        // $vm.filterModel.product_Index = res.data[0].product_Index;
                        // //$vm.filterModel.qty = res.data[0].qty;
                        // $vm.filterModel.qtyConfirmMarshallItem = res.data[0].qty;
                        // $vm.filterModel.ratio = res.data[0].ratio;
                        // $vm.filterModel.totalQty = res.data[0].totalQty;
                        // $vm.filterModel.weight = res.data[0].weight;
                        // $vm.filterModel.volume = res.data[0].volume;
                        // $vm.filterModel.mfgDate = res.data[0].mfgDate;
                        // $vm.filterModel.expDate = res.data[0].expDate;
                        $vm.filterModel.itemStatus_Index = res.data[0].itemStatus_Index;
                        // $vm.filterModel.itemStatus_Id = res.data[0].itemStatus_Id;
                        // $vm.filterModel.itemStatus_Name = res.data[0].itemStatus_Name;
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: "ไม่พบ Transfer No"
                        })
                        $vm.filterModel = {};
                    }

                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.filterModel.tagOutPickNo"]');
                        focusElem[0].focus();

                    }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendTransferNo = function (model) {
                var deferred = $q.defer();
                viewModel.ScanTransferNo(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanPickTicket = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendPickTicket($vm.filterModel).then(function success(res) {
                    $vm.filterModel.tagOutPickNo = res.data[0].tagOutPickNo;
                    $vm.filterModel.tagOutPickRefDocumentNo = res.data[0].tagOutPickRefDocumentNo;
                    $vm.filterModel.tagOutNo = res.data[0].tagOutNo;
                    $vm.filterModel.planGoodsIssueNo = res.data[0].planGoodsIssueNo;
                    $vm.filterModel.tagOutItemIndex = res.data[0].tagOutItemIndex;
                    $vm.filterModel.tagOutIndex = res.data[0].tagOutIndex;
                    $vm.filterModel.CreateBy = $scope.userName
                    $vm.filterModel.qtyConfirmMarshallItem = res.data[0].qty;
                    $vm.filterModel.ImageProduct = res.data[0].image;
                    $vm.filterModel.productName =  res.data[0].product_Id + ' - ' + res.data[0].product_Name;
                    //Add new
                    $vm.filterModel.product_Index = res.data[0].product_Index;
                    $scope.ScanGRItem($vm.filterModel).then(function success(res) {

                        $vm.filterModel.goodsIssue_Index = res.data[0].goodsIssue_Index;
                        $vm.filterModel.goodsIssueItem_Index = res.data[0].goodsIssueItem_Index;
                        $vm.filterModel.itemStatusIndex = res.data[0].itemStatus_Index;
                        $vm.filterModel.itemStatusId = res.data[0].itemStatus_Id;
                        $vm.filterModel.itemStatusName = res.data[0].itemStatus_Name;
                        $vm.filterModel.product_Index = res.data[0].product_Index;
                        $vm.filterModel.product_Id = res.data[0].product_Id;
                        // $vm.filterModel.productName =  //res.data[0].product_Id + ' - ' + res.data[0].product_Name;
                        $vm.filterModel.product_Name = res.data[0].product_Id + ' - ' + res.data[0].product_Name; //Fix Issue
                        $vm.filterModel.productConversionName = res.data[0].productConversion_Name;
                        $vm.filterModel.productConversion_Name = res.data[0].productConversion_Name; //Fix Issue
                        $vm.filterModel.ProductSecondName = res.data[0].Product_SecondName;
                        $vm.filterModel.ProductThirdName = res.data[0].Product_ThirdName;
                        $vm.filterModel.productConversion_Index = res.data[0].productConversion_Index;
                        $vm.filterModel.productConversion_Id = res.data[0].productConversion_Id;



                    });

                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.filterModel.productBarcode"]');
                        focusElem[0].focus();

                    }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendPickTicket = function (model) {
                var deferred = $q.defer();
                viewModel.ScanPickTicket(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ไม่พบ PickTicket นี้ หรือ Pickicket นี้ทำงานเสร็จแล้ว."
                        })
                        // $vm.filterModel = {};
                        $scope.Clear();
                    });

                return deferred.promise;
            }

            $scope.ScanGRItem = function (model) {
                var deferred = $q.defer();
                viewModel.checkGoodReceiveItem(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.ScanProduct = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendProduct($vm.filterModel).then(function success(res) {
                    $vm.filterModel.productIndex = undefined;
                    if (res.data.length > 0) {
                        $vm.filterModel.productIndex = res.data[0].product_Index;
                    }
                    if ($vm.filterModel.product_Index == $vm.filterModel.productIndex) {
                        $vm.filterModel.productId = res.data[0].product_Id;
                        $vm.filterModel.productName = res.data[0].product_Id + ' - ' + res.data[0].product_Name;;
                        $vm.filterModel.productConversionIndex = res.data[0].productConversion_Index;
                        $vm.filterModel.productConversionId = res.data[0].productConversion_Id;
                        $vm.filterModel.productConversionName = res.data[0].productConversion_Name;

                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="$vm.filterModel.QTY"]');
                            focusElem[0].focus();

                        }, 200);
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: "ProductBarCode ไม่ตรง"
                        })
                    }


                },
                    function error(res) {

                    });
            }

            $scope.SendProduct = function (model) {
                var deferred = $q.defer();

                viewModel.ScanProduct(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanQTY = function () {

                $vm.filterModel = $vm.filterModel || {};
                $scope.SendQTY($vm.filterModel).then(function success(res) {
                    if (res.data == "false") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "QTY ไม่ตรง"
                        })
                    }
                },
                    function error(res) {

                    });
            }
            $scope.SendQTY = function (model) {
                var deferred = $q.defer();
                viewModel.ScanQTY(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }


            $scope.add = function () {
                var model = $vm.filterModel;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {

                    Add(model).then(function success(res) {

                        

                        $vm.filterModel = res.config.data;
                        $scope.SendTransferNo($vm.filterModel).then(function success(res) {
                            if (res.data.length > 0) {
                                $vm.filterModel.ConfirmMarshallNo = res.data[0].confirmMarshallNo;
                                $vm.filterModel.productConversionIndex = res.data[0].productConversion_Index;
                                $vm.filterModel.productConversionId = res.data[0].productConversion_Id;
                                //$vm.filterModel.productConversionName = res.data[0].productConversion_Name;
                                $vm.filterModel.refDocumentNo = res.data[0].refDocumentNo;
                                
                                $vm.filterModel.confirmMarshallIndex = res.data[0].confirmMarshallIndex;
                                $vm.filterModel.confirmMarshallItemIndex = res.data[0].confirmMarshallItemIndex;
                                //$vm.filterModel.productName = res.data[0].product_Id + ' - ' + res.data[0].product_Name;
                                $vm.filterModel.productName = '';
                                $vm.filterModel.product_Id = res.data[0].product_Id;
                                $vm.filterModel.product_Index = res.data[0].product_Index;
                                //$vm.filterModel.qty = res.data[0].qty;
                                qtyConfirmMarshallItem = res.data[0].qty;
                                $vm.filterModel.ratio = res.data[0].ratio;
                                $vm.filterModel.totalQty = res.data[0].totalQty;
                                $vm.filterModel.weight = res.data[0].weight;
                                $vm.filterModel.volume = res.data[0].volume;
                                $vm.filterModel.mfgDate = res.data[0].mfgDate;
                                $vm.filterModel.expDate = res.data[0].expDate;
                                $vm.filterModel.itemStatus_Index = res.data[0].itemStatus_Index;
                                $vm.filterModel.itemStatus_Id = res.data[0].itemStatus_Id;
                                $vm.filterModel.itemStatus_Name = res.data[0].itemStatus_Name;
                                //Add PickTicket
                                // $vm.filterModel.tagOutPickNo = res.data[0].documentRefNo5;
                                // $vm.filterModel.product_Index = res.data[0].product_Index;

                                $scope.ScanPickTicket();
                                $vm.filterModel.productBarcode = undefined;
                                $vm.filterModel.QTY = undefined;
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information',
                                    message: "Transfer No : " + $vm.filterModel.ConfirmMarshallNo + " comfirm success ."
                                })
                                $vm.filterModel = {};

                            }
                        });








                        // $vm.searchResultModel = res.config.data;
                        // $state.reload($state.current.name);
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            };

            function Add(param) {
                let deferred = $q.defer();
                var item = param;
                viewModel.add(item).then(
                    function success(results) {
                        //$state.reload();
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.Clear = function () {
                $vm.filterModel = {};
                $vm.filterModel.ImageProduct = "https://sv1.picz.in.th/images/2019/01/21/TWtFsy.png"
            }

            $scope.Skip = function (param) {
                

                if ($vm.filterModel.PutawayStatus == undefined)
                    $vm.filterModel.PutawayStatus = 1;
                else
                    $vm.filterModel.PutawayStatus = param.PutawayStatus + 1;


                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'InformaTion',
                    message: 'Do you want to Skip ?'
                }).then(function success() {
                    viewModel.getSkip($vm.filterModel).then(function success(res) {

                        
                        $vm.filterModel = $vm.filterModel || {};
                            $vm.filterModel.tagOutPickNo = res.data[0].tagOutPickNo;
                            $vm.filterModel.tagOutPickRefDocumentNo = res.data[0].tagOutPickRefDocumentNo;
                            $vm.filterModel.tagOutNo = res.data[0].tagOutNo;
                            $vm.filterModel.planGoodsIssueNo = res.data[0].planGoodsIssueNo;
                            $vm.filterModel.tagOutItemIndex = res.data[0].tagOutItemIndex;
                            $vm.filterModel.tagOutIndex = res.data[0].tagOutIndex;
                            $vm.filterModel.CreateBy = $scope.userName
                            $vm.filterModel.qtyConfirmMarshallItem = res.data[0].qty;
                            $vm.filterModel.ImageProduct = res.data[0].image;
                            
                            $vm.filterModel.PutawayStatus = res.data[0].putawayStatus;
                            //Add new
                            $vm.filterModel.product_Index = res.data[0].product_Index;
                            $scope.ScanGRItem($vm.filterModel).then(function success(res) {

                                $vm.filterModel.goodsIssue_Index = res.data[0].goodsIssue_Index;
                                $vm.filterModel.goodsIssueItem_Index = res.data[0].goodsIssueItem_Index;
                                $vm.filterModel.itemStatusIndex = res.data[0].itemStatus_Index;
                                $vm.filterModel.itemStatusId = res.data[0].itemStatus_Id;
                                $vm.filterModel.itemStatusName = res.data[0].itemStatus_Name;
                                $vm.filterModel.product_Index = res.data[0].product_Index;
                                $vm.filterModel.product_Id = res.data[0].product_Id;
                                $vm.filterModel.productName = res.data[0].product_Id + ' - ' + res.data[0].product_Name;
                                $vm.filterModel.product_Name = res.data[0].product_Id + ' - ' + res.data[0].product_Name; //Fix Issue
                                $vm.filterModel.productConversionName = res.data[0].productConversion_Name;
                                $vm.filterModel.productConversion_Name = res.data[0].productConversion_Name; //Fix Issue
                                $vm.filterModel.ProductSecondName = res.data[0].Product_SecondName;
                                $vm.filterModel.ProductThirdName = res.data[0].Product_ThirdName;
                                $vm.filterModel.productConversion_Index = res.data[0].productConversion_Index;
                                $vm.filterModel.productConversion_Id = res.data[0].productConversion_Id;



                            });

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="$vm.filterModel.productBarcode"]');
                                focusElem[0].focus();

                            }, 200);
                      


                    }, function error(res) { });
                });
            };

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
            }
            init()
        }
    })
})();