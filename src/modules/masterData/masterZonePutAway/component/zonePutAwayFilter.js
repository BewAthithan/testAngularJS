(function () {
    'use strict';
    app.component('zonePutAwayFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZonePutAway/component/zonePutAwayFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,zonePutAwayFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = zonePutAwayFactory;
            
            $vm.triggerSearch = function () {                
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                
                viewModel.search($vm.filterModel).then(function (res) {   
                                 
                    pageLoading.hide();
                    
                    // $vm.filterModel.totalRow = res.data.paginationInfo.totalItem;
                    // $vm.filterModel.currentPage = res.data.paginationInfo.currentPage;
                    // $vm.filterModel.perPage = res.data.paginationInfo.totalPage;
                    // $vm.filterModel.numPerPage = res.data.paginationInfo.currentPage;
                    // $vm.searchResultModel = res.data.result;

                    $vm.filterModel.totalRow = res.data.paginationInfo.totalItem;
                    $vm.filterModel.currentPage = res.data.paginationInfo.currentPage;
                    $vm.filterModel.num = res.data.paginationInfo.totalPage;
                    $vm.filterModel.perPage = $vm.filterModel.pagination.perPage;
                    $vm.searchResultModel = res.data.result;
                    
                });
            };
            $scope.model = {
                zonePutAwayId: "",
                zonePutAwayName: "",
                                 
            };
            $scope.searchFilter = function (item) {                
                var deferred = $q.defer();
                
                if(item == undefined){
                    item = $scope.model;
                };
                if(item.zonePutAwayId == "" || item.zonePutAwayName == ""  ){
                    item = $scope.model;
                }
                item.totalRow = $vm.filterModel.totalRow;
                item.currentPage = $vm.filterModel.currentPage;
                item.perPage = $vm.filterModel.perPage;
                item.numPerPage = $vm.filterModel.numPerPage;
                item.maxSize = $vm.filterModel.maxSize;
                $vm.filterModel = item;

                var items = {
                    zonePutAwayId: item.zonePutAwayId,
                    zonePutAwayName: item.zonePutAwayName,
                    pagination: {
                        currentPage: $vm.filterModel.currentPage,
                        perPage: $vm.filterModel.perPage,
                        totalRow: $vm.filterModel.perPage,
                        key: "",
                        advanceSearch: true
                    }
                }
                viewModel.search(items).then(
                    function success(res) {
                        pageLoading.hide();
                        $vm.filterModel.totalRow = res.data.paginationInfo.totalItem;
                        $vm.filterModel.currentPage = res.data.paginationInfo.currentPage;
                        $vm.filterModel.perPage = res.data.paginationInfo.totalPage;
                        $vm.filterModel.numPerPage = res.data.paginationInfo.currentPage;
                        $vm.searchResultModel = res.data.result;
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
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

            function initialize() {
            };

            this.$onInit = function () {
                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();