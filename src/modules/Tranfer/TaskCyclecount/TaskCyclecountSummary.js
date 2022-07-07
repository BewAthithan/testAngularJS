(function () {
    'use strict'

    app.component('taskcyclecountSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TaskCyclecount/TaskCyclecountSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, taskcyclecountFactory) {
            var $vm = this;

            $vm.isFormTaskCycleCountSummary = true;
            $scope.filterModel = {};
            $scope.model = {};
            var viewModel = taskcyclecountFactory;
            $scope.listTask = {};
            $scope.listAssign = {};
            $scope.smodel = {};

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });


            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }
            $scope.sku = {
                chk: false
            };
            
            $scope.hide = function () {
                $scope.sku.chk = $scope.sku.chk === false ? true : false;
            };
            
            this.$onInit = function () {
                $scope.dropdownTaskGroup();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.model.user = $scope.userName;
                $scope.click = 1;
            }

            $scope.selectData = function (model) {
                model.userAssign = $scope.userName;
                viewModel.find(model).then(
                    function success(res) {
                        if (res.data.message == true) {
                            $vm.isFormTaskCycleCountSummary = false;
                            if ($scope.isCount) {
                                $scope.isCount(model).then(function (result) {
                                    $scope.SearchUser();
                                    $scope.click = 1;
                                    $vm.isFormTaskCycleCountSummary = true;
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }
                        else {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'User นี้มีการ Assign อยู่'
                                }
                            )
                        }
                    },
                    function error(response) {
                    });
            }


            $scope.selectDataAssign = function (model) {
                $vm.isFormTaskCycleCountSummary = false;
                if ($scope.isCount) {
                    $scope.isCount(model).then(function (result) {
                        $vm.isFormTaskCycleCountSummary = true;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }


            $scope.SearchUser = function () {
                $scope.UserModel = {};
                $scope.UserModel.taskGroup_Index = index;


                $scope.dropdownTaskGroup.model = {};

                var TaskGroup = $scope.dropdownTaskGroup
                const resultsTaskGroup = TaskGroup.filter((TaskGroup) => {
                    return TaskGroup.taskGroup_Index == index;
                })
                $scope.dropdownTaskGroup.model = resultsTaskGroup[0];

                $scope.UserModel.user_Name = $scope.userName;
                var deferred = $q.defer();
                viewModel.userfilter($scope.UserModel).then(
                    function success(res) {
                        $scope.filterModel = res.data.result;
                        $scope.listTask = res.data.items;
                        $scope.listAssign = res.data.resultAssign;
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.Scan = function (re1) {
                $scope.smodel = re1;

                if ($scope.dropdownTaskGroup.model != null) {
                    $scope.smodel.taskGroup_Index = $scope.dropdownTaskGroup.model.taskGroup_Index;
                }
                var deferred = $q.defer();
                viewModel.scanSearch($scope.smodel).then(
                    function success(res) {
                        $scope.listTask = res.data.items;
                    },
                    function error(response) {
                    });
                return deferred.promise;

            }
            var index = "";

            $scope.dropdownTaskGroup = function () {
                viewModel.dropdownTaskGroup($scope.filterModel).then(function (res) {
                    $scope.dropdownTaskGroup = res.data;
                    index = res.data[0].taskGroup_Index;
                    $scope.SearchUser();

                });
            };

        }
    })
})();