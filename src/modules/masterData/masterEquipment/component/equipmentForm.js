(function () {
    'use strict'

    app.component('masterEquipmentForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterEquipment/component/equipmentForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, equipmentFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = equipmentFactory;
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
                    viewModel.getId(param).then(function (res) {
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
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.equipmentName == null) {
                    msg = ' Equipment Name is required !'
                    defer.resolve(msg);
                }
                else if (param.equipmentTypeName == null) {
                    msg = ' EquipmentType is required !'
                    defer.resolve(msg);
                }
                else if (param.equipmentSubTypeName == null) {
                    msg = ' EquipmentSubType is required !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }
            $scope.back = function () {
                defer.resolve('');
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

            function Add(param) {
                let deferred = $q.defer();
                viewModel.add(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            function Edit(param) {
                var deferred = $q.defer();
                viewModel.edit(param).then(
                    function success(results) {
                        $state.reload($state.current.name);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.popupEquipmentType = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    $scope.popupEquipmentType.onShow = !$scope.popupEquipmentType.onShow;
                    $scope.popupEquipmentType.delegates.equipmentTypePopup(index);
                },
                config: {
                    title: "Equipment Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.equipmentTypeIndex = angular.copy(param.equipmentTypeIndex);
                        $scope.filterModel.equipmentTypeId = angular.copy(param.equipmentTypeId);
                        $scope.filterModel.equipmentTypeName = angular.copy(param.equipmentTypeId) + " - " + angular.copy(param.equipmentTypeName);
                    }
                }
            };

            $scope.popupEquipmentSubType = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.equipmentTypeIndex != null) {
                        index = $scope.filterModel.equipmentTypeIndex;
                    };
                    $scope.popupEquipmentSubType.onShow = !$scope.popupEquipmentSubType.onShow;
                    $scope.popupEquipmentSubType.delegates.equipmentSubTypePopup(index);
                },
                config: {
                    title: "Equipment SubType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.equipmentSubTypeIndex = angular.copy(param.equipmentSubTypeIndex);
                        $scope.filterModel.equipmentSubTypeId = angular.copy(param.equipmentSubTypeId);
                        $scope.filterModel.equipmentSubTypeName = angular.copy(param.equipmentSubTypeId) + " - " + angular.copy(param.equipmentSubTypeName);
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