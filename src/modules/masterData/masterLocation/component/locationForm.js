(function () {
    'use strict'

    app.component('locationForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterLocation/component/locationForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, locationFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = locationFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;   
                    viewModel.getId(param.locationIndex).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data[0];
                        $scope.update = true;
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
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

            $scope.add = function () {
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
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
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();
                            Add(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                });
                $scope.filterModel = {};
            }

            $scope.edit = function () {
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
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
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();
                            Edit(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                });
                defer.resolve();
            }

            $scope.back = function () {
                defer.resolve('1');
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.warehouseName == undefined) {
                    msg = ' Warehouse is required !'
                    defer.resolve(msg);
                } 
                else if (param.roomName == null){
                    msg = ' Room is required !'
                    defer.resolve(msg);
                }

                else if (param.locationTypeName == null){
                    msg = ' LocationType is required !'
                    defer.resolve(msg);
                }
                else if (param.locationAisleName == null){
                    msg = ' LocationAisle is required !'
                    defer.resolve(msg);
                }
                else if (param.locationName == null){
                    msg = ' LocationName is required !'
                    defer.resolve(msg);
                }
                else if (param.locationBay == null){
                    msg = ' LocationBay is required !'
                    defer.resolve(msg);
                }
                else if (param.locationDepth == null){
                    msg = ' LocationDepth is required !'
                    defer.resolve(msg);
                }
                else if (param.locationLevel == null){
                    msg = ' LocationLevel is required !'
                    defer.resolve(msg);
                }
                else if (param.maxQty == null){
                    msg = ' MaxQty is required !'
                    defer.resolve(msg);
                }
                else if (param.maxWeight == null){
                    msg = ' MaxWeight is required !'
                    defer.resolve(msg);
                }
                else if (param.maxVolume == null){
                    msg = ' MaxVolume is required !'
                    defer.resolve(msg);
                }
                else if (param.maxPallet == null){
                    msg = ' MaxPallet is required !'
                    defer.resolve(msg);
                }
                else if (param.putAwaySeq == null){
                    msg = ' PutAwaySeq is required !'
                    defer.resolve(msg);
                }
                else if (param.pickingSeq == null){
                    msg = ' PickingSeq is required !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };
            function Add(param) {
                let deferred = $q.defer();                
                if (param.roomIndex && param.warehouseIndex != null) {
                    viewModel.add(param).then(
                        function success(results) {
                            deferred.resolve(results);
                        },
                        function error(response) {
                            deferred.reject(response);
                        }
                    );
                } 

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
            // POPUP

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
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseId) + " - " + angular.copy(param.warehouseName);

                        localStorageService.set('warehouseVariableId', angular.copy(param.warehouseId));
                        localStorageService.set('warehouseVariableIndex', angular.copy(param.warehouseIndex));
                        localStorageService.set('warehouseVariableName', angular.copy(param.warehouseName));
                    }
                }
            };

            $scope.popupRoom = {
                onShow: false,
                delegates: {},
                onClick: function (index) {                    
                    if($scope.filterModel.warehouseIndex != null){
                        index = $scope.filterModel.warehouseIndex;
                    };
                    $scope.popupRoom.onShow = !$scope.popupRoom.onShow;
                    $scope.popupRoom.delegates.roomPopup(index);
                },
                config: {
                    title: "Room"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.roomIndex = angular.copy(param.roomIndex);
                        $scope.filterModel.roomId = angular.copy(param.roomId);
                        $scope.filterModel.roomName = angular.copy(param.roomId) + " - " + angular.copy(param.roomName);

                    }
                }
            };

            $scope.popupLocationType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupLocationType.onShow = !$scope.popupLocationType.onShow;
                    $scope.popupLocationType.delegates.locationTypePopup(param, index);
                },
                config: {
                    title: "Location Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.locationTypeIndex = angular.copy(param.locationTypeIndex);
                        $scope.filterModel.locationTypeId = angular.copy(param.locationTypeId);
                        $scope.filterModel.locationTypeName = angular.copy(param.locationTypeId) + " - " + angular.copy(param.locationTypeName);

                    }
                }
            };

            $scope.popuplocationLock = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popuplocationLock.onShow = !$scope.popuplocationLock.onShow;
                    $scope.popuplocationLock.delegates.locationLockPopup(param, index);
                },
                config: {
                    title: "Location Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.locationAisleIndex = angular.copy(param.locationAisleIndex);
                        $scope.filterModel.locationAisleId = angular.copy(param.locationLockId);
                        $scope.filterModel.locationAisleName = angular.copy(param.locationLockId) + " - " + angular.copy(param.locationLockName);

                    }
                }
            };

            var init = function () {

                $scope.filterModel = {};
            };
            init();
        }
    })
})();