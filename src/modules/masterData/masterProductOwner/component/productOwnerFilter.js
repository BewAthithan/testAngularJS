(function () {
    'use strict';
    app.component('productOwnerFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterproductOwner/component/productOwnerFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,productOwnerFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = productOwnerFactory;

            $scope.model = {
                productOwnerId: "",
                productName: "",    
                ownerName: "",             
            };
            $scope.searchFilter = function (item) {
                
                var deferred = $q.defer();
                
                viewModel.search(item).then(
                    function success(res) {
                        pageLoading.hide();
                        $vm.filterModel.totalRow =  res.data.pagination.totalRow;    
                        $vm.searchResultModel = res.data.items;
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            $vm.triggerSearch = function () {

                             
                pageLoading.show();  
                viewModel.search($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.totalRow =  res.data.pagination.totalRow;    
                    $vm.searchResultModel = res.data.items;
                });;
            };
            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };
            
            $scope.autoComplete = {
                orderNo: "domesticLoadingItems/orderNo",
                SoNo: "domesticLoadingItems/SoNo",
                Plant: "domesticLoadingItems/Plant",
                OMSJobNo: "domesticLoadingItems/OMSJobNo",
                Material: "domesticLoadingItems/Material",
                Lot: "domesticLoadingItems/Lot",
                Customer: "domesticLoadingItems/Customer",
                DSNo: "domesticLoadingItems/DSNo",
                coloadNo: "domesticLoadingItems/coloadNo",
                basic: "DomesticPlantSelected/basicSuggestion",
                materialCode: "ExportPlantSelected/materialCode",
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