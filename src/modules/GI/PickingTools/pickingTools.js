'use strict'
app.component('pickingTools', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/PickingTools/pickingTools.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        pickingTools:'=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsReceiveFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = planGoodsReceiveFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;
        


        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                // numPerPage: $vm.filterModel.numPerPage,
                num: 1,
                maxSize: 2,
                perPage: 20,
                change: function () {
                    $vm.filterModel.currentPage = this.currentPage - 1;
                    if ($vm.triggerSearch) {
                        $vm.triggerSearch();
                    }
                },
                changeSize: function () {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    $vm.triggerSearch();
                }
            }
        }

        $vm.pickingTools = function (param, index, owner) {
            $scope.filterModel.ownerIndex = owner;
            defer = $q.defer();
            $scope.pickingTools = true;
            if (param != undefined) {                   
                
            }
            else {
                // $scope.buttons.add = true;
                // $scope.buttons.update = false;
            }
            return defer.promise;
        };





        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = true;
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                });
            }
        }

        $scope.popupRound = {
            onShow: false,
            delegates: {},
            onClick: function (param, index) {

                $scope.popupRound.onShow = !$scope.popupRound.onShow;
                $scope.popupRound.delegates.roundPopup(param, index);
            },
            config: {
                title: "Round"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    $scope.filterModel.roundIndex = angular.copy(param.roundIndex);
                    $scope.filterModel.roundId = angular.copy(param.roundId);
                    $scope.filterModel.roundName = angular.copy(param.roundName);
                    $scope.filterModel.roundNameTemp = $scope.filterModel.roundName;
                }
            }
        };

        $scope.popupRoute = {
            onShow: false,
            delegates: {},
            onClick: function (param, index) {

                $scope.popupRoute.onShow = !$scope.popupRoute.onShow;
                $scope.popupRoute.delegates.routePopup(param, index);
            },
            config: {
                title: "Route"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    $scope.filterModel.routeIndex = angular.copy(param.routeIndex);
                    $scope.filterModel.routeId = angular.copy(param.routeId);
                    $scope.filterModel.routeName = angular.copy(param.routeName);
                    $scope.filterModel.routeNameTemp = $scope.filterModel.routeName;
                }
            }
        };








        function validate(param) {
            var msg = "";
            return msg;
        }

        var MessageBox = dpMessageBox;


        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.pageMode = 'Master';

        $scope.$watch('tblHeader', function (n, o) {
            if (n) {
                localStorageService.set(_storageName, n);
            }
        }, true);



        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };





        var initForm = function () {
        };
        var init = function () {
        };
        init();

    }
});