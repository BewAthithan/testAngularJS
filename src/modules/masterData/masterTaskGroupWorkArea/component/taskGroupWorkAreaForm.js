(function () {
    'use strict'

    app.component('taskGroupWorkAreaForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterTaskGroupWorkArea/component/taskGroupWorkAreaForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, taskGroupWorkAreaFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = taskGroupWorkAreaFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if($scope.filterModel != null){
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;  
                    viewModel.getId(param.taskGroupWorkAreaIndex).then(function (res) {
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
            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
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
                if (param.taskGroupName == undefined) {
                    msg = ' TaskGroup is required !'
                    defer.resolve(msg);
                } 
                else if (param.workAreaName == null){
                    msg = ' WorkArea is required !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            function Add(param) {
                let deferred = $q.defer();
                let item = param;
                viewModel.add(item).then(
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

            $scope.popupTaskGroup= {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    
                    $scope.popupTaskGroup.onShow = !$scope.popupTaskGroup.onShow;
                    $scope.popupTaskGroup.delegates.taskGroupPopup(param, index);
                },
                config: {
                    title: "TaskGroup"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.taskGroupIndex = angular.copy(param.taskGroupIndex);
                        $scope.filterModel.taskGroupId = angular.copy(param.taskGroupId);
                        $scope.filterModel.taskGroupName = angular.copy(param.taskGroupId) +  " - " + angular.copy(param.taskGroupName);

                    }
                }
            };

            $scope.popupWorkArea= {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWorkArea.onShow = !$scope.popupWorkArea.onShow;
                    $scope.popupWorkArea.delegates.workAreaPopup(param, index);
                },
                config: {
                    title: "WorkArea"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.workAreaIndex = angular.copy(param.workAreaIndex);
                        $scope.filterModel.workAreaId = angular.copy(param.workAreaId);
                        $scope.filterModel.workAreaName = angular.copy(param.workAreaId) +  " - " + angular.copy(param.workAreaName);

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