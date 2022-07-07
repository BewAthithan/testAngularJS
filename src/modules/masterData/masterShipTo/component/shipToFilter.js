(function () {
    'use strict';
    app.component('shipToFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterShipTo/component/shipToFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,shipToFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = shipToFactory;

            $scope.model = {
                shipToId: "",
                shipToName: "",    
                shipToTypeName: "",             
            };
            $scope._models = {
                currentPage: $scope.currentPage + 1,
                numPerPage: $scope.numPerPage,
                totalRow: 0
            };
            $scope.searchFilter = function (item) {
                var deferred = $q.defer();
                if(item == undefined){
                    item = $scope.model;
                };
                if(item.shipToId == "" || item.shipToName == "" || item.shipToTypeName == ""){
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

            $vm.triggerSearch = function () {
                $vm.filterModel =  $vm.filterModel || {};                
                pageLoading.show();                                                                      
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }

                        $vm.searchResultModel = res.data;

                    }
                    else {
                        $vm.searchResultModel = res.data;
                    }
                });
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