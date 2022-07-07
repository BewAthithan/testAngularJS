(function() {
    'use strict';
    app.component('closePackStationFilter', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/closePackStation/component/closePackStationFilter.html";
        },
        bindings: {
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchResultModel: '=?',
            saleOrderTable: '=?',
        },
        controller: function($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/
            pageLoading, dpMessageBox, commonService, closePackStationFactory, localStorageService) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var model = $scope.filterModel;

            var viewModel = closePackStationFactory;

            document.getElementById("pack_station_input").focus();

            document.getElementById("pack_station_input").addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    if (!document.getElementById("pack_station_input").value) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ข้อมูลไม่ครบ',
                            message: "กรุณากรอก Pack Station ID"
                        })
                    } else {
                        let body = {
                            packstationid: document.getElementById("pack_station_input").value
                        };
                        viewModel.checkPackStation(body).then(
                            function success(res) {
                                console.log("res", res);
                                if (res.data.statusCode == 0) {
                                    document.getElementById("lpn_no_input").value = res.data.result;
                                } else {
                                    document.getElementById("lpn_no_input").value = null;
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'ข้อมูลไม่ถูกต้อง',
                                        message: res.data.statusDesc
                                    })
                                }
                            },
                            function error(err) {
                                console.log("err", err);
                            });
                    }
                }
            });

            $scope.confirmClose = function() {
                if (!document.getElementById("pack_station_input").value ||
                    !$scope.filterModel.ownerId) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: "กรุณากรอกข้อมูลให้ครบ"
                    })
                } else {
                    let body = {
                        packstationid: document.getElementById("pack_station_input").value,
                        ownerid: $scope.filterModel.ownerId,
                        userid: localStorageService.get('userTokenStorage')
                    }
                    console.log(body);
                    viewModel.closePackStation(body).then(function success(res) {
                            console.log("res", res);
                            document.getElementById("pack_station_input").focus();
                            document.getElementById("pack_station_input").value = null;
                            document.getElementById("lpn_no_input").value = null;
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information',
                                message: res.data.statusDesc
                            })
                        },
                        function error(err) {
                            console.log("err", err);
                        });
                }
            }

            $vm.triggerSearch = function() {
                pageLoading.show();
                if ($vm.filterModel.chkinitpage) {
                    $scope.filterSearch()
                } else {
                    $vm.filterModel.totalRow = 0;
                    $vm.filterModel.currentPage = 1;
                    $vm.filterModel.numPerPage = 1;
                    $vm.filterModel.num = 10;
                    $vm.filterModel.maxSize = 10;
                    $vm.filterModel.perPage = 30;
                }
            };

            $scope.toggleSearch = function() {

                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };

            $scope.filter = function() {

                $vm.triggerSearch();
            };

            $scope.header = {
                Search: true
            };

            $scope.hide = function() {
                $scope.header.Search = $scope.header.Search === false ? true : false;
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };

            $scope.searchFilter = function(param) {

                var deferred = $q.defer();
                if ((param.ownerName === undefined || param.ownerName == ""))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {});
                return deferred.promise;
            }
            $scope.filterSearch = function() {

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

                }, function error(res) {});
            }
            $scope.clearSearch = function() {
                    $scope.filterModel = {};
                    $scope.filterSearch();
                    $window.scrollTo(0, 0);
                }
                // ----------------------------------------------------
                // This local function
            $vm.setDateFormate = function(v) {
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
            $scope.$watch('filterModel.ownerName', function() {
                if ($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp) {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })

            function initialize() {};

            this.$onInit = function() {
                $scope.filterModel = {};
                $scope.filterModel.ownerId = localStorageService.get("ownerVariableId");
                $scope.filterModel.ownerIndex = localStorageService.get("ownerVariableIndex");
                $scope.filterModel.ownerName = localStorageService.get("ownerVariableName");
                $scope.filterModel.ownerNameTemp = $scope.filterModel.ownerName;
                document.getElementById("pack_station_input").focus();
            };

            this.$onDestroy = function() {};

            $scope.$on('$destroy', function() {
                $vm.$onDestroy();
            });

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function(param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function(param) {},
                    edit: function(param) {},
                    selected: function(param) {
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

        }
    });

})();