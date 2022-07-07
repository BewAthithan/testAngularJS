'use strict'
app.component('shipToTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterShipTo/component/shipToTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, dpMessageBox, shipToFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = shipToFactory;
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
                $scope.onShow(param.shipToIndex).then(function (result) {
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
        $scope.pageOption = [{
            'value': 30
        }, {
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
                viewModel.FilterShipTo(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;
                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsShipTo;
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
                viewModel.getDelete(param.shipToIndex).then(function success(res) {
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