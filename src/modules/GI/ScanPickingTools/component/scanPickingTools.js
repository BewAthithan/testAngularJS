(function () {
    'use strict'

    app.component('scanPickingTools', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/ScanPickingTools/component/scanPickingTools.html",
        bindings: {               
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?', 
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox,scanPickingToolsFactory) {
            var $vm = this;
            $scope.isFilter = true;
            $scope.filterModel = {};
            var viewModel = scanPickingToolsFactory;


            $scope.ScanTaskID = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendTaskID($vm.filterModel).then(function success(res) {
                    $vm.filterModel.TaskID = res.data[0].TaskID;
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.filterModel.Product"]');
                        focusElem[0].focus();

                    }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendTaskID = function (model) {
                var deferred = $q.defer();
                viewModel.ScanTaskID(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanProduct = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendProduct($vm.filterModel).then(function success(res) {
                    $vm.filterModel.Product = res.data[0].Product;
                    
                },
                    function error(res) {

                    });
            }
            $scope.SendProduct = function (model) {
                var deferred = $q.defer();
                viewModel.ScanProduct(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }
        }
    })
})();