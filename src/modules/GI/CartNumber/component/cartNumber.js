(function () {
    'use strict'

    app.component('cartNumber', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CartNumber/component/cartNumber.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            pickingTools: '=?',
            pickingToolsList: '=?',
            isLoading: '=?',

        },
        controller: function ($scope, $filter, $state, pageLoading, localStorageService, $timeout, $q, dpMessageBox, cartNumberFactory, cartAssignFactory, productConversionBarcodeFactory, taskListFactory, $interval) {
            var $vm = this;
            var viewModel = cartNumberFactory;
            var viewModelTaskList = taskListFactory;
            $scope.isFilter = true;
            $scope.filterModel = {};
            $scope.dataListFromService = {};
            $scope.pickingTools = true;
            $vm.Confirm = function (param) {
                // ------------------------------------ Check UserAssign ------------------------------------- //;

                $scope.fight(6);
                viewModel.checkUserAssign(param).then(function (res) {
                    
                    $scope.stopFight(6);
                    if (res.data == true) {
                        //if ($scope.filterModel.cartonNo != "" && $scope.filterModel.cartonNo != undefined) {
                        if ($scope.filterModel.qty == $scope.filterModel.numberOfScan) {
                            var models = {};
                            models.taskIndex = param.taskIndex;
                            models.taskItemIndex = param.taskItemIndex;
                            models.goodsIssueIndex = param.goodsIssueIndex;
                            models.documentStatus = param.documentStatus;
                            models.numberOfScan = param.numberOfScan;
                            models.totalQty = param.totalQty;
                            models.productConversionIndex = param.productConversionIndex;
                            models.refDocumentItemIndex = param.refDocumentItemIndex;
                            models.pickingRatio = param.ratio;
                            models.updateBy = $scope.userName;
                            // pageLoading.show();
                            // dpMessageBox.confirm({
                            //     ok: 'Yes',
                            //     cancel: 'No',
                            //     title: 'Confirm',
                            //     message: 'Do you Want to Confirm ?'
                            // }).then(function success() {
                            if ($scope.filterModel.isCheckCartonPopup == 1) {
                                $scope.fight(7);
                                viewModel.updateStatusTaskItem(models).then(function success(res) {
                                    
                                    $scope.stopFight(7);
                                    pageLoading.hide();
                                    if (res.data == true) {
                                        // dpMessageBox.alert({
                                        //     ok: 'Yes',
                                        //     title: 'Information',
                                        //     message: " Picking Complete. "
                                        // })

                                        init();
                                    }
                                    else {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Information',
                                            message: " Picking not Complete. "
                                        })
                                    }
                                }, function error(res) { });
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "คุณยังไม่ได้สแกนเลข CartonNo กรุณาสแกนอีกครั้ง !"
                                })
                                document.getElementById("confirmCarton").focus();
                                document.getElementById("myText").disabled = true;
                                $scope.filterModel.cartonNo = "";
                            }
                            //});
                        }
                        else {
                            // dpMessageBox.confirm({
                            //     ok: 'Yes',
                            //     cancel: 'No',
                            //     title: 'Confirm',
                            //     message: 'Do you Want to Short Pick ?'
                            // }).then(function success() {
                            //     var DataList = $scope.filterModel;
                            //     if ($scope.isLoading) {
                            //         $vm.isFilter = false;
                            //         $scope.isLoading(DataList).then(function (param) {
                            //             $vm.isFilter = true;
                            //             init();

                            //         }).catch(function (error) {
                            //             defer.reject({ 'Message': error });
                            //         });
                            //     }
                            // });
                            var DataList = $scope.filterModel;
                            if ($scope.isLoading) {
                                $vm.isFilter = false;
                                $scope.isLoading(DataList).then(function (param) {
                                    $vm.isFilter = true;
                                    init();

                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }
                        //}
                        // else {
                        //     dpMessageBox.alert({
                        //         ok: 'Close',
                        //         title: 'Information.',
                        //         message: "คุณยังไม่ได้สแกน CartonNo กรุณายืนยันก่อน Confirm !"
                        //     })
                        //     $scope.filterModel.cartonNo = "";
                        // }
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: " User ที่ใช้ไม่ตรงกัน กรุณา กด Confirm อีกครั้ง !! "
                        })
                        $scope.back();
                    }
                })
            }
            $scope.taskList = function () {
                
                //$vm.pickingTools = true
                if ($scope.pickingTools) {
                    var models = $vm.searchResultModel;
                    var equipmentName = $scope.filterModel;
                    $vm.isFilter = false;
                    $vm.pickingTools(models, equipmentName).then(function () {
                        $vm.isFilter = true;
                        let DataList = $vm.searchResultModel;
                        if (DataList != null) {
                            for (var i = 0; i <= DataList.length - 1; i++) {
                                if (DataList[i].selected == true) {
                                    $scope.filterModel.refDocumentItemIndex = DataList[i].refDocumentItemIndex;
                                    $scope.filterModel.equipmentItemName = DataList[i].equipmentItemName;
                                    $scope.filterModel.equipmentItemDesc = DataList[i].equipmentItemDesc;
                                    $scope.filterModel.taskNo = DataList[i].taskNo;
                                    $scope.filterModel.documentStatus = DataList[i].documentStatus;
                                    $scope.filterModel.taskItemIndex = DataList[i].taskItemIndex;
                                    $scope.filterModel.locationName = DataList[i].locationName;
                                    $scope.filterModel.planGoodsIssueNo = DataList[i].planGoodsIssueNo;
                                    $scope.filterModel.goodsIssueIndex = DataList[i].goodsIssueIndex;
                                    $scope.filterModel.productName = DataList[i].productName;
                                    $scope.filterModel.qty = DataList[i].qty;
                                    $scope.filterModel.totalQty = DataList[i].totalQty;
                                    $scope.filterModel.ratio = DataList[i].ratio;
                                    $scope.filterModel.productConversionIndex = DataList[i].productConversionIndex;
                                    $scope.filterModel.productConversionName = DataList[i].productConversionName;
                                    if (DataList[i].pickingQty == null) {
                                        $scope.filterModel.numberOfScan = 0;
                                    }
                                    else {
                                        $scope.filterModel.numberOfScan = DataList[i].pickingQty;
                                    }
                                    document.getElementById("myText").disabled = false;
                                }
                            }
                        }
                        if ($scope.filterModel.qty == $scope.filterModel.numberOfScan) {
                            $vm.Confirm($scope.filterModel);
                        }

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            function UpdateQtyScan(param) {
                $scope.fight(4);
                let deferred = $q.defer();
                viewModel.upDateQtyScan(param).then(function (results) {
                    $scope.stopFight(4);
                    deferred.resolve(results);
                },
                    function error(response) {
                        deferred.reject(response);
                    })
            }

            $scope.ScanBarcode = function () {
                var models = $scope.filterModel;
                // document.getElementById("myText").focus();
                // document.getElementById("myText").select();
                $scope.validateMsg = "";
                $scope.filterModel.productConversionBarcode = pad($scope.filterModel.productConversionBarcode);
                if (models != null) {
                    let checkNumberOfScaning = $scope.filterModel.numberOfScan;
                    if ($scope.userName != undefined) {
                        // ------------------------------------ Check UserAssign ------------------------------------- //;
                        $scope.fight(1);
                        viewModel.checkUserAssign(models).then(function (res) {
                            $scope.stopFight(1);
                            
                            if (res.data == true) {
                                if (checkNumberOfScaning != 0) {
                                    $scope.fight(2);
                                    ScanBarcode(models).then(function success(resBarcode) {
                                        $scope.stopFight(2);
                                        if (resBarcode.data.length > 0) {
                                            $scope.filterModel.productConversionBarcode = "";
                                            $scope.filterModel.GetnumberOfScan = $scope.filterModel.numberOfScan;
                                            $scope.filterModel.numberOfScan = resBarcode.data[0].productConversionRatio;
                                            //$scope.filterModel.numberOfScan = $scope.filterModel.numberOfScan * $scope.filterModel.ratio;
                                            // ------------------------------------ Check PickingQty ไม่ให้ Pick ซ ้ำ ------------------------------------- //;
                                            $scope.fight(3);
                                            viewModel.checkPickingQty($scope.filterModel).then(function success(res) {
                                                $scope.stopFight(3);
                                                let dataItem = res.data;
                                                if (dataItem.length > 0) {
                                                    if ($scope.filterModel.qty == dataItem[0].pickingQty + $scope.filterModel.numberOfScan) {
                                                        $scope.filterModel.numberOfScan = dataItem[0].pickingQty + $scope.filterModel.numberOfScan;
                                                        UpdateQtyScan($scope.filterModel);
                                                        document.getElementById("confirmCarton").focus();
                                                        document.getElementById("myText").disabled = true;
                                                    }
                                                    else if ($scope.filterModel.qty > dataItem[0].pickingQty + $scope.filterModel.numberOfScan) {
                                                        $scope.filterModel.numberOfScan = dataItem[0].pickingQty + $scope.filterModel.numberOfScan;
                                                        UpdateQtyScan($scope.filterModel);
                                                        // document.getElementById("confirmCarton").focus();
                                                        // document.getElementById("myText").disabled = true;
                                                    }
                                                    else if (dataItem[0].pickingQty + $scope.filterModel.numberOfScan != $scope.filterModel.qty) {
                                                        dpMessageBox.alert({
                                                            ok: 'Close',
                                                            title: 'Information.',
                                                            message: " จำนวนสินค้าเกิน กรุณาสแกนใหม่ !"
                                                        })
                                                        $scope.filterModel.numberOfScan = $scope.filterModel.GetnumberOfScan;
                                                        $scope.filterModel.productConversionBarcode = "";
                                                        document.getElementById("myText").focus();
                                                        document.getElementById("myText").disabled = false;
                                                        //$scope.filterModel.numberOfScan = 0;
                                                        // if ($scope.filterModel.qty == dataItem[0].pickingQty + 1) {
                                                        //     $scope.filterModel.numberOfScan = dataItem[0].pickingQty + 1;
                                                        //     UpdateQtyScan($scope.filterModel);
                                                        //     document.getElementById("confirmCarton").focus();
                                                        //     document.getElementById("myText").disabled = true;
                                                        // }
                                                        // else if ($scope.filterModel.qty > dataItem[0].pickingQty + 1) {
                                                        //     $scope.filterModel.numberOfScan = dataItem[0].pickingQty + 1;
                                                        //     UpdateQtyScan($scope.filterModel);
                                                        //     // document.getElementById("confirmCarton").focus();
                                                        //     // document.getElementById("myText").disabled = true;
                                                        // }
                                                        // else {
                                                        //     $scope.filterModel.productConversionBarcode = "";
                                                        //     $scope.filterModel.numberOfScan = dataItem[0].pickingQty;
                                                        //     document.getElementById("myText").disabled = true;
                                                        //     document.getElementById("confirmCarton").focus();
                                                        //     dpMessageBox.alert({
                                                        //         ok: 'Yes',
                                                        //         title: 'Information.',
                                                        //         message: "สินค้านี้เคยถูกสแกนครบแล้ว กรุณาสแกน Carton เพื่อ Confirm !"
                                                        //     })
                                                        // }
                                                    }
                                                    else {
                                                        $scope.filterModel.productConversionBarcode = "";
                                                        $scope.filterModel.numberOfScan = dataItem[0].pickingQty;
                                                        document.getElementById("myText").disabled = true;
                                                        document.getElementById("confirmCarton").focus();
                                                        dpMessageBox.alert({
                                                            ok: 'Yes',
                                                            title: 'Information.',
                                                            message: "สินค้านี้เคยถูกสแกนครบแล้ว กรุณาสแกน Carton เพื่อ Confirm !"
                                                        })
                                                    }
                                                }
                                                else {
                                                    if ($scope.filterModel.qty == $scope.filterModel.numberOfScan) {
                                                        UpdateQtyScan($scope.filterModel);
                                                        document.getElementById("confirmCarton").focus();
                                                        document.getElementById("myText").disabled = true;

                                                    }
                                                    else if ($scope.filterModel.qty > $scope.filterModel.numberOfScan) {
                                                        UpdateQtyScan($scope.filterModel);
                                                        // document.getElementById("confirmCarton").focus();
                                                        // document.getElementById("myText").disabled = true;
                                                    }
                                                    else {
                                                        dpMessageBox.alert({
                                                            ok: 'Close',
                                                            title: 'Information.',
                                                            message: " จำนวนสินค้าเกิน กรุณาสแกนใหม่ !"
                                                        })
                                                        $scope.filterModel.numberOfScan = $scope.filterModel.GetnumberOfScan;
                                                        $scope.filterModel.productConversionBarcode = "";
                                                        document.getElementById("myText").focus();
                                                        document.getElementById("myText").disabled = false;
                                                        //$scope.filterModel.numberOfScan = 0;
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: 'Information.',
                                                message: " Barcode " + models.productConversionBarcode + " Not Found With " + models.productName
                                            })
                                            $scope.filterModel.productConversionBarcode = "";
                                            //$scope.filterModel.numberOfScan = 0;
                                        }
                                    }, function error(param) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: " Error !!"
                                        })
                                    });
                                }
                                else {
                                    $scope.fight(2);
                                    ScanBarcode(models).then(function success(resBarcode) {
                                        $scope.stopFight(2);
                                        if (resBarcode.data.length > 0) {
                                            $scope.filterModel.productConversionBarcode = "";
                                            //$scope.filterModel.numberOfScan = resBarcode.data[0].productConversionRatio;
                                            //$scope.filterModel.numberOfScan = 1 ;
                                            $scope.filterModel.GetnumberOfScan = 1;
                                            $scope.filterModel.numberOfScan = resBarcode.data[0].productConversionRatio;
                                            // $scope.filterModel.numberOfScan = resBarcode.data[0].productConversionRatio * $scope.filterModel.ratio;
                                            // ------------------------------------ Check PickingQty ไม่ให้ Pick ซ ้ำ ------------------------------------- //;
                                            $scope.fight(3);
                                            viewModel.checkPickingQty($scope.filterModel).then(function success(res) {
                                                $scope.stopFight(3);
                                                let dataItem = res.data;
                                                if (dataItem.length > 0) {
                                                    if ($scope.filterModel.numberOfScan == $scope.filterModel.qty) {
                                                        dpMessageBox.alert({
                                                            ok: 'Close',
                                                            title: 'Information.',
                                                            message: " จำนวนสินค้าเกิน กรุณาสแกนใหม่ !"
                                                        })
                                                        $scope.filterModel.numberOfScan = $scope.filterModel.GetnumberOfScan;
                                                        $scope.filterModel.productConversionBarcode = "";
                                                        document.getElementById("myText").focus();
                                                        document.getElementById("myText").disabled = false;
                                                        //$scope.filterModel.numberOfScan = 0;

                                                        // if ($scope.filterModel.qty == dataItem[0].pickingQty + 1) {
                                                        //     $scope.filterModel.numberOfScan = dataItem[0].pickingQty + 1;
                                                        //     UpdateQtyScan($scope.filterModel);
                                                        //     document.getElementById("confirmCarton").focus();
                                                        //     document.getElementById("myText").disabled = true;

                                                        // }
                                                        // else if ($scope.filterModel.qty > dataItem[0].pickingQty + 1) {
                                                        //     $scope.filterModel.numberOfScan = dataItem[0].pickingQty + 1;
                                                        //     UpdateQtyScan($scope.filterModel);
                                                        //     // document.getElementById("confirmCarton").focus();
                                                        //     // document.getElementById("myText").disabled = true;
                                                        // }
                                                        // else {
                                                        //     //$scope.filterModel.numberOfScan = $scope.filterModel.GetnumberOfScan;
                                                        //     $scope.filterModel.productConversionBarcode = "";
                                                        //     $scope.filterModel.numberOfScan = dataItem[0].pickingQty;
                                                        //     document.getElementById("myText").disabled = true;
                                                        //     document.getElementById("confirmCarton").focus();
                                                        //     dpMessageBox.alert({
                                                        //         ok: 'Yes',
                                                        //         title: 'Information.',
                                                        //         message: "สินค้านี้สแกนครบแล้ว กรุณาสแกน Carton !"
                                                        //     })
                                                        // }
                                                    }
                                                    else if ($scope.filterModel.qty == dataItem[0].pickingQty + $scope.filterModel.numberOfScan) {
                                                        $scope.filterModel.numberOfScan = dataItem[0].pickingQty + $scope.filterModel.numberOfScan;
                                                        UpdateQtyScan($scope.filterModel);
                                                        document.getElementById("confirmCarton").focus();
                                                        document.getElementById("myText").disabled = true;
                                                    }
                                                    else if ($scope.filterModel.qty > dataItem[0].pickingQty + $scope.filterModel.numberOfScan) {
                                                        $scope.filterModel.numberOfScan = dataItem[0].pickingQty + $scope.filterModel.numberOfScan;
                                                        UpdateQtyScan($scope.filterModel);
                                                        // document.getElementById("confirmCarton").focus();
                                                        // document.getElementById("myText").disabled = true;
                                                    }
                                                }
                                                else {
                                                    if ($scope.filterModel.qty == $scope.filterModel.numberOfScan) {
                                                        UpdateQtyScan($scope.filterModel);
                                                        document.getElementById("confirmCarton").focus();
                                                        document.getElementById("myText").disabled = true;

                                                    }
                                                    else if ($scope.filterModel.qty > $scope.filterModel.numberOfScan) {
                                                        UpdateQtyScan($scope.filterModel);
                                                        // document.getElementById("confirmCarton").focus();
                                                        // document.getElementById("myText").disabled = true;
                                                    }
                                                    else {
                                                        dpMessageBox.alert({
                                                            ok: 'Close',
                                                            title: 'Information.',
                                                            message: " จำนวนสินค้าเกิน กรุณาสแกนใหม่ !"
                                                        })
                                                        $scope.filterModel.numberOfScan = $scope.filterModel.GetnumberOfScan;
                                                        $scope.filterModel.productConversionBarcode = "";
                                                        document.getElementById("myText").focus();
                                                        document.getElementById("myText").disabled = false;
                                                        //$scope.filterModel.numberOfScan = 0;
                                                    }
                                                }
                                            })
                                        }
                                        else {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: 'Information.',
                                                message: " Barcode " + models.productConversionBarcode + " Not Found With " + models.productName
                                            })
                                            $scope.filterModel.productConversionBarcode = "";
                                        }
                                    }, function error(param) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: " Product Name Must not be empty ! "
                                        })
                                    });
                                }
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " User ที่ใช้ไม่ตรงกัน กรุณา กด Confirm อีกครั้ง !! "
                                })
                                $scope.back();
                            }
                        })
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: " Barcode is required !!"
                    })
                }

            }
            $scope.ScanConfirmCarton = function () {
                if ($scope.filterModel.cartonNo != "" && $scope.filterModel.cartonNo != undefined) {
                    $scope.filterModel.isCheckCartonPopup = 1;

                    $scope.SendCarton($scope.filterModel).then(function success(res) {

                        if (res.data.length > 0) {
                            $scope.filterModel.tagOutNo = res.data[0].tagOutNo;
                            $scope.filterModel.tagOutPickNo = res.data[0].tagOutPickNo;
                            $vm.Confirm($scope.filterModel);

                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "This Carton " + $scope.filterModel.cartonNo + " " + " ไม่พบข้อมูล กรุณาสแกนอีกครั้ง !!"
                            })
                            $scope.filterModel.cartonNo = "";
                            document.getElementById("confirmCarton").focus();
                        }
                    },
                        function error(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Confirm Carton Error!!"
                            })
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " CartonNo ต้องไม่เท่ากับค่าว่าง !"
                    })
                    $scope.filterModel.isCheckCartonPopup = 0;
                }
            }
            // $scope.popupCheckCarton = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function () {
            //         var data = $scope.filterModel || {};
            //         $scope.filterModel.isCheckCartonPopup = 1;
            //         $scope.popupCheckCarton.onShow = !$scope.popupCheckCarton.onShow;
            //         $scope.popupCheckCarton.delegates.CartonPopup(data);
            //     },
            //     config: {
            //         title: "Check Carton"
            //     },
            //     invokes: {
            //         selected: function (param) {
            //             if (param.cartonNo != "" && param.cartonNo != undefined) {
            //                 $scope.SendCarton(param).then(function success(res) {
            //                     if (res.data.length > 0) {
            //                         $scope.filterModel.isCheckCartonPopup = 0;
            //                         $scope.filterModel.tagOutNo = res.data[0].tagOutNo;
            //                         $scope.filterModel.tagOutPickNo = res.data[0].tagOutPickNo;
            //                     }
            //                     else {
            //                         dpMessageBox.alert({
            //                             ok: 'Close',
            //                             title: 'Information.',
            //                             message: "This Carton " + param.cartonNo + " " + " ไม่พบข้อมูล กรุณาสแกนอีกครั้ง !!"
            //                         }).then(function success() {
            //                             $scope.popupCheckCarton.onClick();
            //                         })
            //                     }
            //                 },
            //                     function error(res) {
            //                         dpMessageBox.alert({
            //                             ok: 'Close',
            //                             title: 'Information.',
            //                             message: "Confirm Carton Error!!"
            //                         })
            //                     });
            //             }

            //             // $scope.filterModel.tagOutNo = angular.copy(param.tagOutNo);
            //             // $scope.filterModel.tagOutPickNo = angular.copy(param.tagOutPickNo);
            //         }
            //     }
            // };

            $scope.SendCarton = function (model) {
                var deferred = $q.defer();
                var _viewModel = cartAssignFactory;
                $scope.fight(5);
                _viewModel.checkCarton(model).then(
                    function success(res) {
                        $scope.stopFight(5);
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

            function SearchTask(param) {
                let deferred = $q.defer();
                // pageLoading.show();
                $scope.fight(8);
                viewModel.searchTask(param).then(
                    function success(results) {
                        $scope.stopFight(8);
                        pageLoading.hide();
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function ScanBarcode(param) {
                let deferred = $q.defer();
                var _viewModel = productConversionBarcodeFactory;
                // pageLoading.show();
                _viewModel.scanBarcode(param).then(
                    function success(results) {
                        pageLoading.hide();
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.back = function () {
                var _viewModel = cartAssignFactory;
                _viewModel.setParam("");
                $state.go('tops.cart_assign_picking', {
                })
            }
            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.isCheckCartonPopup = 0;
                document.getElementById("myTextBar").focus();
                var _viewModel = cartAssignFactory;
                $scope.userName = localStorageService.get('userTokenStorage');
                let item = _viewModel.getParam();
                if (item != undefined) {
                    $scope.filterModel.equipmentItemName = item;
                }
                var models = $scope.filterModel.equipmentItemName;
                if (models != undefined) {
                    SearchTask(models).then(function success(res) {
                        if (res.data.itemsUse.length > 0) {
                            let models = res.data.itemsUse;
                            $vm.searchResultModel = models;
                            // for (var i = 0; i <= models.length - 1; i++) {
                                
                            // }
                            if (models[0].taskIndex != null && models[0].productName) {
                                $scope.filterModel.refDocumentItemIndex = models[0].refDocumentItemIndex;
                                $scope.filterModel.productSecondName = models[0].productSecondName;
                                $scope.filterModel.equipmentItemName = models[0].equipmentItemName;
                                $scope.filterModel.equipmentItemDesc = models[0].equipmentItemDesc;
                                $scope.filterModel.equipmentName = models[0].equipmentName;
                                $scope.filterModel.taskNo = models[0].taskNo;
                                $scope.filterModel.tagOutPickNo = models[0].tagOutPickNo;
                                $scope.filterModel.documentStatus = models[0].documentStatus;
                                $scope.filterModel.taskIndex = models[0].taskIndex;
                                $scope.filterModel.taskItemIndex = models[0].taskItemIndex;
                                $scope.filterModel.locationName = models[0].locationName;
                                $scope.filterModel.planGoodsIssueNo = models[0].planGoodsIssueNo;
                                $scope.filterModel.imagePicture = models[0].imagePicture;
                                $scope.filterModel.goodsIssueIndex = models[0].goodsIssueIndex;
                                $scope.filterModel.productIndex = models[0].productIndex;
                                $scope.filterModel.productId = models[0].productId;
                                $scope.filterModel.productName = models[0].productName;
                                // $scope.filterModel.qty = models[0].qty;
                                $scope.filterModel.qty = models[0].totalQty;
                                $scope.filterModel.productConversionBarcodeName = models[0].productConversionBarcodeName;
                                $scope.filterModel.totalQty = models[0].totalQty;
                                $scope.filterModel.ratio = models[0].productConversionRatio;
                                $scope.filterModel.productConversionIndex = models[0].productConversionIndex;
                                $scope.filterModel.productConversionName = models[0].productConversionName;
                                if (models[0].pickingQty == null) {
                                    $scope.filterModel.numberOfScan = 0;
                                }
                                else {
                                    $scope.filterModel.numberOfScan = models[0].pickingQty;
                                }
                                $scope.filterModel.Createby = $scope.userName;
                                $scope.filterModel.UpdateBy = $scope.userName;
                                models[0].selected == true;
                                document.getElementById("myText").focus();
                                document.getElementById("myText").disabled = false;
                            }
                            if ($scope.filterModel.numberOfScan != undefined) {
                                if ($scope.filterModel.numberOfScan == $scope.filterModel.qty) {
                                    $vm.Confirm($scope.filterModel);
                                }
                            }
                        }

                        else {
                            if (res.data.itemsForCheck.length > 0) {
                                let models = res.data.itemsForCheck;
                                $vm.searchResultModel = models;
                                pageLoading.hide();
                                // for (var i = 0; i <= models.length - 1; i++) {
                                    
                                // }
                                if (models[0].taskIndex != null && models[0].productName) {
                                    $scope.filterModel.refDocumentItemIndex = models[0].refDocumentItemIndex;
                                    $scope.filterModel.equipmentItemName = models[0].equipmentItemName;
                                    $scope.filterModel.equipmentItemDesc = models[0].equipmentItemDesc;
                                    $scope.filterModel.equipmentName = models[0].equipmentName;
                                    $scope.filterModel.taskNo = models[0].taskNo;
                                    $scope.filterModel.tagOutPickNo = models[0].tagOutPickNo;
                                    $scope.filterModel.documentStatus = models[0].documentStatus;
                                    $scope.filterModel.taskIndex = models[0].taskIndex;
                                    $scope.filterModel.taskItemIndex = models[0].taskItemIndex;
                                    $scope.filterModel.locationName = models[0].locationName;
                                    $scope.filterModel.planGoodsIssueNo = models[0].planGoodsIssueNo;
                                    $scope.filterModel.goodsIssueIndex = models[0].goodsIssueIndex;
                                    $scope.filterModel.productIndex = models[0].productIndex;
                                    $scope.filterModel.productId = models[0].productId;
                                    $scope.filterModel.productName = models[0].productName;
                                    $scope.filterModel.imagePicture = models[0].imagePicture;
                                    // $scope.filterModel.qty = models[0].qty;
                                    $scope.filterModel.qty = models[0].totalQty;
                                    $scope.filterModel.productConversionBarcodeName = models[0].productConversionBarcodeName;
                                    $scope.filterModel.totalQty = models[0].totalQty;
                                    $scope.filterModel.ratio = models[0].productConversionRatio;
                                    $scope.filterModel.productConversionIndex = models[0].productConversionIndex;
                                    $scope.filterModel.productConversionName = models[0].productConversionName;

                                    if (models[0].pickingQty == null) {
                                        $scope.filterModel.numberOfScan = 0;
                                    }
                                    else {
                                        $scope.filterModel.numberOfScan = models[0].pickingQty;
                                    }
                                    $scope.filterModel.Createby = $scope.userName;
                                    $scope.filterModel.UpdateBy = $scope.userName;
                                    models[0].selected == true;
                                    document.getElementById("myText").focus();
                                    document.getElementById("myText").disabled = false;
                                }
                                if ($scope.filterModel.numberOfScan != undefined) {
                                    if ($scope.filterModel.numberOfScan == $scope.filterModel.qty) {
                                        $vm.Confirm($scope.filterModel);
                                    }
                                }
                            }
                            else {
                                $scope.filterModel = {};
                                $scope.filterModel.equipmentItemName = item;
                                viewModelTaskList.receivePutToStaging($scope.filterModel).then(function success(res) {
                                    if (res.data.itemsUse.length > 0) {
                                        viewModel.setParam(res.data.itemsUse[0].equipmentItemName);
                                        $state.go('tops.put_to_staging', {
                                        })
                                    }
                                    else {
                                        if ($scope.dataListFromService.tagOutNo != undefined) {
                                            dpMessageBox.alert({
                                                ok: 'Yes',
                                                title: 'Information.',
                                                message: " Carton No " + $scope.dataListFromService.tagOutNo + " Completed. "
                                            })
                                        }
                                        else {
                                            viewModel.setParam(item);
                                            $state.go('tops.put_to_staging', {
                                            })
                                        }
                                    }
                                },
                                    function error(response) {
                                    })
                                // dpMessageBox.confirm({
                                //     ok: 'Yes',
                                //     cancel: 'No',
                                //     title: 'Confirm',
                                //     message: "Cart Number " + models + " complete !!"
                                // }).then(function success() {
                                //     $scope.filterModel.equipmentItemName = item;
                                //     viewModelTaskList.receivePutToStaging($scope.filterModel).then(function success(res) {
                                //         if (res.data.length > 0) {
                                //             viewModel.setParam(res.data[0].equipmentItemName);
                                //             $state.go('tops.put_to_staging', {
                                //             })
                                //         }
                                //         else {
                                //             if ($scope.dataListFromService.tagOutNo != undefined) {
                                //                 dpMessageBox.alert({
                                //                     ok: 'Yes',
                                //                     title: 'Information.',
                                //                     message: " Carton No " + $scope.dataListFromService.tagOutNo + " Completed. "
                                //                 })
                                //             }
                                //             else {
                                //                 viewModel.setParam(item);
                                //                 $state.go('tops.put_to_staging', {
                                //                 })
                                //             }
                                //         }
                                //     },
                                //         function error(response) {
                                //         })

                                // });
                            }

                        }
                    }, function error(param) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "SearchTask Error !!!"
                        })
                    });
                }
            };

            $scope.t1 = 0;
            $scope.t2 = 0;
            $scope.t3 = 0;
            $scope.t4 = 0;
            $scope.t5 = 0;
            $scope.t6 = 0;
            $scope.t7 = 0;
            $scope.t8 = 0;

            var stop1;
            var stop2;
            var stop3;
            var stop4;
            var stop5;
            var stop6;
            var stop7;
            var stop8;

            $scope.fight = function (param) {
                // Don't start a new fight if we are already fighting
                // if (angular.isDefined(stop)) return;

                if (param == 1)
                    stop1 = $interval(function () {
                        $scope.t1 = $scope.t1 + 0.1;
                    }, 100);

                if (param == 2)
                    stop2 = $interval(function () {
                        $scope.t2 = $scope.t2 + 0.1;
                    }, 100);

                if (param == 3)
                    stop3 = $interval(function () {
                        $scope.t3 = $scope.t3 + 0.1;
                    }, 100);

                if (param == 4)
                    stop4 = $interval(function () {
                        $scope.t4 = $scope.t4 + 0.1;
                    }, 100);

                if (param == 5)
                    stop5 = $interval(function () {
                        $scope.t5 = $scope.t5 + 0.1;
                    }, 100);

                if (param == 6)
                    stop6 = $interval(function () {
                        $scope.t6 = $scope.t6 + 0.1;
                    }, 100);

                if (param == 7)
                    stop7 = $interval(function () {
                        $scope.t7 = $scope.t7 + 0.1;
                    }, 100);

                if (param == 8)
                    stop8 = $interval(function () {
                        $scope.t8 = $scope.t8 + 0.1;
                    }, 100);


            };

            function pad (str) {
                str = str.toString();
                return str.length < 13 ? pad("0" + str, 13) : str;
              }

            $scope.stopFight = function (param) {

                if (param == 1) {
                    if (angular.isDefined(stop1)) {
                        $interval.cancel(stop1);
                        stop1 = undefined;
                    }
                }

                if (param == 2) {
                    if (angular.isDefined(stop2)) {
                        $interval.cancel(stop2);
                        stop2 = undefined;
                    }
                }

                if (param == 3) {
                    if (angular.isDefined(stop3)) {
                        $interval.cancel(stop3);
                        stop3 = undefined;
                    }
                }

                if (param == 4) {
                    if (angular.isDefined(stop4)) {
                        $interval.cancel(stop4);
                        stop4 = undefined;
                    }
                }

                if (param == 5) {
                    if (angular.isDefined(stop5)) {
                        $interval.cancel(stop5);
                        stop5 = undefined;
                    }
                }

                if (param == 6) {
                    if (angular.isDefined(stop6)) {
                        $interval.cancel(stop6);
                        stop6 = undefined;
                    }
                }

                if (param == 7) {
                    if (angular.isDefined(stop7)) {
                        $interval.cancel(stop7);
                        stop7 = undefined;
                    }
                }

                
                if (param == 8) {
                    if (angular.isDefined(stop8)) {
                        $interval.cancel(stop8);
                        stop8 = undefined;
                    }
                }

            };

            $("#myTextBar").bind("focus", function () {
                setTimeout(() => {
                    $("#myTextBar").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#myTextBar").attr("readonly", "readonly");
            });

            $("#confirmCarton").bind("focus", function () {
                setTimeout(() => {
                    $("#confirmCarton").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#confirmCarton").attr("readonly", "readonly");
            });

            init();
        }
    })
})();