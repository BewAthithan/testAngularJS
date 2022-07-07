(function () {
    'use strict'

    app.component('locationStockDetail', {
        controllerAs: '$vm',
        templateUrl: "modules/Inquiry/Location/component/locationStockDetail.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isStock: '=?',
            locationTemp: '=?',
            locationStock: '=?'


        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, inquiryLocationFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = inquiryLocationFactory;
            $scope.isStock = false;
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $scope.m = {};
            $vm.isStock = function (param) {    
                            
                defer = $q.defer();
                $scope.isStock = true;
                $scope.isLoading = false;
                $scope.m.locationName = param[0].locationName;
                 $scope.m.currentPage = 1;
                $scope.m.perPage = 30;
                viewModel.GetStockDetails($scope.m).then(function success(res) {                    
                    $vm.locationStock = res.data.items;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.filterModel.maxSize = 5;
                    $vm.locationTemp = $vm.locationStock[0].locationName;
                }, function error(res) { });
                return defer.promise;
            };
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }
            
            $scope.filterSearch = function () {
                
                $vm.filterModel.locationName = ($vm.locationStock === undefined || $vm.locationStock == "") ? $vm.locationTemp : $vm.locationStock[0].locationName ;
                viewModel.GetStockDetails($vm.filterModel).then(function success(res) {
                    $vm.locationStock = res.data.items;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.filterModel.maxSize = 5;



                }, function error(res) { });
            }



            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.selected = 1;
                $scope.click = 1;
                $scope.userName = localStorageService.get('userTokenStorage');

            };

            $scope.pageOption = [
                { value: 30 },
                { value: 50 },
                { value: 100 },
                { value: 500 }
            ];

            
            // $vm.filterModel = {
            //     num: 1,
            //     totalRow: 0,
            //     currentPage: 1,
            //     maxSize: 5,
            //     perPage: $vm.filterModel.perPage,
            // };

            $scope.back = function () {
                $scope.isStock = false;
                defer.resolve('-99');
            
            }

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

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
                serchPage(page);
            }
            function serchPage(data) {       
                     
                if (data != null) {
                    
                    pageLoading.show();
                    $scope.filterModel = $scope.filterModel || {};
                    data.locationName = ($vm.locationStock === undefined || $vm.locationStock == "") ? $vm.locationTemp : $vm.locationStock[0].locationName;                   
                    viewModel.GetStockDetails(data).then(function (res) {
                        pageLoading.hide();
                        
                        if (res.data.length != 0 && res.data.length != undefined) {
                            $vm.filterModel.totalRow = res.data[0].count;
                            $vm.locationStock = res.data.items;
    
                        }
                        else {
                            
                            if (res.data.pagination != null) {
                                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                                $vm.locationStock = res.data.items;
    
                            }
                        }
                    })
                }
            }
            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

           

            var init = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                

            };
            init();
        }
    })
})();