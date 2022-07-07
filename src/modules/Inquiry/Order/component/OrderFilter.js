(function () {
    'use strict';
    app.component('inqOrderFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Inquiry/Order/component/OrderFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?',
            resultOrderHistory: '=?',
            resultOrderStatus: '=?',
            orderHistory: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, localStorageService, dpMessageBox, commonService, inquiryOrderFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = inquiryOrderFactory;
            var model = $scope.filterModel;
            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};

            //     // $vm.filterModel.goodsReceiveDate = getToday();
                
            //     viewModel.searchOrderStatus($vm.filterModel).then(function (res) {
                    
            //         pageLoading.hide();

            //         // $scope.filterModel.perPage = $vm.filterModel.perPage;
            //         // $scope.filterModel.currentPage = $vm.filterModel.currentPage;
            //         $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //         $vm.filterModel.currentPage = res.data.pagination.currentPage;
            //         $vm.filterModel.perPage = res.data.pagination.perPage;
            //         $vm.filterModel.numPerPage = res.data.pagination.perPage;
            //         $vm.filterModel.maxSize = 5;
            //         if (res.paginations != null || res.paginations != undefined) {
            //             $vm.filterModel.totalRow = paginations.totalRow;
            //         }
            //         $vm.resultOrderStatus = res.data.items;
            //     });
            // };


            $scope.selectedTab = function (tab) {
                if (tab == 1) {
                    $scope.colortab1 = "#FDFEFE";
                    $scope.colortab2 = "#D3D3D3";
                    $vm.filterModel.selected = 1;
                }
                else if (tab == 2) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#FDFEFE";
                    $vm.filterModel.selected = 2;
                }
                $scope.selected = tab;
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



            // $scope.searchFilter = function (param) {
            //     var deferred = $q.defer();
            //     viewModel.search(param).then(
            //         function success(res) {
            //             deferred.resolve(res);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         });

            //     return deferred.promise;
            // }
            $scope.filterSearch = function () {
                // $vm.filterModel.orderNo = $scope.filterModel.orderNo;
                viewModel.searchOrderStatus($vm.filterModel).then(function (res) {
                    $vm.resultOrderStatus = res.data.items;
                    // $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.filterModel.maxSize = 5;
                    
             
                }, function error(res) { });
            }

            // $scope.searchFilter = function (param) {
            //     var deferred = $q.defer();
            //     viewModel.search(param).then(
            //         function success(res) {
            //             deferred.resolve(res);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         });

            //     return deferred.promise;
            // }

            $scope.historySearch = function () {
                // $vm.filterModel.orderNo = $scope.filterModel.orderNo;
debugger
                viewModel.searchOrderHistory($vm.orderHistory).then(function (res) {
                    debugger
                    $vm.resultOrderHistory = res.data.items;
                    // $vm.filterModel = $scope.filterModel;
                    $vm.orderHistory.totalRow = res.data.pagination.totalRow;
                    $vm.orderHistory.currentPage = res.data.pagination.currentPage;
                    $vm.orderHistory.perPage = res.data.pagination.perPage;
                    $vm.orderHistory.numPerPage = res.data.pagination.perPage;
                    $vm.orderHistory.maxSize = 5;
                    
             
                }, function error(res) { });
            }

            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $state.reload();
                $window.scrollTo(0, 0);
            }


            $scope.popupRound = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRound.onShow = !$scope.popupRound.onShow;
                    $scope.popupRound.delegates.roundPopup(param, index);
                },
                config: {
                    title: "Round"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if($vm.filterModel.selected == 1)
                        {
                            $vm.filterModel.roundId = angular.copy(param.roundId);
                            $vm.filterModel.roundName = angular.copy(param.roundName);
                        }
                        else{
                            $vm.orderHistory.roundId = angular.copy(param.roundId);
                            $vm.orderHistory.roundName = angular.copy(param.roundName);
                        }               
                    }
                }
            };

            $scope.popupRoute = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRoute.onShow = !$scope.popupRoute.onShow;
                    $scope.popupRoute.delegates.routePopup(param, index);
                },
                config: {
                    title: "Route"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if($vm.filterModel.selected == 1)
                        {
                            $vm.filterModel.routeId = angular.copy(param.routeId);
                            $vm.filterModel.routeName = angular.copy(param.routeName);
                        }
                        else
                        {
                            $vm.orderHistory.routeId = angular.copy(param.routeId);
                            $vm.orderHistory.routeName = angular.copy(param.routeName);
                        }

                    }
                }
            };

            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, index);
                },
                config: {
                    title: "DocumentType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if($vm.filterModel.selected == 1)
                        {
                            $vm.filterModel.orderType = angular.copy(param.documentTypeId);
                        }
                        else
                        {
                            $vm.orderHistory.orderType = angular.copy(param.documentTypeId);
                        }
                    }
                }
            };




            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            this.$onInit = function () {
                // $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

        }
    });

})();