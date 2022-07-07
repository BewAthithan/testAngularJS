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
        controller: function ($scope, $q, pageLoading, dpMessageBox, callCenterFactory, callCenterItemFactory, localStorageService, $state) {
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

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            }
            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
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

                        callCenterItemFactory.getByCallCenterId(param.callCenterIndex).then(function (res) {
                            $scope.filterModel.listCallCenterItemViewModel = res.data;

                        });
                    });
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
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

            $scope.back = function () {
                $scope.filterModel = {};
                defer.resolve('-99');
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

                var model = $scope.filterModel;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    
                    Add(model).then(function success(res) {
                        
                        // $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                        // $state.reload();
                        defer.resolve('1');
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });

                    });
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

                $scope.filterModel = {};
                defer.resolve('1');
            }

            
            $scope.back = function () {

                var model = $scope.filterModel;
                if (model.callCenterIndex != undefined) {
                    viewModel.resetUser(model.callCenterIndex).then(function (res) {
                        $scope.filterModel = {};
                        defer.resolve('1');
                    });
                }
                else {
                    $scope.filterModel = {};
                    defer.resolve('1');
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

                        localStorageService.set('warehouseVariableId', angular.copy(param.warehouseId));
                        localStorageService.set('warehouseVariableIndex', angular.copy(param.warehouseIndex));
                        localStorageService.set('warehouseVariableName', angular.copy(param.warehouseName));
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

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));

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

            $scope.getColor = function(marshal,replace,shortpick,documentStatus) {
                
                if(replace == 1 && marshal != 0)
                {
                    return "rgb(248, 175, 255)"; 
                    // rgb(228, 3, 248)
                }
                else if(shortpick == 1)
                {
                    return "rgb(255, 185, 119)";
                    // rgb(245, 122, 7)
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