'use strict'
app.component('soldToShipToTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/masterData/masterSoldToShipTo/component/soldToShipToTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        config: '=?',
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox, soldToShipToFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = soldToShipToFactory;
        // setting column
        $scope.showColumnSetting = false;
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
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }
        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }

        $scope.model = {
            currentPage: $vm.filterModel.currentPage + 1,
            numPerPage: $vm.filterModel.numPerPage,
            totalRow: 0
        };

        // coload toggle
        $scope.showCoload = false;
        $scope.pageOption = [
            {
                'value': 30
            },
            {
                'value': 50
            },
            {
                'value': 100
            },
            {
                'value': 500
            },
        ];

        $scope.changeTableSize = function () {
            let ChangeTable = 1;            
            if ($scope.model.numPerPage == undefined) {
                $scope.model.numPerPage = $vm.filterModel.perPage;
            }
            var p = {
                currentPage: ChangeTable,
                numPerPage: $vm.filterModel.perPage
            };
            serchPage(p);

        }

        $vm.filterModel = {
            num: 1,
            maxSize: 5,
            currentPage: $vm.filterModel.perPage,
            change: function () {
                var page = {
                    currentPage: $vm.filterModel.currentPage - 1,
                    numPerPage: $vm.filterModel.perPage
                };
                var all = {
                    currentPage: 0,
                    numPerPage: 0
                };
                if ($vm.filterModel.currentPage != 0) {
                    page.currentPage = page.currentPage + 1
                }
                serchPage(page);
            }
        };
        function serchPage(data) {

            if (data != null) {
                pageLoading.show();
                viewModel.FilterSoldtoShipTo(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;
                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsSoldToShipTo;
                        }

                    }
                })
            }
        }


        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.soldToShipToIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };
        var init = function () {
            $scope.filterModel = {};
        };
        init();

    }
});