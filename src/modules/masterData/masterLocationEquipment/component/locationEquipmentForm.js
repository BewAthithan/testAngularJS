(function () {
    'use strict'

    app.component('locationEquipmentForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, commonService) {
            return "modules/masterData/masterLocationEquipment/component/locationEquipmentForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, pageLoading, $state, $timeout, $translate, dpMessageBox, locationEquipmentFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = locationEquipmentFactory;
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
                    viewModel.getId(param.locationEquipmentIndex).then(function (res) {
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
            $scope.back = function () {
                defer.resolve('1');
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";                
                if (param.locationName == undefined) {
                    msg = ' Location is required !'
                    defer.resolve(msg);
                }
                else if (param.equipmentName == null){
                    msg = ' Equipment is required !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }
            $scope.popupLocation = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupLocation.onShow = !$scope.popupLocation.onShow;
                    $scope.popupLocation.delegates.locationPopup(param, index);
                },
                config: {
                    title: "Location"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.locationIndex = angular.copy(param.locationIndex);
                        $scope.filterModel.locationId = angular.copy(param.locationId);
                        $scope.filterModel.locationName = angular.copy(param.locationId) + " - " + angular.copy(param.locationName);

                    }
                }
            };
            $scope.popupEquipment = {
                onShow: false,
                delegates: {},
                onClick: function (index) {                
                    $scope.popupEquipment.onShow = !$scope.popupEquipment.onShow;
                    $scope.popupEquipment.delegates.equipmentPopup(index);
                },
                config: {
                    title: "Equipment"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.equipmentIndex = angular.copy(param.equipmentIndex);
                        $scope.filterModel.equipmentId = angular.copy(param.equipmentId);
                        $scope.filterModel.equipmentName = angular.copy(param.equipmentId) + " - " + angular.copy(param.equipmentName);
                    }
                }
            };
            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
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
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            
            var init = function () {
                $scope.filterModel = {};
            };
            init();
        }
    })
})();