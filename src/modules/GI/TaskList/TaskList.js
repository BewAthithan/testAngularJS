'use strict'
app.component('taskList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/TaskList/TaskList.html";
    },
    bindings: {
        isLoading: '=?',
        pickingToolsList: '=?',
        pickingTools: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',        
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, taskListFactory) {
        var $vm = this;
        $scope.items = $scope.items || [];
        var viewModel = taskListFactory;
        var item = $vm.searchResultModel;
        // setting column
        $vm.isLoadingList = {};
        $scope.filterModel = {};
        var defer = {};        
        
        $vm.triggerSearch = function () {
            $vm.filterModel = $vm.filterModel || {};
            viewModel.filter($vm.filterModel).then(function (res) {
                $vm.filterModel = res.data.atcom;
                $vm.searchResultModel = res.data;
            });;
        };      

        $vm.pickingTools = function (items, data) {
            defer = $q.defer();                
            $vm.isLoadingList = $vm.isLoading;
            $vm.isLoading = false;
            if (data.equipmentName != undefined) {
                $scope.filterModel.equipmentName = data.equipmentName;
                // if(data.taskNo != undefined){
                //     CheckTaskId(data);
                // }

            }
            else {
                // $scope.buttons.add = true;
                // $scope.buttons.update = false;
            }
            return defer.promise;
        };

        function CheckTaskId(param) {
            let deferred = $q.defer();
            pageLoading.show();
            viewModel.CheckTaskNo(param).then(
                function success(results) {
                    pageLoading.hide();
                    //รอคำสั่ง ว่าให้ใช้
                    $vm.searchResultModel = results.data;
                    deferred.resolve(results);
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        $scope.selectTask = function () {
            defer.resolve('Selected');
            $vm.isLoading = $vm.isLoadingList;
        }

        $scope.back = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                });
            }

            // $state.go('tops.cart_number_summary', {
            // })
            $vm.isLoading = $vm.isLoadingList;
            defer.resolve();
        }

        $scope.detectCheck = function (item) {
            let isCheck = $vm.searchResultModel;
            for (var i = 0; i <= isCheck.length - 1; i++) {
                if (item.taskNo  == isCheck[i].taskNo && item.locationName == isCheck[i].locationName && item.productName == isCheck[i].productName && item.productConversionName == isCheck[i].productConversionName
                    && item.qty == isCheck[i].qty && item.selected == isCheck[i].selected) {

                    isCheck[i].selected = true;
                }
                else {
                    isCheck[i].selected = false;
                }
            }              
        }

        // $scope.detectCheckAll = function () {
        //     if ($scope.checkAll === true) {
        //         angular.forEach($vm.searchResultModel, function (v, k) {
        //             $vm.searchResultModel[k].selected = true;
        //         });
        //     } else {
        //         angular.forEach($vm.searchResultModel, function (v, k) {
        //             $vm.searchResultModel[k].selected = false;
        //         });
        //     }
        // }
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };

        var init = function () {
        };
        init();

    }
});