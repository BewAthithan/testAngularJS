(function () {
    'use strict'
    app.component('transferPallet', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/TransferPallet/component/transferPallet.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, ownerFactory, warehouseFactory, locationFactory, tranferPalletFactory, TransferStockAdjustmentFactory) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            $scope.filterModel = {};
            let viewModelOwner = ownerFactory;
            let viewModelWH = warehouseFactory;
            let viewModelLocation = locationFactory;
            let viewModelTransferPallet = tranferPalletFactory;
            var viewModel = TransferStockAdjustmentFactory;


            $scope.ScanBarcode = function () {
                $scope.filterModel = $scope.filterModel || {};
                if ($scope.filterModel.productId != "" && $scope.filterModel.productId != null) {
                    $scope.filterModel.locationName = "";
                    $scope.filterModel.productId = "";
                    $scope.filterModel.productName = "";
                    $scope.filterModel.qty = "";
                    $scope.filterModel.tagNoNew = "";

                }
                pageLoading.show();
                viewModelTransferPallet.scanLpnNo($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.length > 0) {
                        $vm.searchResultModel = res.data;
                        $vm.filterModel.locationName = res.data[0].locationName;
                        $scope.filterModel.locationName = res.data[0].locationName;
                        $scope.filterModel.lpnNo = $scope.filterModel.lpnNo;
                        $scope.filterModel.productId = res.data[0].productId;
                        $scope.filterModel.productIndex = res.data[0].productIndex;
                        $scope.filterModel.productName = res.data[0].productName;
                        $scope.filterModel.create_By = $scope.userName;
                        $scope.filterModel.update_By = $scope.userName;
                        $scope.SumQty($scope.filterModel);
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.locationNew"]');
                            if (focusElem[0].focus != undefined) {
                                focusElem[0].focus();

                            }

                        }, 200);
                        //$scope.checkLocationBalance();
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "TagNo Not Found !!!"
                        })
                    }
                },
                    function error(res) {

                    });
            }

            $scope.SumQty = function (model) {
                var deferred = $q.defer();
                viewModelTransferPallet.SumQty(model).then(
                    function success(res) {
                        $scope.sumQty = res.data.sumQtyLPN;
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.confirm = function () {
                let models = $scope.filterModel;
                validate(models).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        if ($scope.filterModel.locationNew != $vm.filterModel.locationName) {
                            viewModelTransferPallet.scanLocation(models).then(function success(res) {
                                if (res.data != true) {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: "Barcode Loc.:" + " " + $scope.filterModel.locationNew + " " + "  ไม่พบข้อมูล สแกน Barcode Location อีกครั้ง !"
                                    })
                                    $scope.filterModel.locationNew = "";
                                }
                                else 
                                {
                                    dpMessageBox.confirm({
                                        ok: 'Yes',
                                        cancel: 'No',
                                        title: 'Confirm ?',
                                        message: 'Do you want to Confirm !'
                                    }).then(function () {
                                        pageLoading.show();
                                        viewModelTransferPallet.Save(models).then(function success(res) {
                                            pageLoading.hide();
                                            if (res.data == true) {
                                                dpMessageBox.alert({
                                                    ok: 'Close',
                                                    title: 'Information.',
                                                    message: " Complete !!!"
                                                })
                                                init();
                                            }
                                            else {
                                                dpMessageBox.alert({
                                                    ok: 'Close',
                                                    title: 'Information.',
                                                    message: " Confirm Error !!!"
                                                })
                                                init();
                                            }
        
                                        }, function error(param) {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: 'Information.',
                                                message: " Confirm Error !!!"
                                            })
                                        });
                                    });
                                }
                            },
                                function error(res) {
                                });
                            
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Information.',
                                message: "ไม่สามารถโอน LPN ไปยัง Location เดิมได้ !"
                            })
                            $scope.filterModel.locationNew = "";
                        }
                    }
                })

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

            $scope.filter = function () {
                $scope.filterModel = $scope.filterModel || {};
                pageLoading.show();
                $scope.filterowner($scope.filterModel).then(function success(res) {
                    pageLoading.hide();

                    $scope.filterModel.ownerIndex = res.data[0].ownerIndex;
                    $scope.filterModel.ownerId = res.data[0].ownerId;
                    $scope.filterModel.ownerName = res.data[0].ownerName;
                    $scope.filterWarehouse($scope.filterModel).then(function success(res) {

                        $scope.filterModel.WarehouseIndex = res.data[0].warehouseIndex
                        $scope.filterModel.warehouseName = res.data[0].warehouseName;
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.lpnNo"]');
                            if (focusElem[0].focus != undefined) {
                                focusElem[0].focus();

                            }

                        }, 200);
                    });
                },
                    function error(res) { });
            }

            $scope.filterowner = function (model) {
                var deferred = $q.defer();
                pageLoading.show();
                viewModel.filterowner().then(
                    function success(res) {
                        deferred.resolve(res);
                        pageLoading.hide(1000);
                    },
                    function error(response) {
                        deferred.reject(response);
                        pageLoading.hide(1000);
                    });
                return deferred.promise;
            }

            $scope.filterWarehouse = function (model) {
                var deferred = $q.defer();
                pageLoading.show();
                viewModel.filterWarehouse(model).then(
                    function success(res) {
                        deferred.resolve(res);
                        pageLoading.hide(1000);
                    },
                    function error(response) {
                        deferred.reject(response);
                        pageLoading.hide(1000);
                    });
                return deferred.promise;
            }

            $scope.ScanLocation = function (param) {
                let models = $scope.filterModel;
                if ($scope.filterModel.locationNew != undefined) {
                    if ($scope.filterModel.locationNew != $vm.filterModel.locationName) {
                        viewModelTransferPallet.scanLocation(models).then(function success(res) {
                            if (res.data != true) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: "Barcode Loc.:" + " " + $scope.filterModel.locationNew + " " + "  ไม่พบข้อมูล สแกน Barcode Location อีกครั้ง !"
                                })
                                $scope.filterModel.locationNew = "";
                            }
                            else 
                            {
                                $scope.confirm();
                            }
                        },
                            function error(res) {
                            });
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "ไม่สามารถโอนสินค้าใน LPN ไปยัง Location เดิมได้ !"
                        })
                        $scope.filterModel.locationNew = "";
                    }
                }
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.lpnNo == null || param.lpnNo == "") {
                    msg = ' Barcode LPN ต้องไม่เป็นค่าว่าง !'
                    defer.resolve(msg);
                }
                else if (param.locationNew == null || param.locationNew == "") {
                    msg = ' Barcode Location ปลายทาง ต้องไม่เป็นค่าว่าง !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            $vm.locationlist = function () {
                if ($scope.filterModel.locationName != undefined) {
                    if ($scope.isLoading) {
                        $vm.isFilter = false;
                        var datalist = $vm.searchResultModel;
                        var items = $scope.filterModel;
                        var newItems = $vm.filterModel;
                        var sum = $scope.sumQty;
                        $scope.isLoading(datalist, items, newItems, sum).then(function (result) {
                            $vm.isFilter = true;

                        }).catch(function (error) {

                        });
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "Please BarcodeLoction !"
                    })
                }
            }

            $scope.clearSearch = function () {
                init();
            }

            $vm.barcodelpn = function () {
                if ($scope.checkBalance) {
                    $vm.isFilter = false;
                    $scope.checkBalance().then(function (result) {
                        $vm.isFilter = true;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $vm.filterModel.locationName = "";
                $scope.filter();

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            };
            init();
        }
    })
})();