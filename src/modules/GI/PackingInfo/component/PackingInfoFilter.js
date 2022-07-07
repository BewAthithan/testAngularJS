(function () {
    'use strict';
    app.component('packingInfoFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/PackingInfo/component/PackingInfoFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, packingInfoFactory, dpMessageBox, localStorageService) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = packingInfoFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                pageLoading.show();
                if ($vm.filterModel.chkinitpage) {
                    $scope.filterSearch()
                }
                else {
                    $vm.filterModel.columnName = "PlanGoodsIssue_No";
                    $vm.filterModel.orderBy = "ASC";
                    $vm.filterModel.planGoodsIssueDueDateFrom = getToday();
                    $vm.filterModel.planGoodsIssueDueDateTo = getToday();
                    viewModel.filter($vm.filterModel).then(function (res) {
                        console.log(res.data);
                        pageLoading.hide();
                        $vm.filterModel.totalRow = res.data.result.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.result.pagination.currentPage;
                        // $vm.filterModel.perPage = res.data.result.pagination.perPage;
                        // $vm.filterModel.numPerPage = res.data.result.pagination.perPage;
                        $vm.searchResultModel = res.data.result.items;
                    });
                }
            };


            $scope.header = {
                Search: true
            };

            $scope.hide = function () {
                $scope.header.Search = $scope.header.Search === false ? true : false;
            };


            $scope.toggleSearch = function () {
                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };


            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                if ((param.soNo === undefined || param.soNo == "") && (param.ownerName === undefined || param.ownerName == "")
                    && (param.planGoodsIssueDueDateFrom === undefined || param.planGoodsIssueDueDateFrom == "") && (param.planGoodsIssueDueDateTo === undefined || param.planGoodsIssueDueDateTo == "")
                    && (param.routeName === undefined || param.routeName == "") && (param.roundName === undefined || param.roundName == "") && (param.processStatusName === undefined || param.processStatusName == "")
                    && (param.documentTypeName === undefined || param.documentTypeName == ""))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {
                        viewModel.filter(param).then(
                            function success(res) {
                                console.log(res);
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else
                    viewModel.filter(param).then(
                        function success(res) {
                            deferred.resolve(res);
                        },
                        function error(response) {
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
            $scope.filterSearch = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.totalRow = $vm.filterModel.totalRow
                $scope.filterModel.currentPage = $vm.filterModel.currentPage
                $scope.filterModel.perPage = $vm.filterModel.perPage
                $scope.filterModel.numPerPage = $vm.filterModel.numPerPage
                $scope.filterModel.maxSize = 10;    
                $vm.filterModel.chkinitpage = true;
                
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    console.log(res.data.result);
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.result.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.result.pagination.currentPage;
                    // $vm.filterModel.perPage = res.data.result.pagination.perPage;
                    // $vm.filterModel.numPerPage = res.data.result.pagination.perPage;
                    $vm.searchResultModel = res.data.result.items;

                }, function error(res) { });
            }

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.planGoodsIssueDueDateFrom = getToday();
                $scope.filterModel.planGoodsIssueDueDateTo = getToday();
                $scope.filterSearch();
                $window.scrollTo(0, 0);
            }

            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            // -----------------SET DAY default-----------------//
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
            $scope.$watch('filterModel.processStatusName', function () {
                if ($scope.filterModel.processStatusName != $scope.filterModel.processStatusNameTemp) {
                    $scope.filterModel.processStatusIndex = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentStatus = "";
                }
            })
            $scope.$watch('filterModel.documentTypeName', function () {
                if($scope.filterModel.documentTypeName != $scope.filterModel.documentTypeNameTemp)
                {
                    $scope.filterModel.documentTypeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })

            //Duedate
            $scope.$watch('filterModel.planGoodsIssueDueDateFrom', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.planGoodsIssueDueDateFrom != undefined && $scope.filterModel.planGoodsIssueDueDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.planGoodsIssueDueDateFrom.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsIssueDueDateTo.replace(pattern, '$1-$2-$3'));
                }

                if (ds > de) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsIssueDueDateFrom = $scope.filterModel.planGoodsIssueDueDateTo;
                }

            })
            $scope.$watch('filterModel.planGoodsIssueDueDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.planGoodsIssueDueDateFrom != undefined && $scope.filterModel.planGoodsIssueDueDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.planGoodsIssueDueDateFrom.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsIssueDueDateTo.replace(pattern, '$1-$2-$3'));
                }

                if (de < ds) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsIssueDueDateTo = $scope.filterModel.planGoodsIssueDueDateFrom;
                }
            })

            // -----------------ALL POPUP IN PAGE-----------------//


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
                        console.log(param);
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);
                        $scope.filterModel.ownerNameTemp = $scope.filterModel.ownerName;

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
                    }
                }
            };

            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, index);
                },
                config: {
                    title: "DocumentType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                        $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                        $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                        $scope.filterModel.documentTypeNameTemp = $scope.filterModel.documentTypeName;
                    }
                }
            };



            this.$onInit = function () {
                $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.filterModel.planGoodsIssueDueDateFrom = getToday();
                $scope.filterModel.planGoodsIssueDueDateTo = getToday();

                $scope.filterModel.ownerId = localStorageService.get("ownerVariableId");
                $scope.filterModel.ownerIndex = localStorageService.get("ownerVariableIndex");
                $scope.filterModel.ownerName = localStorageService.get("ownerVariableName");
                $scope.filterModel.ownerNameTemp = $scope.filterModel.ownerName;
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

        }
    });

})();