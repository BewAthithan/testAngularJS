(function () {
    'use strict';
    app.component('vendorTypeFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterVendorType/component/vendorTypeFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,vendorTypeFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = vendorTypeFactory;

            $scope.model = {
                vendorTypeId: "",
                vendorTypeName: "",
            };
            $scope.searchFilter = function (item) {
                var deferred = $q.defer();
                if(item == undefined){
                    item = $scope.model;
                };
                
                viewModel.search(item).then(
                    function success(res) {
                        pageLoading.hide();
                        $vm.filterModel = res.data;
                        $vm.searchResultModel = res.data;
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $vm.triggerSearch = function () {
                $vm.filterModel =  $vm.filterModel || {};                
                pageLoading.show();                                                                      
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;
                });
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