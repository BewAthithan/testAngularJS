'use strict'
app.component('cyclecountTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/Tranfer/Cyclecount/component/CyclecountTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, cyclecountFactory) {
        var $vm = this;
        $scope.items = $scope.items || [];
        var viewModel = cyclecountFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: $vm.filterModel.numPerPage,
                num: 1,
                maxSize: 2,
                perPage: 20,
                change: function () {
                    $vm.filterModel.currentPage = this.currentPage - 1;
                    if ($vm.triggerSearch) {
                        $vm.triggerSearch();
                    }
                },
                changeSize: function () {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    $vm.triggerSearch();
                }
            }
            $scope.userName = localStorageService.get('userTokenStorage');

        }


        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.triggerSearch();
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };


        $scope.edit = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.triggerSearch();
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.delete = function (param) {
            param.cancel_By =  $scope.userName;

            viewModel.getDelete(param).then(function success(res) {
                $vm.triggerSearch();
                if (res.data == true) {
                    dpMessageBox.alert({
                        ok: 'OK',
                        title: 'InformaTion',
                        message: 'Delete success',
                    })
                }
                else{
                    dpMessageBox.alert({
                        ok: 'OK',
                        title: 'InformaTion',
                        message: 'ไม่สามารถลบข้อมูลได้',
                    })
                }
            }, function error(res) {
                dpMessageBox.alert({
                    ok: 'OK',
                    title: 'InformaTion',
                    message: 'ไม่สามารถลบข้อมูลได้',
                })
             });
        };


        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };
        // coload toggle
        $scope.showCoload = false;

        $scope.changeTableSize = function () {
            debugger
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

        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.serchPage = function (param) {
            viewModel.filter(param).then(function success(res) {
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.searchResultModel = res.data.items;

            }, function error(res) { });
        }

        var init = function () {
        };
        init();

    }
});