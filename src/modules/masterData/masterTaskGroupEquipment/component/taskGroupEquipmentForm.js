(function () {
    'use strict'

    app.component('taskGroupEquipmentForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterTaskGroupEquipment/component/taskGroupEquipmentForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, taskGroupEquipment) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = taskGroupEquipment;
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
                    viewModel.getId(param.taskGroupEquipmentIndex).then(function (res) {
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

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

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

            $scope.popupEquipment= {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                    
                    $scope.popupEquipment.onShow = !$scope.popupEquipment.onShow;
                    $scope.popupEquipment.delegates.equipmentPopup(param, index);
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
                        $scope.filterModel.equipmentName = angular.copy(param.equipmentId) +  " - " + angular.copy(param.equipmentName);
                    }
                }
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

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.taskGroupName == undefined) {
                    msg = ' TaskGroup is required !'
                    defer.resolve(msg);
                } 
                else if (param.equipmentName == null){
                    msg = ' Equipment is required !'
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