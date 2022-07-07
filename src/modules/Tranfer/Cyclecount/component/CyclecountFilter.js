(function () {
    'use strict';
    app.component('cyclecountFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/Cyclecount/component/CyclecountFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, cyclecountFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = cyclecountFactory;
            var model = $scope.filterModel;

            $vm.triggerSearch = function () {
                $vm.filterModel.cycleCount_Date = getToday();
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.searchResultModel = res.data.items;
                });
            };


            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.header = {
                Search: true
            };

            $scope.hide = function () {
                $scope.header.Search = $scope.header.Search === false ? true : false;
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.filterSearch = function (param) {
                $scope.filterModel = $scope.filterModel || {};
                // $scope.dropdownDocumentType.model = {};
                // $scope.dropdownStatus.model = {};
                $scope.filterModel = param;
                $scope.filterModel.totalRow = $vm.filterModel.totalRow
                $scope.filterModel.currentPage = $vm.filterModel.currentPage
                $scope.filterModel.perPage = $vm.filterModel.perPage
                $scope.filterModel.numPerPage = $vm.filterModel.numPerPage

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                if ($scope.dropdownStatus.model != null) {
                    $scope.filterModel.processStatus_Index = $scope.dropdownStatus.model.processStatus_Index;
                    $scope.filterModel.processStatus_Id = $scope.dropdownStatus.model.processStatus_Id;
                    $scope.filterModel.processStatus_Name = $scope.dropdownStatus.model.processStatus_Name;
                    $scope.filterModel.document_Status = $scope.dropdownStatus.model.processStatus_Id;

                }

                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.searchResultModel = res.data.items;
                });
            };


            // $scope.filterSearch = function () {

            //     $scope.filterModel = $scope.filterModel || {};
            //     $scope.filterModel.totalRow = $vm.filterModel.totalRow
            //     $scope.filterModel.currentPage = $vm.filterModel.currentPage
            //     $scope.filterModel.perPage = $vm.filterModel.perPage
            //     $scope.filterModel.numPerPage = $vm.filterModel.numPerPage

            //     if ($scope.dropdownDocumentType.model != null) {
            //         $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
            //         $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
            //         $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
            //     }
            //     if ($scope.dropdownStatus.model != null) {
            //         $scope.filterModel.processStatus_Index = $scope.dropdownStatus.model.processStatus_Index;
            //         $scope.filterModel.processStatus_Id = $scope.dropdownStatus.model.processStatus_Id;
            //         $scope.filterModel.processStatus_Name = $scope.dropdownStatus.model.processStatus_Name;
            //     }
            //     $scope.searchFilter($scope.filterModel).then(function success(res) {

            //         $vm.filterModel = $scope.filterModel;
            //         $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //         $vm.filterModel.currentPage = res.data.pagination.currentPage;
            //         $vm.filterModel.perPage = res.data.pagination.perPage;
            //         $vm.filterModel.numPerPage = res.data.pagination.perPage;
            //         $vm.searchResultModel = res.data.items;

            //     }, function error(res) { });
            // }


            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownStatus = function () {
                viewModel.dropdownStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownStatus = res.data;
                });
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
            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }


            //Clear Index
            $scope.$watch('filterModel.ownerName', function () {
                if ($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp) {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })


            function initialize() {
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.dropdownDocumentType();
                $scope.dropdownStatus();
                $scope.filterModel.cycleCount_Date = getToday();

            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });







        }
    });

})();