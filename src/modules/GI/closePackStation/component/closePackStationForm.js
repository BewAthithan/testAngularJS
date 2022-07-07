(function () {
    'use strict'

    app.component('closePackStationForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/closePackStation/component/closePackStationForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, closePackStationFactory, planGoodsIssueItemFactory) {
            var $vm = this;

            var defer = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            var viewModel = closePackStationFactory;



            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.selected = 1;
                $scope.click = 1;
                $scope.filterModel.planGoodsIssueDate = getToday();
                $scope.filterModel.planGoodsIssueDueDate = getToday();
            }

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $vm.onShow = function (param) {
                $scope.filterModel = {};
                $scope.filterModel.documentStatus = 0;
                $scope.filterModel.planGoodsIssueDate = getToday();
                $scope.filterModel.planGoodsIssueDueDate = getToday();
                defer = $q.defer();

                $scope.onShow = true;
                if (param != undefined) {
                    viewModel.getId(param.planGoodsIssueIndex).then(function (res) {

                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == -1)
                            $scope.buttons.update = false;

                        planGoodsIssueItemFactory.getByPlanGoodIssueId(param.planGoodsIssueIndex).then(function (res) {
                            $scope.filterModel.listPlanGoodIssueViewModelItem = res.data;
                        });
                        planGoodsIssueItemFactory.getGoodsIssueItem(param.planGoodsIssueIndex).then(function (res) {
                            $scope.filterModel.listGoodIssueItemViewModel = res.data;
                        });
                        planGoodsIssueItemFactory.getRemainQty(param.planGoodsIssueIndex).then(function (res) {
                            $scope.filterModel.listRemainQtyViewModel = res.data;
                        });
                        //console.log(res);
                    });
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;
                });
            };



            $vm.addItem = function (param, index) {

                var owner = $scope.filterModel.ownerIndex
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listPlanGoodIssueViewModelItem = $scope.filterModel.listPlanGoodIssueViewModelItem || []
                        if (result != '-99') {
                            if (result.planGoodsIssueIndex == undefined)
                                result.flagUpdate = true;
                            $scope.filterModel.listPlanGoodIssueViewModelItem.push(angular.copy(result));
                        }

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            $scope.editItem = function (param, index, owner) {
                var owner = $scope.filterModel.ownerIndex;
                
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listPlanGoodIssueViewModelItem[result.index] = result;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }
            $scope.deleteItem = function (param, index, model) {
                if (model.documentStatus != 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "เอกสารได้รับการยืนยันไปแล้ว ไม่สามารถทำการยกเลิกได้"
                    })
                }
                else {
                    param.splice(index, 1);
                    if (param.length > 0) {
                        for (var i = 0; i <= param.length - 1; i++) {
                            param[i].isDelete = 1;
                        }
                    }
                }
            }

            $scope.add = function () {
                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listPlanGoodIssueViewModelItem;

                if (model.ownerName == undefined || model.ownerName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Owner !'
                        }
                    )
                    return "";
                }
                if (model.soldToName == undefined || model.soldToName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose SoldTo !'
                        }
                    )
                    return "";
                }
                if (model.shipToName == undefined || model.shipToName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose ShipTo !'
                        }
                    )
                    return "";
                }
                if (model.documentTypeName == undefined || model.documentTypeName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose PlanGI Type !'
                        }
                    )
                    return "";
                }
                if (model.routeName == undefined || model.routeName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Route !'
                        }
                    )
                    return "";
                }
                if (model.roundName == undefined || model.roundName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Round !'
                        }
                    )
                    return "";
                }
                if (model.warehouseName == undefined || model.warehouseName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose From Warehouse !'
                        }
                    )
                    return "";
                }
                // if (model.warehouseNameTo == undefined || model.warehouseNameTo == "") {                    
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'Validate',
                //             message: 'Please Choose To Warehouse !'
                //         }
                //     )
                //     return "";
                // }   
                if (listmodel == undefined || listmodel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    Add(model).then(function success(res) {
                        $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                        $state.reload($state.current.name);
                    }, function error(param) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ไม่สามารถ Save ได้"
                        })
                    });
                    defer.resolve();
                });

            }

            $scope.edit = function () {
                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listPlanGoodIssueViewModelItem;

                if (model.ownerName == undefined || model.ownerName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Owner !'
                        }
                    )
                    return "";
                }
                if (model.soldToName == undefined || model.soldToName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose SoldTo !'
                        }
                    )
                    return "";
                }
                if (model.shipToName == undefined || model.shipToName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose ShipTo !'
                        }
                    )
                    return "";
                }
                if (model.documentTypeName == undefined || model.documentTypeName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose PlanGI Type !'
                        }
                    )
                    return "";
                }
                if (model.routeName == undefined || model.routeName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Route !'
                        }
                    )
                    return "";
                }
                if (model.roundName == undefined || model.roundName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Round !'
                        }
                    )
                    return "";
                }
                if (listmodel == undefined || listmodel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    viewModel.getId(model.planGoodsIssueIndex).then(function (res) {
                        if (res.data.userAssign != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })
                            $state.reload();
                        }
                        else {
                            Edit(model).then(function success(res) {
                                $vm.filterModel = res.config.data;
                                $vm.searchResultModel = res.config.data;
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        }
                    });
                });
                defer.resolve();
            }

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };


            function Add(param) {
                let deferred = $q.defer();
                param.createBy = localStorageService.get('userTokenStorage');
                let item = $scope.filterModels();
                item = param;
                viewModel.add(item).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                )
                return deferred.promise;

            }
            function Edit(param) {
                var deferred = $q.defer();
                param.updateBy = localStorageService.get('userTokenStorage');
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


            $scope.back = function () {

                var model = $scope.filterModel;
                if (model.planGoodsIssueIndex != undefined) {
                    viewModel.resetUser(model.planGoodsIssueIndex).then(function (res) {

                        $scope.filterModel = {};
                        $scope.filterModel.planGoodsIssueDate = getToday();
                        $scope.filterModel.planGoodsIssueDueDate = getToday();
                        defer.resolve();
                    });
                }
                else {
                    defer.resolve();
                }


            }

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
                    document.getElementById("pack_station_input").focus();
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
                        document.getElementById("pack_station_input").focus();
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

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }




        }
    })
})();