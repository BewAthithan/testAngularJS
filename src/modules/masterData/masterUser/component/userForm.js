(function () {
    'use strict'
    app.component('userForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterUser/component/userForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, userFactory) {
            var $vm = this;
            $scope.onShow = false;

            var defer = {};
            var viewModel = userFactory;
            $scope.isShowPass = true;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            document.getElementById("myInput").disabled = false;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.getId(param.userIndex).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data[0];
                        $scope.update = true;

                        var data = document.getElementById("myInput");
                        document.getElementById("myInput").disabled = true;
                        if (data.type === "text") {
                            data.type = "password";
                        }
                        $scope.isResetPass = true;
                        $scope.isShowPass = false;
                    });
                }
                else {
                    var data = document.getElementById("myInput");
                    document.getElementById("myInput").disabled = false;
                    $scope.isResetPass = false;
                    $scope.isShowPass = true;
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
                if (param.userName == undefined) {
                    msg = ' UserName is required !'
                    defer.resolve(msg);
                }
                else if (param.userGroupName == null){
                    msg = ' UserGroup is required !'
                    defer.resolve(msg);
                }
                else if (param.userPassword == null){
                    msg = ' UserPassword is required !'
                    defer.resolve(msg);
                }

                defer.resolve(msg);

                return defer.promise;
            }

            $scope.back = function () {
                defer.resolve('1');
            }
            $scope.isResetPassword = function () {
                $scope.filterModel.userPassword = null;
                $scope.isShowPass = true;
                $scope.isResetPass = false;
                var data = document.getElementById("myInput");
                data.disabled = false;
                data.type = "text";
                $scope.showPassword();
            }
            $scope.showPassword = function () {                
                var data = document.getElementById("myInput");
                if (data.type === "password") {
                    data.type = "text";
                }
                else {
                    data.type = "password";
                }
            }
            $scope.popupUserGroup = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupUserGroup.onShow = !$scope.popupUserGroup.onShow;
                    $scope.popupUserGroup.delegates.userGroupPopup(param, index);
                },
                config: {
                    title: "User"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.userGroupIndex = angular.copy(param.userGroupIndex);
                        $scope.filterModel.userGroupId = angular.copy(param.userGroupId);
                        $scope.filterModel.userGroupName = angular.copy(param.userGroupId) + " - " + angular.copy(param.userGroupName);
                    }
                }
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