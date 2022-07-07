(function () {
    'use strict'
    app.component('pickManualItem', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/PickManual/component/pickManualItem.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?'
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, PickManualFactory, runWaveFactory) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            $scope.filterModel = {};
            var viewModelRunwave = runWaveFactory;

            var viewModel = PickManualFactory;

            $vm.$onInit = function () {

            }


            $scope.Product = function () {
                // $scope.filterModel = $scope.filterModel || {};
                // $scope.ScanProduct($scope.filterModel).then(function success(res) {
                //     if (res.data.length == 1) {

                //         $scope.filterModel.BinBalanceIndex = res.data[0].binBalance_Index
                //         $scope.filterModel.BinBalanceQtyBal = res.data[0].binBalance_QtyBal;
                //         $scope.filterModel.productConversion_Id = res.data[0].productConversion_Id;
                //         $scope.filterModel.productConversion_Index = res.data[0].productConversion_Index;
                //         $scope.filterModel.productConversion_Name = res.data[0].productConversion_Name;
                //         $scope.filterModel.productConversionName = res.data[0].productConversion_Name;
                //         $scope.filterModel.productConversion_Ratio = res.data[0].productConversion_Ratio;
                //         $scope.filterModel.productId = res.data[0].product_Id;
                //         $scope.filterModel.productIndex = res.data[0].product_Index;
                //         $scope.filterModel.productName = res.data[0].product_Name;
                //         $scope.filterModel.Location_Name = res.data[0].locationName;
                //         $scope.filterModel.LocationName = res.data[0].locationName;
                //     }
                //     if (res.data.length != 0) {
                //         $scope.model = res.data;
                //         $scope.SumQty($scope.filterModel).then(function success(res) {
                //             $scope.sum = res.data;
                //         });
                //     }


                // });
                // function error(res) {

                // }
            }

            $scope.ScanProduct = function (model) {
                // var deferred = $q.defer();
                // viewModel.ScanProduct(model).then(
                //     function success(res) {
                //         if (res.data.length == 0) {
                //             dpMessageBox.alert({
                //                 ok: 'Close',
                //                 title: 'Information',
                //                 message: 'ไม่พบ BarCode ใน Location นี้'
                //             })
                //             $scope.filterModel.productConversionBarcode = null;

                //         }
                //         deferred.resolve(res);
                //     },
                //     function error(response) {
                //         dpMessageBox.alert({
                //             ok: 'Close',
                //             title: 'Information',
                //             message: 'ไม่พบ BarCode ใน Location นี้'
                //         })
                //     });
                // return deferred.promise;
            }


            $scope.filter = function () {
                // $scope.filterModel = $scope.filterModel || {};
                // pageLoading.show();
                // $scope.filterowner($scope.filterModel).then(function success(res) {
                //     pageLoading.hide();

                //     $scope.filterModel.ownerIndex = res.data[0].ownerIndex;
                //     $scope.filterModel.ownerId = res.data[0].ownerId;
                //     $scope.filterModel.ownerName = res.data[0].ownerName;
                //     $scope.filterWarehouse($scope.filterModel).then(function success(res) {

                //         $scope.filterModel.WarehouseIndex = res.data[0].warehouseIndex
                //         $scope.filterModel.warehouseName = res.data[0].warehouseName;
                //     });
                // },
                //     function error(res) { });
            }

            $scope.filterowner = function (model) {
                // var deferred = $q.defer();
                // pageLoading.show();
                // viewModel.filterowner().then(
                //     function success(res) {
                //         deferred.resolve(res);
                //         pageLoading.hide(1000);
                //     },
                //     function error(response) {
                //         deferred.reject(response);
                //         pageLoading.hide(1000);
                //     });
                // return deferred.promise;
            }

            $scope.Confirm = function (param) {
                if (!param.soIndex) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information',
                        message: 'กรุณาเลือกออเดอร์'
                    })
                }
                if (param.qty > param.qtyStock) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information',
                        message: 'ไม่สามารถหยิบได้ ของในสต๊อกไม่พอ'
                    })
                }
                if (param.qtyPiece != undefined) {
                    var check = Number.isInteger(param.qtyPiece);
                    if (check == false) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ห้ามใส่จุดทศนิยม"
                        })
                        return "";
                    }
                }
                if ($scope.filterModel.is_WeightByPiece != 'N') {
                    debugger
                    if (param.qty != 0) {
                        debugger
                        if (param.qtyPiece == undefined || param.qtyPiece == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "กรุณากรอกจำนวนลูกเพื่อยืนยันการหยิบ"
                            })
                            return "";
                        }
                    }


                    if ($scope.filterModel.qtyRemark < param.qtyPiece) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "จำนวนเกินกว่าที่สั่ง"
                        })
                        return "";
                    }
                    debugger
                    if (param.qtyPiece <= 0 && param.qtyPiece != "" && param.qtyPiece != undefined && param.qtyPiece != null) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ใส่จำนวนลูกไม่ถูกต้อง "
                        })
                        return "";
                    }
                    else {

                        document.getElementById("chkconfirm").disabled = true;
                        document.getElementById("chkconfirm1").disabled = true;
                        param.planGoodsIssue_Index = param.soIndex;
                        param.goodsIssue_Index = param.giIndex;
                        param.product_Index = param.productIndex;
                        param.product_Id = param.productCode;
                        param.product_Name = param.productName;
                        param.totalQty = param.qty;
                        param.createBy = localStorageService.get('userTokenStorage');
                        viewModel.confirm(param).then(function success(res) {
                            document.getElementById("chkconfirm").disabled = false;
                            document.getElementById("chkconfirm1").disabled = false;
                            // $scope.datalist.config.paginations = res.data.pagination;
                            $scope.filterModel = {};
                            var contentArr = res.data.split(',');

                            if (contentArr == "Order นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่") {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: 'Confirm.',
                                    message: "Order นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่"
                                }).then(function success() {
                                    mendPickmanual(param);
                                });
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    // message: results.data
                                    messageNewLine: contentArr
                                })
                            }

                            // $window.reload();
                            // $scope.datalist.config.title = $scope.config.title;
                            // if ($scope.datalist.delegates.set)
                            //     $scope.datalist.delegates.set(res.data);
                        }, function error(res) {
                            document.getElementById("chkconfirm").disabled = false;
                            document.getElementById("chkconfirm1").disabled = false;
                            $scope.filterModel = {};
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information',
                                message: 'กรุณาลองใหม่อีกครั้ง'
                            })
                        });
                    }
                }
                else {

                    document.getElementById("chkconfirm").disabled = true;
                    document.getElementById("chkconfirm1").disabled = true;
                    param.planGoodsIssue_Index = param.soIndex;
                    param.goodsIssue_Index = param.giIndex;
                    param.product_Index = param.productIndex;
                    param.product_Id = param.productCode;
                    param.product_Name = param.productName;
                    param.totalQty = param.qty;
                    param.createBy = localStorageService.get('userTokenStorage');
                    viewModel.confirm(param).then(function success(res) {
                        document.getElementById("chkconfirm").disabled = false;
                        document.getElementById("chkconfirm1").disabled = false;
                        // $scope.datalist.config.paginations = res.data.pagination;
                        $scope.filterModel = {};
                        var contentArr = res.data.split(',');

                        if (contentArr == "Order นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่") {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Confirm.',
                                message: "Order นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่"
                            }).then(function success() {
                                mendPickmanual(param);
                            });
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                // message: results.data
                                messageNewLine: contentArr
                            })
                        }

                        // $window.reload();
                        // $scope.datalist.config.title = $scope.config.title;
                        // if ($scope.datalist.delegates.set)
                        //     $scope.datalist.delegates.set(res.data);
                    }, function error(res) {
                        document.getElementById("chkconfirm").disabled = false;
                        document.getElementById("chkconfirm1").disabled = false;
                        $scope.filterModel = {};
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'กรุณาลองใหม่อีกครั้ง'
                        })
                    });
                }
            }


            function mendPickmanual(param) {
                let item = {};
                item.planGoodsIssueIndex = [];
                item.planGoodsIssueIndex.push(param.soIndex);
                item.goodsIssueIndex = param.giIndex
                item.Create_By = localStorageService.get('userTokenStorage');
                viewModelRunwave.runWavePickManual(item).then(
                    function success(results) {
                        var contentArr = results.data.split(',');

                        if (contentArr == "Order นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่") {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Confirm.',
                                message: "Order นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่"
                            }).then(function success() {
                                mendPickmanual(param)
                            });
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                // message: results.data
                                messageNewLine: contentArr
                            })
                        }
                        // MessageBox.alert({
                        //     ok: 'Close',
                        //     title: 'Information.',
                        //     // message: results.data
                        //     messageNewLine: contentArr
                        // })
                        Progressbar.hide();
                        $vm.triggerSearch();
                    },
                    function error(response) {
                        Progressbar.hide();
                        MessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: 'Error'
                        })
                        deferred.reject(response);
                    }
                );
            }




            function Add(param) {
                let deferred = $q.defer();
                var item = param;
                viewModel.add(item).then(
                    function success(results) {
                        // $state.reload();
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
                    }
                }
            };

            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.onShow;
                    $scope.popupWarehouse.delegates.warehousePopup(param, index);
                },
                config: {
                    title: "Warehouse"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndex = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseId = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseName);

                        localStorageService.set('warehouseVariableId', angular.copy(param.warehouseId));
                        localStorageService.set('warehouseVariableIndex', angular.copy(param.warehouseIndex));
                        localStorageService.set('warehouseVariableName', angular.copy(param.warehouseName));
                    }
                }
            };

            $scope.popupProductConversion = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.productIndex != null) {
                        index = $scope.filterModel.productIndex;
                    };
                    $scope.popupProductConversion.onShow = !$scope.popupProductConversion.onShow;
                    $scope.popupProductConversion.delegates.productConversionPopup(index);
                },
                config: {
                    title: "ProductConversion"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.productConversion_Ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.productConversion_Index = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversion_Id = angular.copy(param.productConversionId);
                        $scope.filterModel.productConversion_Name = angular.copy(param.productConversionName);

                    }
                }
            };

            $scope.popupReasonCode = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupReasonCode.onShow = !$scope.popupReasonCode.onShow;
                    $scope.popupReasonCode.delegates.reasonCodePopup(param, index);
                },
                config: {
                    title: "ResonCode"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ReasonCodeIndex = angular.copy(param.reasonCodeIndex);
                        $scope.filterModel.ReasonCodeId = angular.copy(param.reasonCodeId);
                        $scope.filterModel.ReasonCodeName = angular.copy(param.reasonCodeName);

                        $scope.ConfirmSave();

                    }
                }
            };

            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $scope.filter();
                // $state.reload();
                $window.scrollTo(0, 0);
            }

            $scope.providers = {
                invokes: {
                    set: function (param) {
                        $scope.filterModel.productIndex = param[0].product_Index;
                        $scope.filterModel.productName = param[0].product_Name;
                        $scope.filterModel.productCode = param[0].product_Id;
                        $scope.filterModel.qtyStock = param[0].qtyStock;
                        $scope.filterModel.unitStock = 'EA';
                        $scope.filterModel.qty = param[0].totalQty;
                        $scope.filterModel.unit = param[0].uom;
                        $scope.filterModel.barcode = param[0].barcode;
                        $scope.filterModel.binBalance_Index = param[0].binBalance_Index;
                        $scope.filterModel.remark = param[0].remark;
                        $scope.filterModel.is_WeightByPiece = param[0].is_WeightByPiece;
                        $scope.filterModel.qtyRemark = param[0].qtyRemark;


                        $vm.isFilter = true;
                    }
                }
            }

            $vm.productList = function () {


                if (($scope.filterModel.soNo == undefined || $scope.filterModel.soNo == '') || ($scope.filterModel.giNo == undefined || $scope.filterModel.giNo == '')) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information',
                        message: 'กรุณาระบุเอกสารให้ครบก่อน'
                    })
                }
                else {

                    $vm.isFilter = false;



                    $scope.isLoading($scope.filterModel).then(function (result) {
                        $scope.filterModel.productIndex = result[0].product_Index;
                        $scope.filterModel.productName = result[0].product_Name;
                        $scope.filterModel.productCode = result[0].product_Id;
                        $scope.filterModel.qtyStock = result[0].qtyStock;
                        $scope.filterModel.unitStock = result[0].uom;
                        $scope.filterModel.qty = result[0].totalQty;
                        $scope.filterModel.unit = result[0].uom;
                        $scope.filterModel.binBalance_Index = result[0].binBalance_Index;

                        // if (result.data != null) {
                        // $scope.filterModel.BinBalanceIndex = result.data[0].binBalance_Index
                        // $scope.filterModel.BinBalanceQtyBal = result.data[0].binBalance_QtyBal;
                        // $scope.filterModel.productConversionId = result.data[0].productConversion_Id;
                        // $scope.filterModel.productConversionIndex = result.data[0].productConversion_Index;
                        // $scope.filterModel.productConversionName = result.data[0].productConversion_Name;
                        // $scope.filterModel.productConversionId = result.data[0].productConversion_Id;

                        // $scope.filterModel.productConversion_Index = result.data[0].productConversion_Index;
                        // $scope.filterModel.productConversion_Id = result.data[0].productConversion_Id;
                        // $scope.filterModel.productConversion_Name = result.data[0].productConversion_Name;
                        // $scope.filterModel.productId = result.data[0].product_Id;
                        // $scope.filterModel.productIndex = result.data[0].product_Index;
                        // $scope.filterModel.productName = result.data[0].product_Name;
                        // $scope.filterModel.productConversion_Ratio = result.data[0].productConversion_Ratio;
                        // $scope.filterModel.Location_Name = result.data[0].locationName;
                        // $scope.filterModel.LocationName = result.data[0].locationName;
                        // }

                        $vm.isFilter = true;

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            $scope.soCatchWeightPopup = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.soCatchWeightPopup.config.title = 'SO Catch Weight';
                    $scope.soCatchWeightPopup.onShow = !$scope.soCatchWeightPopup.onShow;
                    $scope.soCatchWeightPopup.delegates.filter();
                },
                config: {
                    title: "SO Catch Weight"
                },
                invokes: {
                    selected: function (param, mode) {
                        if (mode == 'SO Catch Weight') {
                            $scope.filterModel.soNo = param.planGoodsIssue_No;
                            $scope.filterModel.soIndex = param.planGoodsIssue_Index;
                        }
                        else if (mode == 'Work Order Catch Weight') {
                            $scope.filterModel.giNo = param.goodsIssue_No;
                            $scope.filterModel.giIndex = param.goodsIssue_Index;
                        }
                    }
                }
            };

            $scope.sogiCatchWeightPopup = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.soCatchWeightPopup.config.title = 'SO Catch Weight';
                    $scope.soCatchWeightPopup.onShow = !$scope.soCatchWeightPopup.onShow;
                    $scope.soCatchWeightPopup.delegates.filter();
                },
                onClickWorkOrder: function (param) {

                    if (param.soNo == '' || param.soNo == undefined) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'กรุณาเลือก SO ก่อน'
                        })
                    }
                    else {



                        $scope.sogiCatchWeightPopup.config.title = 'Work Order Catch Weight';
                        $scope.sogiCatchWeightPopup.onShow = !$scope.sogiCatchWeightPopup.onShow;

                        param.planGoodsIssue_No = param.soNo;

                        $scope.sogiCatchWeightPopup.delegates.filter(param);
                    }



                },
                config: {
                    title: "SO Catch Weight"
                },
                invokes: {
                    selected: function (param, mode) {
                        if (mode == 'SO Catch Weight') {
                            $scope.filterModel.soNo = param.planGoodsIssue_No;
                            $scope.filterModel.soIndex = param.planGoodsIssue_Index;
                        }
                        else if (mode == 'Work Order Catch Weight') {
                            $scope.filterModel.giNo = param.goodsIssue_No;
                            $scope.filterModel.giIndex = param.goodsIssue_Index;
                        }
                    }
                }
            };

            var init = function () {
            };

            init();
        }
    })
})();