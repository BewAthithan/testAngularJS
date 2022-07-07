(function () {
    'use strict';
    app.component('locationTypeFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterLocationType/component/locationTypeFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,locationTypeFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = locationTypeFactory;

            $vm.triggerSearch = function () {
                $vm.filterModel =  $vm.filterModel || {};                
                pageLoading.show();  
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data.atcom;
                    $vm.searchResultModel = res.data;
                });;
            };

            $scope.model = {
                locationTypeId: "",
                locationTypeName: "",                 
            };
            $scope.searchFilter = function (item) {    
                var deferred = $q.defer();
                if(item == undefined){
                    item = $scope.model;
                };
                if(item.locationTypeId == "" || item.locationTypeName == "" ){
                    item = $scope.model;
                }
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