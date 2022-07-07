(function () {
    'use strict'

    app.component('shortPickingForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/ShortPickingTools/component/shortPickingForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            reasonCode: '=?'

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, shortPickingFactory,productFactory) {
            var $vm = this;

            var defer = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            var viewModel = shortPickingFactory;
            $scope.isSerialHide = true;
            $vm.fromConfirmShort = false;
            // var serialScanviewModel = serialScanFactory;
            $vm.isCompleted =  false;
            


            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            this.$onInit = function () {
                $scope.selected = 1;
                $scope.click = 1;
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                
            }

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $vm.onShow = function (param) {
                defer = $q.defer();
                $scope.filterModel = param;
                $scope.onShow = true;
                document.getElementById("barcode").disabled = false;
                document.getElementById("task").disabled = false;
                $window.localStorage['CompleteSerial'] = "N";
                $vm.isCompleted =  false;
                
                viewModel.getId(param.marshallIndex).then(function (res) {
                    if (res.data.marshallTaskIndex == undefined) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Scan ครบแเล้ว กรุณากดปุ่ม Confirm"
                        })
                        document.getElementById("barcode").disabled = true;
                        document.getElementById("task").disabled = true;
                        $vm.isCompleted =  true;
                        viewModel.getIdconfirm(param.planGoodsIssueIndex).then(function (res) {
                            $scope.filterModel.MarshallTaskIndex = res.data.marshallTaskIndex;
                            $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                        });
                    }
                    else {
                        $scope.filterModel.ownerIndex = res.data.ownerIndex;
                        $scope.filterModel.ownerId = res.data.ownerId;
                        $scope.filterModel.ownerName = res.data.ownerName;
                        $scope.filterModel.qty = res.data.qtyPlan;
                        $scope.filterModel.productIndex = res.data.productIndex;
                        $scope.filterModel.productName = res.data.productName;
                        $scope.filterModel.productSecondName = res.data.productSecondName;
                        $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                        $scope.filterModel.productConversionId = res.data.productConversionId;
                        $scope.filterModel.productConversionName = res.data.productConversionName;
                        $scope.filterModel.taskNo = param.taskNo;
                        $scope.filterModel.count = res.data.count;
                        $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                        $scope.filterModel.userAssign = res.data.userAssign;
                        $scope.filterModel.productBarCode = res.data.productBarcode;
                        $scope.filterModel.ImageProduct = res.data.image;
                        $scope.filterModel.MarshallTaskIndex = res.data.marshallTaskIndex;
                        $scope.filterModel.Ratio = res.data.productConversion_Ratio;
                        $scope.filterModel.pickingQty = res.data.picking_Qty;
                        $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                        $scope.filterModel.locationName = res.data.locationName;
                        $scope.filterModel.planGoodsIssueNo = res.data.planGoodsIssueNo;
                        $scope.filterModel.planGoodsIssueIndex = res.data.planGoodsIssueIndex;
                        $scope.filterModel.planGoodsIssueItemIndex = res.data.planGoodsIssueItemIndex;
                        $scope.filterModel.tag_type = res.data.tag_type;
                        $scope.filterModel.tag_key = res.data.tag_key;
                        $scope.filterModel.tag_value = res.data.tag_value;
                        $scope.filterModel.remark = res.data.remark;
                        $scope.filterModel.noPiece = res.data.noPiece;
                        $scope.filterModel.qtyRemark = res.data.qtyRemark;

                    }
                });
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.productBarcode"]');
                    focusElem.focus();

                }, 200);
                return defer.promise;
            };


            $scope.ScanProductIndex = function () {
                $scope.filterModel = $scope.filterModel || {};


                if ($scope.filterModel.productBarcode == null || $scope.filterModel.productBarcode == undefined
                    || $scope.filterModel.productBarcode == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "กรุณาใส่ BarCode"
                    })
                }
                else {
                    $scope.filterModel.productBarcode = pad($scope.filterModel.productBarcode);
                    var str = $scope.filterModel.productBarcode;
                    var SubBarCode = str.substring(0, 3);
                    if (SubBarCode == "021" && $scope.filterModel.noPiece == 1) {
                        $scope.popupPiece.onClick();
                    }
                    else {
                        $scope.ScanProduct($scope.filterModel).then(function success(res) {
                            if (res.data.length == 0) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "BarCode ไม่ตรง"
                                })
                            }
                            else {
                                viewModel.getId($scope.filterModel.marshallIndex).then(function (res) {
                                    if ($scope.filterModel.userAssign != res.data.userAssign) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: "User ไม่ตรงกับ UserAssign"
                                        })
                                        defer.resolve('1');
                                    }
                                    else {
                                        if ($scope.filterModel.replaceStatus != 1) {
                                            $scope.checkQty($scope.filterModel)
                                        }
                                        else {
                                            if ($scope.filterModel.qty == $scope.filterModel.count) {
                                                $scope.confirm();
                                            }
                                        }
                                    }
                                });
                            }
                        });
                    }

                    function error(res) {
                    }
                }
            }

            $scope.ScanProduct = function (model) {
                var deferred = $q.defer();
                $scope.pop = 0;
                if ($scope.filterModel.Qty_Piece_PickShort != undefined
                    || $scope.filterModel.Qty_Piece_PickShort != null) {
                    model.Qty_Piece_PickShort = $scope.filterModel.Qty_Piece_PickShort;
                    $scope.pop = 1;
                }
                viewModel.ProductBarcode(model).then(
                    function success(res) {
                        if ($scope.filterModel.replaceStatus == 1) {
                            $scope.filterModel.productIndex = res.data[0].product_Index;
                            $scope.filterModel.productId = res.data[0].product_Id;
                            $scope.filterModel.productName = res.data[0].product_Name;
                            $scope.filterModel.productConversionIndex = res.data[0].productConversion_Index;
                            $scope.filterModel.productConversionId = res.data[0].productConversion_Id;
                            $scope.filterModel.productConversionName = res.data[0].productConversion_Name;
                            $scope.filterModel.count = res.data[0].count;
                            $scope.filterModel.productBarcode = "";
                        }
                        else if (res.data.length == 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "BarCode ไม่ตรง"
                            })
                        }
                        else {
                            $scope.filterModel.Ratio = res.data[0].productConversion_Ratio;
                            $scope.filterModel.productConversionIndex = res.data[0].productConversion_Index;

                            if ($scope.pop = 1) {
                                viewModel.getId($scope.filterModel.marshallIndex).then(function (res) {
                                    if ($scope.filterModel.userAssign != res.data.userAssign) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: "User ไม่ตรงกับ UserAssign"
                                        })
                                        defer.resolve('1');
                                    }
                                    else {
                                        if ($scope.filterModel.qty == $scope.filterModel.count) {
                                            $scope.confirm();

                                        }
                                        else {
                                            $scope.checkQty($scope.filterModel)
                                        }
                                    }
                                });
                            }

                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "BarCode ไม่ตรง"
                        })
                    });
                return deferred.promise;
            }

            $scope.checkQty = function (model) {
                model.BarCode = model.productBarcode;

                var deferred = $q.defer();
                viewModel.ScanQTY(model).then(function success(res) {

                    if (res.data == "fasle") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "QTY เกิน"
                        })
                    }
                    else if (res.data == "notMatch") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "BarCode ไม่ตรงกับ SalesOrder ที่สั่ง"
                        })
                    }
                    else {
                        viewModel.checkQty(model).then(
                            function success(res) {

                                $scope.filterModel.isPlu = res.data[0].isPlu;
                                var qty = res.data[0].qty;
                                var count = res.data[0].count;
                                var isTask = res.data[0].isTask;
                                if (qty != count) {
                                    viewModel.getIdCount(model).then(function (res) {
                                        if ($scope.filterModel.isPlu == 1) {
                                            $scope.confirm();
                                        }
                                        else if (res.data.marshallTaskItemIndex == "00000000-0000-0000-0000-000000000000" || res.data.marshallTaskItemIndex == null) {
                                            $scope.confirm();
                                        }
                                        else {
                                            $scope.filterModel.ReasonCodeIndex = "";
                                            $scope.filterModel.ReasonCodeId = "";
                                            $scope.filterModel.ReasonCodeName = "";
                                            $scope.filterModel.qty = res.data.qtyPlan;
                                            $scope.filterModel.productIndex = res.data.productIndex;
                                            $scope.filterModel.productName = res.data.productName;
                                            $scope.filterModel.productSecondName = res.data.productSecondName;
                                            $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                                            $scope.filterModel.productConversionId = res.data.productConversionId;
                                            $scope.filterModel.productConversionName = res.data.productConversionName;
                                            $scope.filterModel.taskNo = res.data.taskNo;
                                            $scope.filterModel.count = res.data.count;
                                            $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                                            $scope.filterModel.productBarCode = res.data.productBarcode;
                                            $scope.filterModel.ImageProduct = res.data.image;
                                            $scope.filterModel.replaceStatus = res.data.replaceStatus;
                                            $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                            $scope.filterModel.locationName = res.data.locationName;
                                            $scope.filterModel.tag_type = res.data.tag_type;
                                            $scope.filterModel.tag_key = res.data.tag_key;
                                            $scope.filterModel.tag_value = res.data.tag_value;
                                            $scope.filterModel.remark = res.data.remark;
                                            $scope.filterModel.noPiece = res.data.noPiece;
                                            $scope.filterModel.qtyRemark = res.data.qtyRemark;
                                            $scope.filterModel.planGoodsIssueIndex = res.data.planGoodsIssueIndex;
                                            $scope.filterModel.planGoodsIssueItemIndex = res.data.planGoodsIssueItemIndex;


                                        }
                                    });
                                    $scope.filterModel.productBarcode = "";
                                }
                                else if (qty == count && isTask == 1) {
                                    $scope.filterModel.count = count;
                                    $scope.confirm();
                                    $scope.filterModel.productBarcode = "";
                                }
                                else {
                                    viewModel.getId(model.marshallIndex).then(function (res) {
                                        $scope.filterModel.pickingTotalQty = res.data.picking_Qty;
                                        $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                        $scope.filterModel.count = res.data.count;
                                        $scope.filterModel.remark = res.data.remark;
                                        $scope.filterModel.noPiece = res.data.noPiece;

                                        if ($scope.filterModel.qty == res.data.count) {
                                            $scope.confirm();
                                        }
                                        else if ($scope.filterModel.isPlu == 1) {
                                            $scope.confirm();
                                        }
                                        else if (res.data.marshallTaskItemIndex == "00000000-0000-0000-0000-000000000000" || res.data.marshallTaskItemIndex == null) {
                                            $scope.confirm();
                                        }
                                        else {
                                            $scope.filterModel.ReasonCodeIndex = "";
                                            $scope.filterModel.ReasonCodeId = "";
                                            $scope.filterModel.ReasonCodeName = "";
                                            $scope.filterModel.qty = res.data.qtyPlan;
                                            $scope.filterModel.productIndex = res.data.productIndex;
                                            $scope.filterModel.productName = res.data.productName;
                                            $scope.filterModel.productSecondName = res.data.productSecondName;
                                            $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                                            $scope.filterModel.productConversionId = res.data.productConversionId;
                                            $scope.filterModel.productConversionName = res.data.productConversionName;
                                            $scope.filterModel.taskNo = res.data.taskNo;
                                            $scope.filterModel.count = res.data.count;
                                            $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                                            $scope.filterModel.productBarCode = res.data.productBarcode;
                                            $scope.filterModel.ImageProduct = res.data.image;
                                            $scope.filterModel.replaceStatus = res.data.replaceStatus;
                                            $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                            $scope.filterModel.locationName = res.data.locationName;
                                            $scope.filterModel.tag_type = res.data.tag_type;
                                            $scope.filterModel.tag_key = res.data.tag_key;
                                            $scope.filterModel.tag_value = res.data.tag_value;
                                            $scope.filterModel.remark = res.data.remark;
                                            $scope.filterModel.noPiece = res.data.noPiece;
                                            $scope.filterModel.qtyRemark = res.data.qtyRemark;
                                            $scope.filterModel.planGoodsIssueIndex = res.data.planGoodsIssueIndex;
                                            $scope.filterModel.planGoodsIssueItemIndex = res.data.planGoodsIssueItemIndex;


                                        }
                                        $scope.filterModel.productBarcode = "";
                                    });
                                }
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                        return deferred.promise;
                    }
                });
            }

            $scope.confirm = function () {
                

                $scope.SerialChecking().then(function(){
                    if (!$vm.isSerialRequired)
                    {
                        var model = $scope.filterModel;
                        Add(model).then(function success(res) {
                            $vm.filterModel = res.config.data;
                        }
                            , function error(param) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "confirm error"
                                })
                            });
                    }else{
                        if(!$vm.fromConfirmShort && $scope.filterModel.count != 0 && $window.localStorage['CompleteSerial']=="N" && !$vm.isCompleted)
                        {
                        $scope.$broadcast("initChild");
                        $scope.isSerialHide = false;
                        $vm.isFilterTable = false;
                        }else {
                            var model = $scope.filterModel;
                            Add(model).then(function success(res) {
                                $vm.filterModel = res.config.data;
                            }
                                , function error(param) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "confirm error"
                                    })
                                });
                        }
                    }
                });

                
            }

            function Add(param) {
                let deferred = $q.defer();
                let item = $scope.filterModels();
                item = param;
                viewModel.confirm(item).then(
                    function success(results) {
                        viewModel.getId(param.marshallIndex).then(function (res) {
                            $vm.fromConfirmShort = false;
                            $scope.isSerialHide = true;
                            $vm.isFilterTable = true;

                            if (res.data.marshallTaskItemIndex == "00000000-0000-0000-0000-000000000000" || res.data.marshallTaskItemIndex == null) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "Scan ครบแเล้ว กรุณากดปุ่ม Confirm"
                                })
                                document.getElementById("barcode").disabled = true;
                                $vm.isCompleted =  true;
                                // $state.reload();
                            }
                            else {
                                $scope.filterModel.ReasonCodeIndex = "";
                                $scope.filterModel.ReasonCodeId = "";
                                $scope.filterModel.ReasonCodeName = "";
                                $scope.filterModel.qty = res.data.qtyPlan;
                                $scope.filterModel.productIndex = res.data.productIndex;
                                $scope.filterModel.productName = res.data.productName;
                                $scope.filterModel.productSecondName = res.data.productSecondName;
                                $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                                $scope.filterModel.productConversionId = res.data.productConversionId;
                                $scope.filterModel.productConversionName = res.data.productConversionName;
                                $scope.filterModel.taskNo = res.data.taskNo;
                                $scope.filterModel.count = res.data.count;
                                $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                                $scope.filterModel.productBarCode = res.data.productBarcode;
                                $scope.filterModel.ImageProduct = res.data.image;
                                $scope.filterModel.replaceStatus = res.data.replaceStatus;
                                $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                $scope.filterModel.locationName = res.data.locationName;
                                $scope.filterModel.tag_type = res.data.tag_type;
                                $scope.filterModel.tag_key = res.data.tag_key;
                                $scope.filterModel.tag_value = res.data.tag_value;
                                $scope.filterModel.remark = res.data.remark;
                                $scope.filterModel.noPiece = res.data.noPiece;
                                $scope.filterModel.qtyRemark = res.data.qtyRemark;
                                $scope.filterModel.planGoodsIssueIndex = res.data.planGoodsIssueIndex;
                                $scope.filterModel.planGoodsIssueItemIndex = res.data.planGoodsIssueItemIndex;

                            }

                        });
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                )
                return deferred.promise;

            }

            $scope.confirms = function () {$scope.SerialChecking().then(function(){
                if (!$vm.isSerialRequired)
                {
                    var model = $scope.filterModel;
                viewModel.Shortpick(model).then(function (res) {
                    if (res.data == "short") {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'InformaTion',
                            message: 'Do you want to Short Pick ?'
                        }).then(function success() {
                            $scope.popupShort.onClick();
                            $scope.filterModel = model;
                            
                            $scope.isSerialHide = true;
                            $vm.isFilterTable = true;
                        });
                    }
                    else {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to confirm !'
                        }).then(function () {
                            Adds(model).then(function success(res) {
                                $vm.filterModel = res.config.data;

                                $scope.isSerialHide = true;
                                $vm.isFilterTable = true;
                            }, function error(param) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "confirms error"
                                })
                            });
                        });
                    }
                })
                }else{
                    // if serial flay = Y
                    if(!$vm.fromConfirmShort && $scope.filterModel.count != 0 && $window.localStorage['CompleteSerial']=="N" && !$vm.isCompleted)
                        {
                        $scope.$broadcast("initChild");
                        $scope.isSerialHide = false;
                        $vm.isFilterTable = false;
                        }else {
                            var model = $scope.filterModel;
                viewModel.Shortpick(model).then(function (res) {
                    if (res.data == "short") {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'InformaTion',
                            message: 'Do you want to Short Pick ?'
                        }).then(function success() {
                            $scope.popupShort.onClick();
                            $scope.filterModel = model;
                            
                            $scope.isSerialHide = true;
                            $vm.isFilterTable = true;
                        });
                    }
                    else {
                        $scope.isSerialHide = true;
                        $vm.isFilterTable = true;
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to confirm !'
                        }).then(function () {
                            Adds(model).then(function success(res) {
                                $vm.filterModel = res.config.data;


                            }, function error(param) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "confirms error"
                                })
                            });
                        });
                    }
                });
                        }
                }
            });
                
            }

            function Adds(param) {

                let deferred = $q.defer();
                let item = $scope.filterModels();
                item = param;
                viewModel.ConfirmMarshallEnd(item).then(
                    function success(results) {

                        if (results.data == "ConfirmShort") {
                            $vm.fromConfirmShort = true;
                            $scope.confirm();
                        }

                        else if (results.data == "true") {
                            defer.resolve('1');
                        }
                        else if (results.data == "Error") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "กรุณา ติดต่อ Admin"
                            })
                        }
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                )
                return deferred.promise;

            }

            $scope.Replace = function () {
                var model = $scope.filterModel;
                if ($scope.filterModel.replaceStatus == 1) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "สินค้านี้ มีการ Replace แล้ว กรุณาสแกนบาร์โค้ด"
                    })
                }
                else if (model.pickingTotalQty != null && model.pickingTotalQty != 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "มีการ pick แล้ว ไม่สามารถ Replace ได้"
                    })
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to Replace !'
                    }).then(function () {
                        goReplace(model).then(function success(res) {
                            $vm.filterModel = res.config.data;
                        }, function error(param) {
                        });
                    });
                }
            }

            function goReplace(param) {
                let deferred = $q.defer();
                let item = $scope.filterModels();
                item = param;
                viewModel.Replace(item).then(
                    function success(results) {
                        $scope.filterModel.MarshallTaskItemIndex = results.data[0].marshallTaskItemIndex;
                        $scope.filterModel.replaceStatus = results.data[0].replaceStatus;
                    },
                    function error(response) {
                    }
                )

            }

            $scope.confirmShortpick = function () {
                var model = $scope.filterModel;
                viewModel.checkUser(model.MarshallTaskIndex).then(function (res) {
                    if ($scope.filterModel.userAssign != res.data.userAssign) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "User ไม่ตรงกับ UserAssign"
                        })
                        defer.resolve('1');
                    }
                    else {
                        Adds(model).then(function success(res) {
                            $vm.filterModel = res.config.data;

                            $scope.isSerialHide = true;
                            $vm.isFilterTable = true;
                        }
                            , function error(param) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "confirmShortpick error"
                                })
                            });
                    }
                })
            }
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;
                });
            };

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };


            $scope.back = function () {
                var model = $scope.filterModel;
                if (model.MarshallTaskIndex != undefined) {
                    viewModel.getId(model.marshallIndex).then(function (res) {
                        if ($scope.filterModel.userAssign != res.data.userAssign) {
                            defer.resolve('0');
                        }
                        else {
                            viewModel.resetUser(model.MarshallTaskIndex).then(function (res) {
                                $scope.filterModel = {};
                                defer.resolve('0');
                            });
                        }
                    })
                }
                else {
                    defer.resolve('0');
                }
            }



            $scope.popupMarshallTask = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.MarshallTaskIndex != null) {
                        index = $scope.filterModel.MarshallTaskIndex;
                    };
                    $scope.popupMarshallTask.onShow = !$scope.popupMarshallTask.onShow;
                    $scope.popupMarshallTask.delegates.marshallTaskPopup(index);
                },
                config: {
                    title: "Task"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.taskIndex = angular.copy(param.taskIndex);
                        $scope.filterModel.taskNo = angular.copy(param.taskNo);
                        $scope.filterModel.productIndex = angular.copy(param.productIndex);
                        $scope.filterModel.productId = angular.copy(param.productId);
                        $scope.filterModel.productName = angular.copy(param.productName);
                        $scope.filterModel.productSecondName = angular.copy(param.productName);
                        $scope.filterModel.productConversionIndex = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversionName = angular.copy(param.productConversionName);
                        $scope.filterModel.productConversionId = angular.copy(param.productConversionId);
                        $scope.filterModel.qty = angular.copy(param.taskQty);
                        $scope.filterModel.Qty = angular.copy(param.taskQty);
                        $scope.filterModel.count = angular.copy(param.count);
                        $scope.filterModel.MarshallTaskItemIndex = angular.copy(param.marshallTaskItemIndex);
                        $scope.filterModel.productBarCode = angular.copy(param.productBarcode);
                        $scope.filterModel.Ratio = angular.copy(param.productConversion_Ratio);
                        $scope.filterModel.pickingTotalQty = angular.copy(param.picking_TotalQty);
                        $scope.filterModel.ImageProduct = angular.copy(param.image);
                        $scope.filterModel.replaceStatus = angular.copy(param.replaceStatus);
                        $scope.filterModel.locationName = angular.copy(param.locationName);
                        $scope.filterModel.planGoodsIssueNo = angular.copy(param.planGoodsIssueNo);
                        $scope.filterModel.tag_type = angular.copy(param.tag_type);
                        $scope.filterModel.tag_key = angular.copy(param.tag_key);
                        $scope.filterModel.tag_value = angular.copy(param.tag_value);
                        $scope.filterModel.remark = angular.copy(param.remark);
                        $scope.filterModel.noPiece = angular.copy(param.noPiece);
                        $scope.filterModel.qtyRemark = angular.copy(param.qtyRemark);
                    }
                }
            };
            $scope.GetProductAttribute = function (model) {
                var deferred = $q.defer();
                var _productViewModel = productFactory;
                _productViewModel.getProductAttributeDAL(model).then(
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
            $scope.SerialChecking = function(){
                   ///// begin serial checking
                   $scope.productModel = {
                    ProductIndex : $scope.filterModel.productIndex
                };

                var deferred = $q.defer();
                $scope.GetProductAttribute($scope.productModel).then(function success(res) {

                    if (res.data.length > 0) {
                        $vm.isSerialRequired = (res.data[0].isSerial.toString() == "1")?true:false;
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Invalid Product"
                        })

                    }

                    if($vm.isSerialRequired)
                    {
                        $window.localStorage['OwnerIndex'] = "8B8B6203-A634-4769-A247-C0346350A963"; 
                        $window.localStorage['OrderIndex'] = $scope.filterModel.planGoodsIssueIndex; 
                        $window.localStorage['TaskItemIndex'] = $scope.filterModel.planGoodsIssueItemIndex; 
                        $window.localStorage['QtyScan'] = $scope.filterModel.count; 
                        $window.localStorage['CompleteSerial'] = "N";

                        $scope.$broadcast("initChild");
                        $scope.isSerialHide = false;
                        $vm.isFilterTable = false;
                        
                        
                    }

                    deferred.resolve(res);

                },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Confirm Carton Error!!"
                        });
                        
                    });
                    
                    return deferred.promise;
                    //// end serial checking
            }
            $vm.HideModal = function HideModal(){
            
                var completeSerial = ($window.localStorage['CompleteSerial']=="Y")?true:false;

                $window.localStorage['OwnerIndex'] = ""; 
                $window.localStorage['OrderIndex'] = ""; 
                $window.localStorage['TaskItemIndex'] = ""; 
                $window.localStorage['CompleteSerial'] = "N";

                $scope.isSerialHide = true;
                $vm.isFilterTable = true;


                if (completeSerial)
                {
                    var model = $scope.filterModel;
                viewModel.Shortpick(model).then(function (res) {
                    if (res.data == "short") {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'InformaTion',
                            message: 'Do you want to Short Pick ?'
                        }).then(function success() {
                            $scope.popupShort.onClick();

                            $scope.isSerialHide = true;
                            $vm.isFilterTable = true;

                        });
                    }
                    else {
                        var model = $scope.filterModel;
                        Add(model).then(function success(res) {
                            $vm.filterModel = res.config.data;
                        }
                            , function error(param) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "confirm error"
                                })
                            });
                    }
                })
                    console.log("completed serial");
                }else
                {
                    
                    console.log("not complete serial");
                }

            }
            $scope.popupShort = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupShort.onShow = !$scope.popupShort.onShow;
                    $scope.popupShort.delegates.shortPopup(param, index);
                },
                config: {
                    title: "ResonCode"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ReasonCodeIndex = angular.copy(param[0].reasonCodeIndex);
                        $scope.filterModel.ReasonCodeId = angular.copy(param[0].reasonCodeId);
                        $scope.filterModel.ReasonCodeName = angular.copy(param[0].reasonCodeName);

                        $scope.confirmShortpick();
                    }
                }
            };

            // $vm.CheckSerial = function() {
            // defer = $q.defer();

            // serialScanviewModel.GetOrderDetails($scope.OrderDetailModal).then(function success(res) {
            //     //console.log(res.data);

            //     $window.localStorage['OwnerIndex'] = "8B8B6203-A634-4769-A247-C0346350A963"; 
            //     $window.localStorage['OrderIndex'] = $scope.filterModel.planGoodsIssueIndex; 
            //     $window.localStorage['TaskItemIndex'] = $scope.filterModel.planGoodsIssueItemIndex; 


            //     $scope.OrderDetailModal = {
            //         OwnerIndex: "8B8B6203-A634-4769-A247-C0346350A963",
            //         OrderIndex: $scope.filterModel.planGoodsIssueIndex,
            //         TaskItemIndex: $scope.filterModel.planGoodsIssueItemIndex
            //     };
                
            //     if(res.data.statusCode == '200'){
            //         console.log(res.data.Result);
            //         $vm.orderModel = res.data.result;

            //         CheckCompleteSerial();
            //     }
            // }, function error(res) {
            //     console.log(res);
            // });

            // return defer.promise;
            // }

            // var CheckCompleteSerial = function(QtyScan) {
            //     if(QtyScan != undefined)
            //     {
            //         $vm.QtySerialScan = QtyScan;
            //     }else
            //     {
            //         // get serial count from db
            //         $vm.QtySerialScan = $vm.orderModel.Attribute.Serial.length;
            //     }
            //     $vm.QtyScan = $window.localStorage['QtyScan'];
            //     if(parseInt($vm.QtySerialScan) >= parseInt($scope.filterModel.count))
            //     {
            //     $window.localStorage['CompleteSerial'] = "Y";
            //     completeSerial = true;
            //     }else   
            //     {
            //     $window.localStorage['CompleteSerial'] = "N";
            //     completeSerial = false;
            //     }
                
            // }

            $scope.popupPiece = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupPiece.onShow = !$scope.popupPiece.onShow;
                    $scope.popupPiece.delegates.piecePopup($scope.filterModel.qtyRemark);
                },
                config: {
                    title: "ResonCode"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        debugger
                        $scope.filterModel.Qty_Piece_PickShort = angular.copy(param.piece);
                        $scope.ScanProduct($scope.filterModel);
                    }
                }
            };

            function pad(str) {
                str = str.toString();
                return str.length < 13 ? pad("0" + str, 13) : str;
            }

            $("#barcode").bind("focus", function () {
                setTimeout(() => {
                    $("#barcode").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#barcode").attr("readonly", "readonly");
            });

            $scope.getColor = function (param) {
                if (param.tag_type == "MNPICKPRM" && param.tag_key == "PICKAT" && param.tag_value == "CL") {
                    return "rgb(255, 0, 0)";
                }

            }

            var init = function () {
                $scope.filterModel = {};
            };

            init();



        }
    })
})();