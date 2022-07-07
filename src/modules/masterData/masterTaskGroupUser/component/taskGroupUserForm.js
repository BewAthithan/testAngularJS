(function () {
    'use strict'
    app.component('taskGroupUserForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterTaskGroupUser/component/taskGroupUserForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, taskGroupUserFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = taskGroupUserFactory;
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
                    viewModel.getId(param.taskGroupUserIndex).then(function (res) {
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
            $scope.popupUser= {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                    
                    $scope.popupUser.onShow = !$scope.popupUser.onShow;
                    $scope.popupUser.delegates.userPopup(param, index);                    
                },
                config: {
                    title: "User"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.userIndex = angular.copy(param.userIndex);
                        $scope.filterModel.userId = angular.copy(param.userId);
                        $scope.filterModel.userName = angular.copy(param.userId) +  " - " + angular.copy(param.userName);
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

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.taskGroupName == undefined) {
                    msg = ' TaskGroup is required !'
                    defer.resolve(msg);
                } 
                else if (param.userName == null){
                    msg = ' User is required !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            var init = function () {
                $scope.filterModel = {};
            };
            init();
        }
    })
})();