(function () {
    'use strict';
    app.component('taskFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Inquiry/Task/component/taskFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, localStorageService, dpMessageBox, commonService, taskFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = taskFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};

                // $vm.filterModel.goodsReceiveDate = getToday();
                // debugger
                viewModel.search($vm.filterModel).then(function (res) {

                    pageLoading.hide();                    
                    if (res.data.items.length != 0) {
                      
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;
                        $vm.filterModel.maxSize = 5;

                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }
                        // debugger
                        $vm.searchResultModel = res.data.items;
                    }
                    else {

                        $vm.searchResultModel = res.data.items;
                    }
                });
            };


            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }



            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                
                viewModel.search(param).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });

                return deferred.promise;
            }
            $scope.filterSearch = function () {
                
                // $scope.filterModel = $scope.filterModel || {};
                // $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                // $scope.filterModel.perPage = $vm.filterModel.perPage;
                $vm.filterModel.taskNo = $scope.filterModel.taskNo;
                $vm.filterModel.subRefDocumentNo = $scope.filterModel.subRefDocumentNo;
                viewModel.search($vm.filterModel).then(function success(res) {
                    
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.filterModel.maxSize = 5;
                    $vm.searchResultModel = res.data.items;



                }, function error(res) { });
            }

            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();
                $state.reload();
                $window.scrollTo(0, 0);
            }





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