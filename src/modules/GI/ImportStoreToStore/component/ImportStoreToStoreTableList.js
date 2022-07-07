'use strict'
app.component('importStoreToStoreTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/ImportStoreToStore/component/ImportStoreToStoreTableList.html";
    },
    bindings: {
        isLoading: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchResultModel: '=?',
        pickupFileResultModel: '=?',
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
        var $vm = this;
        $scope.items = $scope.items || [];
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: 1,
                num: 10,
                maxSize: 10,
                perPage: 30,
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
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        // dpMessageBox.confirm({
        //     ok: 'Yes',
        //     cancel: 'No',
        //     title: 'InformaTion',
        //     message: 'Do you want to Cancel ?'
        // }).then(function success() {
        //     param.cancelBy =  localStorageService.get('userTokenStorage');
        //     viewModel.getDelete(param).then(function success(res) {
        //         $vm.triggerSearch();
        //     }, function error(res) { });
        // });

        $scope.show = {
            // action: true,
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
  
        $scope.changeTableSize = function() {
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
            // console.log(param);
            console.log($vm, $vm.pickupFileResultModel);
            let temp = [];
            for(var i = 0; i < param.perPage; i++) {
                temp.push($vm.pickupFileResultModel[i]);
            }
            $vm.searchResultModel = temp;
            // viewModel.planGIsearch(param).then(function success(res) {           
            //     $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //     $vm.filterModel.currentPage = res.data.pagination.currentPage; 
            //     $vm.filterModel.perPage = res.data.pagination.perPage;   
            //     $vm.filterModel.numPerPage = res.data.pagination.perPage;
            // }, function error(res) { });
        }

        var init = function () {};
        init();

    }
});