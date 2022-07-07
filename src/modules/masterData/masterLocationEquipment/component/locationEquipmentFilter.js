(function () {
    'use strict';
    app.component('locationEquipmentFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs,commonService) {
            return "modules/masterData/masterLocationEquipment/component/locationEquipmentFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $timeout, pageLoading, $state, commonService,locationEquipmentFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = locationEquipmentFactory;

            $vm.triggerSearch = function () {                
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                
                viewModel.search($vm.filterModel).then(function (res) {                    
                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.searchResultModel = res.data.items;
                });
            };
            $scope.model = {
                locationEquipmentId: "",
                locationName: "", 
                equipmentName: ""                
            };
            $scope.searchFilter = function (item) {    
                var deferred = $q.defer();
                if(item == undefined){
                    item = $scope.model;
                };
                if(item.locationEquipmentId == "" || item.locationName == "" || item.equipmentName == "" ){
                    item = $scope.model;
                }
                item.totalRow = $vm.filterModel.totalRow;
                item.currentPage = $vm.filterModel.currentPage;
                item.perPage = $vm.filterModel.perPage;
                item.numPerPage = $vm.filterModel.numPerPage;
                item.maxSize = $vm.filterModel.maxSize;
                $vm.filterModel = item;
                viewModel.search(item).then(
                    function success(res) {
                        pageLoading.hide();
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;
                        $vm.searchResultModel = res.data.items;
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