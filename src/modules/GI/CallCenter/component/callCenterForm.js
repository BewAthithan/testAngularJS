(function () {
    'use strict'

    app.component('callCenterForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CallCenter/component/callCenterForm.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',

        },
        controller: function ($scope, $q, pageLoading, dpMessageBox, callCenterFactory, callCenterItemFactory, localStorageService, $state, reasonCodeGiFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = callCenterFactory;


            $vm.isFilterTable = true;
            $scope.onShow = false;

            //Component life cycle
            $vm.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.goodsReceiveDate = getToday()
                $scope.selected = 1;
                $scope.click = 1;
                $scope.filterModel.CreateBy = localStorageService.get('userTokenStorage');
            }
            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.getList = function () {
                $scope.filterModel.callcenterNo = $scope.filterModel.callCenterNo;
                $scope.filterModel.callcenterIndex = $scope.filterModel.callCenterIndex;
                viewModel.getList($scope.filterModel).then(function (res) {
                    $scope.filterModel.listCallCenterItemViewModel = res.data.result;
                    $scope.filterModel.lineNo = res.data.result[0].lineNo;
                });
            }

            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                }
                $scope.onShow = true;
                if (param != undefined) {
                    viewModel.getId(param.callCenterIndex).then(function (res) {
                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        document.getElementById("location").focus();

                        viewModel.getConfig($scope.filterModel).then(function (res) {
                            if(res.data.result[0].config_value == "Y") {
                                $scope.filterModel.locationInput = true;
                            } else {
                                $scope.filterModel.locationInput = false;
                            }
                        });

                        $scope.getList();

                        // callCenterItemFactory.getByCallCenterId(param.callCenterIndex).then(function (res) {
                        //     $scope.filterModel.listCallCenterItemViewModel = res.data;
                        // });
                    });
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };


            $scope.edit = function () {
                var model = $scope.filterModel;

                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    Edit(model).then(function success(res) {
                        $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
                defer.resolve();
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }
            $scope.editItem = function (param, index) {
                var owner = $scope.filterModel.ownerIndex;
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listCallCenterItemViewModel[result.index] = result;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            function validate(param) {
                var msg = "";
                return msg;
            }

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };

            $scope.add = function () {
                $scope.filterModel.createBy = $scope.userName;
                $scope.filterModel.IsAccept = true;
                var model = $scope.filterModel;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to confirm !'
                }).then(function () {
                    viewModel.confirmSubstitute(model).then(function success(results) {
                        if(parseInt(results.data.statusCode) >= 200 && parseInt(results.data.statusCode) <= 299) {                            
                            reasonCodeGiFactory.filterCallcenter().then(function success(res) {
                                $scope.filterModel.ReasonCodeIndex = res.data[0].reasonCodeIndex;
                                $scope.filterModel.ReasonCodeId = res.data[0].reasonCodeId;
                                $scope.filterModel.ReasonCodeName = res.data[0].reasonCodeName;
                                $scope.save();
                            }, function error(res) {});
                        } else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Error.',
                                message: results.data.statusDesc
                            });
                        }
                    }, function error(response) {});
                });
            }

            $scope.save = function () {
                viewModel.UpdateReasonCode($scope.filterModel).then(function success(res) {
                    if(res.data == "fasle") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "กำลังทำงานอยู่ หรือ มีการกด Close ไปแล้ว "
                        });
                    } else if(res.data == "true") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Close Success"
                        });
                        $scope.back();
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: res.data
                        });
                    }
                }, function error(res) {});
            };

            $scope.cancel = function () {
                $scope.filterModel.createBy = $scope.userName;
                $scope.filterModel.IsDissmiss = true;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Cancel ?',
                    message: 'Do you want to cancel !'
                }).then(function () {
                    viewModel.cancelSubstitute($scope.filterModel).then(function success(results) {
                        if(parseInt(results.data.statusCode) >= 200 && parseInt(results.data.statusCode) <= 299) {
                            $scope.save();
                        } else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Error.',
                                message: results.data.statusDesc
                            });
                        }                        
                    }, function error(response) {});
                });
            }

            function Add(param) {
                let deferred = $q.defer();
                var item = param;
                viewModel.add(item).then(
                    function success(results) {
                        // $state.reload();
                        defer.resolve('1');
                        // deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                )
                return deferred.promise;

            }

            function Edit(param) {
                var deferred = $q.defer();
                viewModel.edit(param).then(
                    
                    function success(results) {
                        
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            function validate(param) {
                var msg = "";
                return msg;
            }
            
            $scope.back = function () {
                var model = $scope.filterModel;
                if (model.callCenterIndex != undefined) {
                    viewModel.resetUser(model.callCenterIndex).then(function (res) {});
                }
                $scope.filterModel = {};
                defer.resolve('1');
                setTimeout(() => { document.getElementById("search").click() }, 50);
            }

            $scope.reasonCode = function (param) {
                $scope.filterModel.button = param;
                $scope.filterModel.type = "form";
                $scope.filterModel.callCenter = true;
                $scope.popupReasonCode.onClick($scope.filterModel);
            };

            $scope.fcsl = function(id) {
                document.getElementById(id).focus();
                document.getElementById(id).select();
            }
            
            $scope.checkLocation = function () {
                viewModel.checkLocation($scope.filterModel).then(function success(results) {
                    if(results.data.statusCode == "200") {
                        document.getElementById("sku").focus();
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error.',
                            message: results.data.statusDesc
                        });
                    }
                }, function error(response) {});
            };

            $scope.checkProductLocation = function () {
                viewModel.checkProductLocation($scope.filterModel).then(function success(results) {
                    if(parseInt(results.data.statusCode) >= 400 && parseInt(results.data.statusCode) <= 499) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error.',
                            message: results.data.statusDesc
                        });
                    } else {
                        $scope.filterModel.productID = results.data.productID;
                        $scope.filterModel.ratio = parseFloat(results.data.ratio);
                        $scope.filterModel.binbalance = results.data.result;
                        $scope.filterModel.isWeight = results.data.isWeight;
                        $scope.filterModel.productConversionID = results.data.productConversionID;
                        $scope.filterModel.productConversionName = results.data.productConversionName;
                        $scope.filterModel.productConversionBarcode = results.data.productConversionBarcode;
                        $scope.filterModel.productConversionWeightBarcode = results.data.productConversionWeightBarcode;
                        if(!$scope.filterModel.isWeight) {
                            if(parseInt(results.data.statusCode) >= 200 && parseInt(results.data.statusCode) <= 299) {
                                if(results.data.result) {
                                    $scope.filterModel.weight = results.data.result[0].qtyReserved;
                                } else {
                                    $scope.filterModel.weight = null;
                                }
                            }
                        } else {
                            $scope.filterModel.weight = results.data.weight;
                        }
                        $scope.reserveProductLocation();
                    }
                }, function error(response) {});
            };

            $scope.reserveProductLocation = function () {
                $scope.filterModel.ownerID = $scope.filterModel.ownerId;
                $scope.filterModel.callcenterNo = $scope.filterModel.callCenterNo;
                $scope.filterModel.plangoodsissueNo = $scope.filterModel.planGoodsIssueNo;
                $scope.filterModel.productBarcode = $scope.filterModel.productConversionBarcode;
                viewModel.reserveProductLocation($scope.filterModel).then(function success(results) {
                    if(parseInt(results.data.statusCode) >= 200 && parseInt(results.data.statusCode) <= 299) {
                        $scope.getList();
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error.',
                            message: results.data.statusDesc
                        });
                    }
                }, function error(response) {});
            }

            $scope.clearReserveProductLocation = function (param) {
                param.productConversionID = param.productConversionId;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do You Want To Delete This Item ?'
                }).then(function () {
                    viewModel.clearReserveProductLocation(param).then(function success(results) {
                        if(results.data.statusCode != "200") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Error.',
                                message: results.data.statusDesc
                            });
                        } else {
                            $scope.getList();
                        }
                    }, function error(response) {});
                });                
            };

            $scope.popupReasonCode = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupReasonCode.onShow = !$scope.popupReasonCode.onShow;
                    console.log($scope.filterModel, index);
                    $scope.popupReasonCode.delegates.reasonCodePopup($scope.filterModel, index);
                },
                config: {
                    title: "ResonCode"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param, model) {
                        $scope.filterModel.ReasonCodeIndex = angular.copy(param[0].reasonCodeIndex);
                        $scope.filterModel.ReasonCodeId = angular.copy(param[0].reasonCodeId);
                        $scope.filterModel.ReasonCodeName = angular.copy(param[0].reasonCodeName);

                        if ($scope.CloseCall != 1) {
                            if($scope.filterModel.button == "confirm") {
                                $scope.filterModel.IsAccept = true;
                                $scope.add();
                            } else if($scope.filterModel.button == "cancel") {
                                $scope.filterModel.IsDissmiss = true;
                                $scope.cancel();
                            }
                        }
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
                    }
                }
            };
            $scope.popupWarehouseTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouseTo.onShow = !$scope.popupWarehouseTo.onShow;
                    $scope.popupWarehouseTo.delegates.warehouseToPopup(param, index);
                },
                config: {
                    title: "WarehouseTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndexTo = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseIdTo = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseNameTo = angular.copy(param.warehouseName);
                    }
                }
            };
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

                    }
                }
            };

            $scope.popupSoldTo = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.ownerIndex != null) {
                        index = $scope.filterModel.ownerIndex;
                    };
                    $scope.popupSoldTo.onShow = !$scope.popupSoldTo.onShow;
                    $scope.popupSoldTo.delegates.soldToPopup(index);
                },
                config: {
                    title: "SoldTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.soldToIndex = angular.copy(param.soldToIndex);
                        $scope.filterModel.soldToId = angular.copy(param.soldToId);
                        $scope.filterModel.soldToName = angular.copy(param.soldToName);
                        $scope.filterModel.soldToAddress = angular.copy(param.soldToAddress);

                    }
                }
            };

            $scope.popupShipTo = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.soldToIndex != null) {
                        index = $scope.filterModel.soldToIndex;
                    };

                    $scope.popupShipTo.onShow = !$scope.popupShipTo.onShow;
                    $scope.popupShipTo.delegates.shipToPopup(index);
                },
                config: {
                    title: "shipTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.shipToIndex = angular.copy(param.shipToIndex);
                        $scope.filterModel.shipToId = angular.copy(param.shipToId);
                        $scope.filterModel.shipToName = angular.copy(param.shipToName);
                        $scope.filterModel.shipToAddress = angular.copy(param.shipToAddress);

                    }
                }
            };

            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, index);
                },
                config: {
                    title: "DocumentType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                        $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                        $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                    }
                }
            };

            $scope.popupRound = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRound.onShow = !$scope.popupRound.onShow;
                    $scope.popupRound.delegates.roundPopup(param, index);
                },
                config: {
                    title: "Round"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.roundIndex = angular.copy(param.roundIndex);
                        $scope.filterModel.roundId = angular.copy(param.roundId);
                        $scope.filterModel.roundName = angular.copy(param.roundName);

                    }
                }
            };

            $scope.popupRoute = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRoute.onShow = !$scope.popupRoute.onShow;
                    $scope.popupRoute.delegates.routePopup(param, index);
                },
                config: {
                    title: "Route"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.routeIndex = angular.copy(param.routeIndex);
                        $scope.filterModel.routeId = angular.copy(param.routeId);
                        $scope.filterModel.routeName = angular.copy(param.routeName);

                    }
                }
            };

            $scope.getColor = function(fulfilled, unfulfilled, isSubstituteOrder, qty) {                
                if(isSubstituteOrder) {
                    // yellow
                    return "#F1E46F"; 
                // } else if(fulfilled == qty) {
                //     // green
                //     return "#B6EA97";
                // } else if(fulfilled != qty) {
                //     // red
                //     return "#EA9797";
                // }
                } else if(unfulfilled == 0) {
                    // green
                    return "#B6EA97";
                } else if(unfulfilled != 0 || unfulfilled > 0) {
                    // red
                    return "#EA9797";
                }
            }



            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.goodsReceiveDate = getToday()
                $scope.userName = localStorageService.get('userTokenStorage');
            };



            init();

        }
    })
})();