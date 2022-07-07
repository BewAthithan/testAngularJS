'use strict'
app.component('locationEquipmentTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterLocationEquipment/component/locationEquipmentTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $http, pageLoading, $state, localStorageService, $timeout, $translate, dpMessageBox,locationEquipmentFactory) {
        var $vm = this
        var viewModel = locationEquipmentFactory;
        $scope.items = [];
        $scope.items = $scope.items || [];
        // setting column
        $scope.showColumnSetting = false;
        

        $vm.triggerCreate = function () {
            if($scope.onShow)
            {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
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

        $scope.changePage = function () {            
            //$vm.filterModel.productIndex = ($vm.filterModel.productId === undefined || $vm.filterModel.productName == "") ? $vm.filterModel.productIndex = "" : $vm.filterModel.productIndex;   
            var page = $vm.filterModel;
            
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }

        $scope.changeTableSize = function () {
            let ChangeTable = 1;
            if ($scope.model.numPerPage == undefined) {
                $scope.model.numPerPage = $vm.filterModel.perPage;
            }
            // var p = {
            //     currentPage: ChangeTable,
            //     numPerPage: $vm.filterModel.perPage
            // };

            var p = $vm.filterModel;

            serchPage(p);
        }

        $vm.filterModel = {
            num: 1,
            maxSize: 5,
            currentPage: $vm.filterModel.perPage,
            columnName: $vm.filterModel.columnName,
            orderBy: $vm.filterModel.orderBy
        };

        function serchPage(data) {
            if (data != null) {
                
                pageLoading.show();
                viewModel.search(data).then(function (res) {
                    
                    pageLoading.hide();
                    if (res.data.items.length != 0 && res.data.items.length != undefined) {
                        
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.items;
                    }
                    else {
                        if (res.data.pagination != null) {                                                       
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.items;

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
                viewModel.getDelete(param.locationEquipmentIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
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
        var init = function () {
            
        };
        init();

    }
});