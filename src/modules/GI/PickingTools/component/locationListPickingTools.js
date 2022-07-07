(function () {
    'use strict'
    app.component('locationListPickingTools', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/PickingTools/component/locationListPickingTools.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
            var $vm = this;
            var defer = {};
            $scope.items = $scope.items || [];
            var item = $vm.searchResultModel;
            // setting column       
            $scope.isLoading = false;

            var model = $scope.filterModel;

            $vm.isLoading = function (model, Barcode, sum) {
                defer = $q.defer();
                $scope.isLoading = true;

                console.log(model);

                if (model != null) {
                    $scope.filterModel = model;
                    $scope.filterModel.LocationName = model[0].locationName;
                    $scope.filterModel.locationIndex = model[0].locationIndex;
                    $scope.filterModel.locationId = model[0].locationId;
                    $scope.filterModel.itemStatusIndex = model[0].itemStatusIndex;
                    $scope.filterModel.itemStatusName = model[0].itemStatusName;
                    $scope.filterModel.itemStatusId = model[0].itemStatusId;
                    $scope.filterModel.productName = model[0].productName;
                    if (Barcode != null) {
                        $scope.filterModel.productId = model[0].productId;
                        $scope.filterModel.productName = model[0].productName;
                    }

                    $scope.SumModel = sum;
                }
                return defer.promise;
            };

            $scope.detectCheck = function (item) {
                let isCheck = $scope.filterModel;
                for (var i = 0; i <= isCheck.length - 1; i++) {
                    if (item.binBalance_Index  == isCheck[i].binBalance_Index  && item.selected == isCheck[i].selected) {
    
                        isCheck[i].selected = true;
                    }
                    else {
                        isCheck[i].selected = false;
                    }
                }              
            }

            $scope.checkLine = function (param) {
                for (let i = 0; i < $scope.filterModel.length; i++) {
                    if(i == param) {
                        $scope.filterModel[param].selected = true;
                    } else {
                        $scope.filterModel[i].selected = false;
                    }
                }
                
            }

            $scope.select = function (param) {
                var item = angular.copy($scope.filterModel);
                var models = {};
                var idx = [];
                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        idx.push(v)
                    }
                });
                models = { 'data': idx };
                defer.resolve(models);
            }

            $scope.back = function () {
                $scope.isLoading = false;
                $scope.SumModel = {};
                $scope.filterModel = {};
                defer.resolve('0');
            }
            
            var init = function () {
            };
            init();

        }
    })
})();