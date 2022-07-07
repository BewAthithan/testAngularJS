(function () {
    'use strict';
    app.component('productFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProduct/component/productFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,productFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var viewModel = productFactory;
            $scope.filterModel;
            
            $vm.triggerSearch = function () {
                
                $vm.filterModel =  $vm.filterModel || {};                
                pageLoading.show();  
                viewModel.filter($vm.filterModel).then(function (res) {
                    
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModel = $vm.filterModel;
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.length;
                        
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }                  
                    
                        $vm.searchResultModel = res.data.itemsProduct;                    
                    }
                    else {
                        
                        $vm.searchResultModel = res.data.itemsProduct;
                    }
                });
            };

            $scope.model = {
                productId: "",
                productName: "",    
                productTypeName: "",        
                currentPage: 1,
                numPerPage: 30,
                PerPage: 30,
                totalRow: 0,      
            };
            
            $scope.searchFilter = function (item) {
                
                var deferred = $q.defer();
                if(item == undefined){
                    item = $scope.model;
                };
                if(item.productId == "" || item.productName == "" || item.productTypeName == ""){
                    item = $scope.model;
                }
                viewModel.search(item).then(
                    function success(res) {                        
                        pageLoading.hide();
                        if(res.data.itemsProduct.length <= 10){
                            $vm.filterModel.totalRow = 30;
                        }
                        else if(res.data.itemsProduct.length > 0){
                            $vm.filterModel.totalRow = res.data.itemsProduct.length;
                        }
                        else{
                            $vm.triggerSearch();                            
                        }
                        if(res.data.pagination.perPage == 0){
                            $vm.filterModel.perPage = 30;
                        } 
                        $vm.searchResultModel = res.data.itemsProduct;
                        // $vm.filterModel = res.data;
                        // $vm.searchResultModel = res.data.itemsProduct;
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