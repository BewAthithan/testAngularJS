(function () {
    'use strict'

    app.component('scanPickingForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/PickingTools/component/scanPickingForm.html",
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
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, pickingToolFactory) {
            var $vm = this;

            var defer = {};
            $vm.isFilterTable = true;
            $vm.isFilter = true;
            $scope.onShow = false;
            var viewModel = pickingToolFactory;



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
                document.getElementById("barcode").disabled = false;
                document.getElementById("task").disabled = false;
                document.getElementById("Replace").disabled = false;

                $scope.onShow = true;
                viewModel.getId(param.marshallIndex).then(function (res) {
                    if (res.data.marshallTaskIndex == undefined) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Scan ครบแเล้ว กรุณากดปุ่ม Confirm"
                        })
                        document.getElementById("barcode").disabled = true;
                        document.getElementById("task").disabled = true;
                        document.getElementById("Replace").disabled = true;
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
                        $scope.filterModel.productId = res.data.productId;
                        $scope.filterModel.productIndex = res.data.productIndex;
                        $scope.filterModel.productName = res.data.productName;
                        $scope.filterModel.productSecondName = res.data.productSecondName;
                        $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                        $scope.filterModel.productConversionId = res.data.productConversionId;
                        $scope.filterModel.productConversionName = res.data.productConversionName;
                        $scope.filterModel.productLot = res.data.productLot;
                        $scope.filterModel.marshallNo = res.data.marshallNo;
                        $scope.filterModel.count = res.data.count;
                        $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                        $scope.filterModel.userAssign = res.data.userAssign;
                        $scope.filterModel.productBarCode = res.data.productBarcode;
                        $scope.filterModel.ImageProduct = res.data.image;
                        $scope.filterModel.MarshallTaskIndex = res.data.marshallTaskIndex;
                        $scope.filterModel.Ratio = res.data.productConversion_Ratio;
                        $scope.filterModel.pickingQty = res.data.picking_Qty;
                        $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                        // $scope.filterModel.locationName = res.data.locationName;
                        $scope.filterModel.planGoodsIssueNo = res.data.planGoodsIssueNo;
                        $scope.filterModel.replaceStatus = res.data.replaceStatus;
                        $scope.filterModel.tag_type = res.data.tag_type;
                        $scope.filterModel.tag_key = res.data.tag_key;
                        $scope.filterModel.tag_value = res.data.tag_value;
                        $scope.filterModel.remark = res.data.remark;
                        $scope.filterModel.noPiece = res.data.noPiece;
                        $scope.filterModel.qtyRemark = res.data.qtyRemark;
                        $scope.filterModel.isUseBinbalance = res.data.isUseBinbalance;
                        //$scope.filterModel.IsUseBinbalace = res.data.isUseBinbalance;
                        $scope.filterModel.itemStatusId = res.data.itemStatusId;
                        $scope.filterModel.itemStatusIndex = res.data.itemStatusIndex;
                        $scope.filterModel.itemStatusName = res.data.itemStatusName;
                        if($scope.filterModel.isUseBinbalance == 'N'){
                            $scope.filterModel.locationName = res.data.locationName  
                        }

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
                                    if ($scope.filterModel.replaceStatus != 1) {
                                        $scope.filterModel.userAssign = $scope.userName;

                                        console.log("checkQty");
                                        
                                        $scope.checkQty($scope.filterModel)
                                    }
                                    else {

                                        console.log("confirm");

                                        if ($scope.filterModel.qty == $scope.filterModel.count) {
                                            $scope.confirm();
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
                            $scope.confirm();
                        }
                        else if (res.data.length == 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "BarCode ไม่ตรง"
                            })
                        }
                        else {
                            $scope.filterModel.productConversionIndex = res.data[0].productConversion_Index;
                            $scope.filterModel.Ratio = res.data[0].productConversion_Ratio;
                            $scope.filterModel.tag_type = res.data[0].tag_type;
                            $scope.filterModel.tag_key = res.data[0].tag_key;
                            $scope.filterModel.tag_value = res.data[0].tag_value;

                            if ($scope.pop == 1) {
                                if ($scope.filterModel.qty == $scope.filterModel.count) {
                                    $scope.confirm();
                                }
                                else {
                                    $scope.checkQty($scope.filterModel)
                                }
                            }
                        }
                        deferred.resolve(res);
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

                console.log(model);

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
                        console.log($scope.filterModel.isUseBinbalance)                        
                        // if (!model.binBalanceIndex || !model.locationName ) {
                        //         dpMessageBox.alert({
                        //             ok: 'Close',
                        //             title: 'Information.',
                        //             message: "เลือก Location ก่อน"
                        //         })
                        // }


                        if(model.isUseBinbalance == "Y" && (!model.locationName || !model.binBalanceIndex)){
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "เลือก Location ก่อน "
                            })
                        }
                        
                        else {
                            viewModel.checkQty(model).then(function success(res) {
                                $scope.filterModel.isPlu = res.data[0].isPlu;
                                var qty = res.data[0].qtyPlan;
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
                                            $scope.filterModel.productId = res.data.productId;
                                            $scope.filterModel.productIndex = res.data.productIndex;
                                            $scope.filterModel.productName = res.data.productName;
                                            $scope.filterModel.productSecondName = res.data.productSecondName;
                                            $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                                            $scope.filterModel.productConversionId = res.data.productConversionId;
                                            $scope.filterModel.productConversionName = res.data.productConversionName;
                                            $scope.filterModel.productLot = res.data.productLot;
                                            $scope.filterModel.taskNo = res.data.taskNo;
                                            $scope.filterModel.count = res.data.count;
                                            $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                                            $scope.filterModel.productBarCode = res.data.productBarcode;
                                            $scope.filterModel.ImageProduct = res.data.image;
                                            $scope.filterModel.replaceStatus = res.data.replaceStatus;
                                            $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                            // $scope.filterModel.locationName = res.data.locationName;
                                            $scope.filterModel.remark = res.data.remark;
                                            $scope.filterModel.noPiece = res.data.noPiece;
                                            $scope.filterModel.qtyRemark = res.data.qtyRemark;
                                            $scope.filterModel.itemStatusId = res.data.itemStatusId;
                                            $scope.filterModel.itemStatusIndex = res.data.itemStatusIndex;
                                            $scope.filterModel.itemStatusName = res.data.itemStatusName;

                                        }
                                    });
                                    $scope.filterModel.productBarcode = "";
                                }
                                else if (qty == count && isTask == 1) {
                                    $scope.filterModel.count = count;
                                    $scope.confirm();
                                    $scope.filterModel.productBarcode = "";
                                    $scope.filterModel.binBalanceIndex = null;
                                    $scope.filterModel.locationName = null;
                                }
                                else {
                                    viewModel.getId(model.marshallIndex).then(function (res) {
                                        $scope.filterModel.pickingTotalQty = res.data.picking_Qty;
                                        $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                        $scope.filterModel.count = res.data.count;
                                        if ($scope.filterModel.qty == res.data.count) {
                                            $scope.confirm();
                                        }
                                        else if ($scope.filterModel.isPlu == 1) {
                                            $scope.confirm();
                                        }
                                        else if (res.data.marshallTaskItemIndex == "00000000-0000-0000-0000-000000000000" || res.data.marshallTaskItemIndex == null) {
                                            $scope.confirm();                                        }
                                        else {
                                            $scope.filterModel.ReasonCodeIndex = "";
                                            $scope.filterModel.ReasonCodeId = "";
                                            $scope.filterModel.ReasonCodeName = "";
                                            $scope.filterModel.qty = res.data.qtyPlan;
                                            $scope.filterModel.productId = res.data.productId;
                                            $scope.filterModel.productIndex = res.data.productIndex;
                                            $scope.filterModel.productName = res.data.productName;
                                            $scope.filterModel.productSecondName = res.data.productSecondName;
                                            $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                                            $scope.filterModel.productConversionId = res.data.productConversionId;
                                            $scope.filterModel.productConversionName = res.data.productConversionName;
                                            $scope.filterModel.productLot = res.data.productLot;
                                            $scope.filterModel.taskNo = res.data.taskNo;
                                            $scope.filterModel.count = res.data.count;
                                            $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                                            $scope.filterModel.productBarCode = res.data.productBarcode;
                                            $scope.filterModel.ImageProduct = res.data.image;
                                            $scope.filterModel.replaceStatus = res.data.replaceStatus;
                                            $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                            // $scope.filterModel.locationName = res.data.locationName;
                                            $scope.filterModel.remark = res.data.remark;
                                            $scope.filterModel.noPiece = res.data.noPiece;
                                            $scope.filterModel.qtyRemark = res.data.qtyRemark;
                                            $scope.filterModel.itemStatusId = res.data.itemStatusId;
                                            $scope.filterModel.itemStatusIndex = res.data.itemStatusIndex;
                                            $scope.filterModel.itemStatusName = res.data.itemStatusName;
                                        }
                                        $scope.filterModel.productBarcode = "";
                                        $scope.filterModel.tag_type = res.data.tag_type;
                                        $scope.filterModel.tag_key = res.data.tag_key;
                                        $scope.filterModel.tag_value = res.data.tag_value;
                                        $scope.filterModel.remark = res.data.remark;
                                        $scope.filterModel.noPiece = res.data.noPiece;
                                        $scope.filterModel.qtyRemark = res.data.qtyRemark;
                                    });
                                }

                            },function error(response) {
                                deferred.reject(response);
                            });
                            return deferred.promise;
                        }
                    }
                });
            }

            $scope.confirm = function () {
                var model = $scope.filterModel;
                Add(model).then(function success(res) {

                    $vm.filterModel = res.config.data;

                    viewModel.getId($scope.filterModel.marshallIndex).then(function (res) {
                        if (res.data.marshallTaskItemIndex == "00000000-0000-0000-0000-000000000000" || res.data.marshallTaskItemIndex == null) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Scan ครบแเล้ว กรุณากดปุ่ม Confirm"
                            })
                            document.getElementById("barcode").disabled = true;

                            // $state.reload();
                        }
                    });
                    
                }
                    , function error(param) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "confirm error"
                        })
                    });
            }

            function Add(param) {
                let deferred = $q.defer();
                let item = $scope.filterModels();
                item = param;
                viewModel.confirm(item).then(function success(results) {
                    console.log(results);
                    if(parseInt(results.data.statusCode) >= 200 && parseInt(results.data.statusCode) <= 300) {
                        viewModel.getId(param.marshallIndex).then(function (res) {                            
                            if (res.data.marshallTaskItemIndex == "00000000-0000-0000-0000-000000000000" || res.data.marshallTaskItemIndex == null) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "Scan ครบแเล้ว กรุณากดปุ่ม Confirm"
                                })
                                document.getElementById("barcode").disabled = true;
                            } else {
                                $scope.filterModel.ReasonCodeIndex = "";
                                $scope.filterModel.ReasonCodeId = "";
                                $scope.filterModel.ReasonCodeName = "";
                                $scope.filterModel.qty = res.data.qtyPlan;
                                $scope.filterModel.productId = res.data.productId;
                                $scope.filterModel.productIndex = res.data.productIndex;
                                $scope.filterModel.productName = res.data.productName;
                                $scope.filterModel.productSecondName = res.data.productSecondName;
                                $scope.filterModel.productConversionIndex = res.data.productConversionIndex;
                                $scope.filterModel.productConversionId = res.data.productConversionId;
                                $scope.filterModel.productConversionName = res.data.productConversionName;
                                $scope.filterModel.productLot = res.data.productLot;
                                $scope.filterModel.taskNo = res.data.taskNo;
                                $scope.filterModel.count = res.data.count;
                                $scope.filterModel.MarshallTaskItemIndex = res.data.marshallTaskItemIndex;
                                $scope.filterModel.productBarCode = res.data.productBarcode;
                                $scope.filterModel.ImageProduct = res.data.image;
                                $scope.filterModel.replaceStatus = res.data.replaceStatus;
                                $scope.filterModel.pickingTotalQty = res.data.pickingTotalQty;
                                // $scope.filterModel.locationName = res.data.locationName;
                                $scope.filterModel.remark = res.data.remark;
                                $scope.filterModel.noPiece = res.data.noPiece;
                                $scope.filterModel.qtyRemark = res.data.qtyRemark;
                                $scope.filterModel.itemStatusId = res.data.itemStatusId;
                                $scope.filterModel.itemStatusIndex = res.data.itemStatusIndex;
                                $scope.filterModel.itemStatusName = res.data.itemStatusName;
                            }
                        });
                    } else if(parseInt(results.data.statusCode) >= 4000 && parseInt(results.data.statusCode) <= 6000) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error.',
                            message: results.data.statusDesc
                        })
                        $scope.filterModel.count = 0
                    }
                }, function error(response) { deferred.reject(response); })
                return deferred.promise;
            }

            $scope.confirms = function () {
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
                            $scope.filterModel.qtyBal = null;

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
            }

            function Adds(param) {

                let deferred = $q.defer();
                let item = $scope.filterModels();
                item = param;
                viewModel.ConfirmMarshallEnd(item).then(
                    function success(results) {

                        if (results.data == "ConfirmShort") {
                            $scope.confirm();
                        }

                        else if (results.data == "true") {
                            viewModel.postPickConfirm(item).then(function (res) {
                            }, function error(res) {

                            })
                            // $state.reload();
                            defer.resolve('1');

                        }
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                )
                return deferred.promise;

            }

            $scope.Replace = function () {
                $scope.filterModel.userAssign = $scope.userName;
                var model = $scope.filterModel;
                viewModel.getCheckReplace($scope.filterModel.MarshallTaskItemIndex).then(function (res) {
                    $scope.filterModel.replaceStatus = res.data.replaceStatus;
                    if ($scope.filterModel.replaceStatus == 1) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "สินค้านี้ มีการ Replace แล้ว กรุณาสแกนบาร์โค้ด"
                        })
                    }
                    else if (res.data.pickingTotalQty != parseInt(res.data.udF2)) {
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

                });
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
                        // deferred.reject(response);
                    }
                )

            }

            $scope.confirmShortpick = function () {
                var model = $scope.filterModel;
                model.userAssign = $scope.userName;

                Adds(model).then(function success(res) {
                    $vm.filterModel = res.config.data;
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

            // $scope.back = function () {
            //     // $state.reload();
            //     // $scope.filterModel = {};
            //     defer.resolve('0');
            // }

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
                        $scope.filterModel.marshallNo = angular.copy(param.marshallNo);
                        $scope.filterModel.productIndex = angular.copy(param.productIndex);
                        $scope.filterModel.productId = angular.copy(param.productId);
                        $scope.filterModel.productName = angular.copy(param.productName);
                        $scope.filterModel.productSecondName = angular.copy(param.productSecondName);
                        $scope.filterModel.productConversionIndex = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversionName = angular.copy(param.productConversionName);
                        $scope.filterModel.productConversionId = angular.copy(param.productConversionId);
                        $scope.filterModel.qty = angular.copy(param.qtyBackOrder);
                        $scope.filterModel.Qty = angular.copy(param.qtyBackOrder);
                        $scope.filterModel.count = angular.copy(param.count);
                        $scope.filterModel.MarshallTaskItemIndex = angular.copy(param.marshallTaskItemIndex);
                        $scope.filterModel.productBarCode = angular.copy(param.productBarcode);
                        $scope.filterModel.Ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.pickingTotalQty = angular.copy(param.pickingTotalQty);
                        $scope.filterModel.ImageProduct = angular.copy(param.image);
                        $scope.filterModel.replaceStatus = angular.copy(param.replaceStatus);
                        // $scope.filterModel.locationName = angular.copy(param.locationName);
                        $scope.filterModel.planGoodsIssueNo = angular.copy(param.planGoodsIssueNo);
                        $scope.filterModel.tag_type = angular.copy(param.tag_type);
                        $scope.filterModel.tag_key = angular.copy(param.tag_key);
                        $scope.filterModel.tag_value = angular.copy(param.tag_value);
                        $scope.filterModel.remark = angular.copy(param.remark);
                        $scope.filterModel.noPiece = angular.copy(param.noPiece);
                        $scope.filterModel.qtyRemark = angular.copy(param.qtyRemark);
                        $scope.filterModel.binBalanceIndex = null;
                        $scope.filterModel.locationName = null;
                        $scope.filterModel.productBarcode = null

                        if($scope.filterModel.isUseBinbalance == 'N'){
                            $scope.filterModel.locationName = angular.copy(param.locationName); 
                        }
                    }
                }
            };

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

            $vm.viewlocation = function () {
                console.log($scope.filterModel, $scope.filterModel.productBarcode);
                var model = $scope.model;
                var sum = $scope.sum;
                var Barcode = $scope.filterModel.productBarCode;
                if ($scope.filterModel.productBarCode == null || $scope.filterModel.productBarCode == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "ไม่พบข้อมูล ProductBarCode"
                    })
                }
                else {   
                    console.log($scope.filterModel)                         
                    viewModel.getBinbalanceByProduct($scope.filterModel).then(function (res) {
                        console.log(res.data);
                        if(res.data.statusCode == "200") {
                            if ($scope.isLoading) {
                                $vm.isFilter = false;
                                $scope.isLoading(res.data.result, Barcode, sum).then(function (result) {
                                    console.log(result);
                                    if (result.data != null) {
                                        $scope.filterModel.ageRemain = result.data[0].ageRemain;
                                        $scope.filterModel.binBalanceIndex = result.data[0].binBalanceIndex;
                                        $scope.filterModel.BinbalanceIndex = result.data[0].binBalanceIndex;
                                        $scope.filterModel.goodsReceiveDate = result.data[0].goodsReceiveDate;
                                        $scope.filterModel.goodsReceiveEXPDate = result.data[0].goodsReceiveEXPDate;
                                        $scope.filterModel.goodsReceiveMFGDate = result.data[0].goodsReceiveMFGDate;
                                        $scope.filterModel.itemStatusIndex = result.data[0].itemStatusIndex;
                                        $scope.filterModel.itemStatusName = result.data[0].itemStatusName;
                                        $scope.filterModel.locationName = result.data[0].locationName;
                                        $scope.filterModel.ownerId = result.data[0].ownerId;
                                        $scope.filterModel.productConversionName = result.data[0].productConversionName;
                                        $scope.filterModel.productId = result.data[0].productId;
                                        $scope.filterModel.productLot = result.data[0].productLot;
                                        $scope.filterModel.productName = result.data[0].productName;
                                        $scope.filterModel.productShelfLifeD = result.data[0].productShelfLifeD;
                                        $scope.filterModel.qtyBal = result.data[0].qtyBal;
                                        $scope.filterModel.selected = result.data[0].selected;
                                        $scope.filterModel.shelfLifeRemain = result.data[0].shelfLifeRemain;
                                        $scope.filterModel.tagNo = result.data[0].tagNo;
                                        $scope.filterModel.warehouseID = result.data[0].warehouseID;
                                    }

                                    console.log($scope.filterModel);
        
                                    $vm.isFilter = true;
        
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        } else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.statusDesc
                            })
                        }
                    });
                }

            }

            var init = function () {
                $scope.filterModel = {};
            };

            init();



        }
    })
})();