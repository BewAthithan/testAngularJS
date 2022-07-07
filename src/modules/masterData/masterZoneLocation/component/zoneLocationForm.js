(function () {
    'use strict'

    app.component('zoneLocationForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZoneLocation/component/zoneLocationForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, zoneLocationFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = zoneLocationFactory;
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
                    viewModel.getId(param.zoneLocationIndex).then(function (res) {
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
                var dataList = $scope.$parent.$vm.searchResultModel;
                for (var i = 0; i <= dataList.length - 1; i++) {
                    if (param.locationIndex == dataList[i].locationIndex && param.zoneIndex == dataList[i].zoneIndex) {
                        if (param.locationIndex == dataList[i].locationIndex) {
                            msg = 'Location' + " " + param.locationName + ' Dupicated ! Choose New Location'
                            defer.resolve(msg);
                        }
                        if (param.zoneIndex == dataList[i].zoneIndex) {
                            msg = 'ZoneIndex' + " " + param.zoneIndex + ' Dupicated ! Choose New ZoneIndex'
                            defer.resolve(msg);
                        }
                    }
                }
                if (param.zoneName == undefined) {
                    msg = ' Zone is required !'
                    defer.resolve(msg);
                } 
                else if (param.locationName == null){
                    msg = ' Location is required !'
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
            $scope.popupZone = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZone.onShow = !$scope.popupZone.onShow;
                    $scope.popupZone.delegates.zonePopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.zoneIndex = angular.copy(param.zoneIndex);
                        $scope.filterModel.zoneId = angular.copy(param.zoneId);
                        $scope.filterModel.zoneName = angular.copy(param.zoneId) + " - " + angular.copy(param.zoneName);

                    }
                }
            };

            $scope.popupLocation = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupLocation.onShow = !$scope.popupLocation.onShow;
                    $scope.popupLocation.delegates.locationPopup(param, index);
                },
                config: {
                    title: "location"
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
            var init = function () {
                $scope.filterModel = {};
            };
            init();
        }
    })
})();