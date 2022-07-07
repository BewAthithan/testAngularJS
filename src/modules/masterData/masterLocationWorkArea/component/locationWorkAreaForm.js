(function () {
    'use strict'

    app.component('locationWorkAreaForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterlocationWorkArea/component/locationWorkAreaForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, locationWorkAreaFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = locationWorkAreaFactory;
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
                    viewModel.getId(param.locationWorkAreaIndex).then(function (res) {
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
                            Add(model).then(function success(res) {
                                $vm.filterModel = res.config.data;
                                $vm.searchResultModel = res.config.data;
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
                            Edit(model).then(function success(res) {
                                $vm.filterModel = res.config.data;
                                $vm.searchResultModel = res.config.data;
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });
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
                //var dataList = $scope.$parent.$vm.searchResultModel;
                // for (var i = 0; i <= dataList.length - 1; i++) {
                //     if (param.locationIndex == dataList[i].locationIndex && param.workAreaIndex == dataList[i].workAreaIndex) {
                //         if (param.locationIndex == dataList[i].locationIndex) {
                //             msg = 'Location' + " " + param.locationName + ' Dupicated ! Choose New Location'
                //             defer.resolve(msg);
                //         }
                //         if (param.workAreaIndex == dataList[i].workAreaIndex) {
                //             msg = 'WorkArea' + " " + param.workArea + ' Dupicated ! Choose New WorkArea'
                //             defer.resolve(msg);
                //         }
                //     }
                // }

                if (param.locationName == undefined) {
                    msg = ' Location is required !'
                    defer.resolve(msg);
                }
                else if (param.workAreaName == null) {
                    msg = ' WorkArea is required !'
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
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            // POPUP

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

            $scope.popupWorkArea = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWorkArea.onShow = !$scope.popupWorkArea.onShow;
                    $scope.popupWorkArea.delegates.workAreaPopup(param, index);
                },
                config: {
                    title: "workArea"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.workAreaIndex = angular.copy(param.workAreaIndex);
                        $scope.filterModel.workAreaId = angular.copy(param.workAreaId);
                        $scope.filterModel.workAreaName = angular.copy(param.workAreaId) + " - " + angular.copy(param.workAreaName);

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