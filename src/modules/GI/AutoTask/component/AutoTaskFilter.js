(function () {
    'use strict';
    app.component('autoTaskFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/AutoTask/component/AutoTaskFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, autoTaskFactory) {
            var $vm = this;
            var viewModel = autoTaskFactory;
            // ----------------------------------------------------

            function dropdownUser() {
                viewModel.dropdownUser({}).then(function (res) {
                    $scope.dropdownUser = res.data;
                });
            };
            function dropdownDocumentType() {
                viewModel.dropdownDocumentType({}).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };
            function dropdownRoute() {
                viewModel.dropdownRoute({}).then(function (res) {
                    $scope.dropdownRoute = res.data;
                });
            };
            function dropdownRound() {
                viewModel.dropdownRound({}).then(function (res) {
                    $scope.dropdownRound = res.data;
                });
            };
            function dropdownZone() {
                viewModel.dropdownZone({}).then(function (res) {
                    $scope.dropdownZone = res.data;
                });
            };

            $vm.triggerSearch = function () {
                $scope.filterSearch();
            };

            $scope.filterSearch = function () {
                if ($scope.dropdownUser) {
                    if ($scope.dropdownUser.model) {
                        $scope.filterModel.user_Index = $scope.dropdownUser.model.user_Index;
                        $scope.filterModel.user_Id = $scope.dropdownUser.model.user_Id;
                        $scope.filterModel.user_Name = $scope.dropdownUser.model.user_Name;
                    }
                    else {
                        $scope.filterModel.user_Index = undefined;
                        $scope.filterModel.user_Id = undefined;
                        $scope.filterModel.user_Name = undefined;
                    }
                }
                if ($scope.dropdownDocumentType) {
                    if ($scope.dropdownDocumentType.model) {
                        $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                        $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                        $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                    }
                    else {
                        $scope.filterModel.documentType_Index = undefined;
                        $scope.filterModel.documentType_Id = undefined;
                        $scope.filterModel.documentType_Name = undefined;
                    }
                }
                if ($scope.dropdownRoute) {
                    if ($scope.dropdownRoute.model) {
                        $scope.filterModel.route_Index = $scope.dropdownRoute.model.route_Index;
                        $scope.filterModel.route_Id = $scope.dropdownRoute.model.route_Id;
                        $scope.filterModel.route_Name = $scope.dropdownRoute.model.route_Name;
                    }
                    else {
                        $scope.filterModel.route_Index = undefined;
                        $scope.filterModel.route_Id = undefined;
                        $scope.filterModel.route_Name = undefined;
                    }
                }
                if ($scope.dropdownRound) {
                    if ($scope.dropdownRound.model) {
                        $scope.filterModel.round_Index = $scope.dropdownRound.model.round_Index;
                        $scope.filterModel.round_Id = $scope.dropdownRound.model.round_Id;
                        $scope.filterModel.round_Name = $scope.dropdownRound.model.round_Name;
                    }
                    else {
                        $scope.filterModel.round_Index = undefined;
                        $scope.filterModel.round_Id = undefined;
                        $scope.filterModel.round_Name = undefined;
                    }
                }
                if ($scope.dropdownZone) {
                    if ($scope.dropdownZone.model) {
                        $scope.filterModel.zone_Index = $scope.dropdownZone.model.zone_Index;
                        $scope.filterModel.zone_Id = $scope.dropdownZone.model.zone_Id;
                        $scope.filterModel.zone_Name = $scope.dropdownZone.model.zone_Name;
                    }
                    else {
                        $scope.filterModel.zone_Index = undefined;
                        $scope.filterModel.zone_Id = undefined;
                        $scope.filterModel.zone_Name = undefined;
                    }
                }

                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.perPage = $vm.filterModel.perPage;

                viewModel.filter($scope.filterModel).then(function (res) {
                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.items;
                    }
                    else {

                        $vm.searchResultModel = res.data.items;
                    }
                });
            }

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }
           

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.planGoodsIssue_Due_Date = getToday();
                dropdownUser();
                dropdownDocumentType();
                dropdownRoute();
                dropdownRound();
                dropdownZone();
                $scope.filterSearch();
            };
            init();
        }
    });
})();