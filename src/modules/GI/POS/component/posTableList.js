'use strict'
app.component('posTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/POS/component/posTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsIssueFactory, posFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = posFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
        }



        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.editItem = function (param) {
            viewModel.checkUser(param.posIndex).then(function (res) {
                if (res.data == "" || res.data == undefined
                    || res.data == null || res.data == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    viewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {

                                if (result == '1') {
                                    $vm.filterModel.chkinitpage = true;
                                    $vm.triggerSearch();
                                    $vm.isFilter = true;
                                }
                                else {
                                    $vm.isFilter = true;
                                }

                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    });
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        param.UserAssign = $scope.userName;
                        viewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                $scope.onShow(param).then(function (result) {

                                    if (result == '1') {
                                        $vm.filterModel.chkinitpage = true;
                                        $vm.triggerSearch();
                                        $vm.isFilter = true;
                                    }
                                    else {
                                        $vm.isFilter = true;
                                    }

                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }, function error(res) { });
                    });
                }
            });


            // if ($scope.onShow) {
            //     $vm.isFilter = false;
            //     $scope.onShow(param).then(function (result) {

            //         if (result == '1') {
            //             $vm.filterModel.chkinitpage = true;
            //             $vm.triggerSearch();
            //             $vm.isFilter = true;
            //         }
            //         else {
            //             $vm.isFilter = true;
            //         }

            //     }).catch(function (error) {
            //         defer.reject({ 'Message': error });
            //     });
            // }
        }


        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.planGoodsIssueIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };






        function validate(param) {
            var msg = "";
            return msg;
        }

        var MessageBox = dpMessageBox;



        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }

        // coload toggle
        $scope.showCoload = false;

        $scope.changeTableSize = function () {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
        };


        $scope.changePage = function () {
            var page = $vm.filterModel;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            $scope.serchPage(page);
        }

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];

        $scope.serchPage = function (param) {
            posFactory.filter(param).then(function success(res) {
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.searchResultModel = res.data.items;

            }, function error(res) { });
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        var initForm = function () {
        };
        var init = function () {
        };
        init();

    }
});