(function () {
    'use strict';
    app.component('callCenterRealTimeFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/CallCenterRealTime/component/callCenterRealTimeFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, callCenterFactory, dpMessageBox, localStorageService) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = callCenterFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                pageLoading.show();
                if ($vm.filterModel.chkinitpage) {
                    $scope.filterSearch()
                }
                else {
                    
                    $vm.filterModel.columnName = "PlanGoodsIssue_No";
                    $vm.filterModel.orderBy = "ASC";
                    $vm.filterModel.goodsIssueDateDueFrom = getToday();
                    $vm.filterModel.goodsIssueDateDueTo = getToday();
                    viewModel.filterRealtime($vm.filterModel).then(function (res) {
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;
                        $vm.searchResultModel = res.data.items;
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
                if ((param.planGoodsIssueNo === undefined || param.planGoodsIssueNo == "") && (param.ownerName === undefined || param.ownerName == "") && (param.goodsIssueDateDueFrom === undefined || param.goodsIssueDateDueFrom == "")
                    && (param.goodsIssueDateDueTo === undefined || param.goodsIssueDateDueTo == "") && (param.routeName === undefined || param.routeName == "") && (param.roundName === undefined || param.roundName == "")
                    && (param.reasonCodeName === undefined || param.reasonCodeName == "") && param.goodsIssueDateFrom == "" && param.goodsIssueDateTo == "" && (param.processStatusName === undefined || param.processStatusName == ""))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {
                        viewModel.filterRealtime(param).then(
                            function success(res) {
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else
                    viewModel.filterRealtime(param).then(
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
                $vm.filterModel.chkinitpage = true;
                
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.searchResultModel = res.data.items;
                }, function error(res) { });
            }

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.goodsIssueDateDueFrom = getToday();
                $scope.filterModel.goodsIssueDateDueTo = getToday();
                $scope.filterSearch ();
                // $state.reload();
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

            //Check Date----------------------------
            $scope.$watch('filterModel.goodsIssueDateDueFrom', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.goodsIssueDateDueFrom != undefined && $scope.filterModel.goodsIssueDateDueTo != undefined) {
                    var ds = Date.parse($scope.filterModel.goodsIssueDateDueFrom.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsIssueDateDueTo.replace(pattern, '$1-$2-$3'));
                }

                if (ds > de) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsIssueDateDueFrom = $scope.filterModel.goodsIssueDateDueTo;
                }

            })
            $scope.$watch('filterModel.goodsIssueDateDueTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.goodsIssueDateDueFrom != undefined && $scope.filterModel.goodsIssueDateDueTo != undefined) {
                    var ds = Date.parse($scope.filterModel.goodsIssueDateDueFrom.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsIssueDateDueTo.replace(pattern, '$1-$2-$3'));
                }

                if (de < ds) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsIssueDateDueTo = $scope.filterModel.goodsIssueDateDueFrom;
                }
            })
            /////
            $scope.$watch('filterModel.goodsIssueDateFrom', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.goodsIssueDateFrom != undefined && $scope.filterModel.goodsIssueDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.goodsIssueDateFrom.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsIssueDateTo.replace(pattern, '$1-$2-$3'));
                }

                if (ds > de) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsIssueDateFrom = $scope.filterModel.goodsIssueDateTo;
                }

            })
            $scope.$watch('filterModel.goodsIssueDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.goodsIssueDateFrom != undefined && $scope.filterModel.goodsIssueDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.goodsIssueDateFrom.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsIssueDateTo.replace(pattern, '$1-$2-$3'));
                }

                if (de < ds) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsIssueDateTo = $scope.filterModel.goodsIssueDateFrom;
                }
            })


            //Clear Index
            $scope.$watch('filterModel.ownerName', function () {
                if ($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp) {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.routeName', function () {
                if ($scope.filterModel.routeName != $scope.filterModel.routeNameTemp) {
                    $scope.filterModel.routeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.roundName', function () {
                if ($scope.filterModel.roundName != $scope.filterModel.roundNameTemp) {
                    $scope.filterModel.roundIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.processStatusName', function () {
                if ($scope.filterModel.processStatusName != $scope.filterModel.processStatusNameTemp) {
                    $scope.filterModel.processStatusIndex = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentStatus = "";
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
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);
                        $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
                    }
                }
            };

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
            $scope.popupStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    index = 6;
                    $scope.popupStatus.onShow = !$scope.popupStatus.onShow;
                    $scope.popupStatus.delegates.statusPopup(param, index);
                },
                config: {
                    title: "Status"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.processStatusIndex = angular.copy(param.processStatusIndex);
                        $scope.filterModel.documentStatus = angular.copy(param.processStatusId);
                        $scope.filterModel.processStatusName = angular.copy(param.processStatusName);
                        $scope.filterModel.processStatusNameTemp = $scope.filterModel.processStatusName;
                    }
                }
            };

            this.$onInit = function () {
                $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.filterModel.goodsIssueDateDueFrom = getToday();
                $scope.filterModel.goodsIssueDateDueTo = getToday();
                // setTimeout(
                //     function(){ 
                //     // location.reload(); 
                //     $state.reload($scope.filterSearch()
                //     );
                // }, 30000);

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

        }
    });

})();