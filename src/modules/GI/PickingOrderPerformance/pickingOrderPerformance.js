(function () {
    'use strict'

    app.component('pickingOrderPerformance', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/PickingOrderPerformance/pickingOrderPerformance.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, pickingOrderFactory) {
            
            var service = pickingOrderFactory;

            $scope.model = {};

            $scope.search = function () {
                // pageLoading.show();
                service.pickingPerformanceSearch($scope.filterModel).then(function (res) {                    
                    $scope.model = res.data;
                    // pageLoading.hide();
                }).catch(function () {
                    // pageLoading.hide();
                    dpMessageBox.alert({
                        ok: 'OK',
                        titile: 'Error',
                        message: "Page load failed."
                    });
                });
            }

            $scope.refresh_Sec = function () {
                clearTimeout(_refresh);
                _refresh = setInterval(function(){ $scope.search(); }, $scope.refreshSec * 1000);
            }

            var _clock = setInterval(function () {
                function r(el, deg) {
                    el.setAttribute('transform', 'rotate(' + deg + ' 50 50)')
                }
                var d = new Date()
                r(sec, 6 * d.getSeconds())
                r(min, 6 * d.getMinutes())
                r(hour, 30 * (d.getHours() % 12) + d.getMinutes() / 2)
            }, 1000)

            var _refresh = setInterval(function(){ $scope.search(); }, 60000);

            $scope.$on('$destroy', function() {
                clearTimeout(_refresh);
                clearTimeout(_clock);
            });

            $scope.$watch('filterModel.PickDate', function (value) {
                $scope.search();
            });

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);
                        $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));

                        $scope.search();
                    }
                }
            };

            function init() {
                $scope.filterModel = {
                    PickDate: $filter('date')(new Date(),'yyyyMMdd'), //'20190212'
                    PickTime: ''
                };

                service.RoundList().then(function success(res) {
                    $scope.RoundList = res.data;
                });

                $scope.refreshSec = "60";
            }
            init();
        }
    })
})();