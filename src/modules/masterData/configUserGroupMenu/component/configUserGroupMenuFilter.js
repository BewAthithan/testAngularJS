(function () {
    'use strict';
    app.component('configUserGroupMenuFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/configUserGroupMenu/component/configUserGroupMenuFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, configUserGroupMenuFactory, webServiceAPI, dpMessageBox, localStorageService) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = configUserGroupMenuFactory;

            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            function getUserGroupMenu() {
                viewModel.getUserGroupMenu({}).then(function (res) {
                    $scope.dropdownUserGroupMenu = res.data;
                });
            };

            $vm.triggerSearch = function () {
            };

            $scope.searchFilter = function (param) {

                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                if ($scope.dropdownUserGroupMenu.model) {
                    $scope.filterModel.userGroup_Index = $scope.dropdownUserGroupMenu.model.userGroup_Index;
                    $scope.filterModel.userGroup_Id = $scope.dropdownUserGroupMenu.model.userGroup_Id;
                    $scope.filterModel.userGroup_Name = $scope.dropdownUserGroupMenu.model.userGroup_Name;
                }
                else {

                    $scope.filterModel.userGroup_Index = null;
                    $scope.filterModel.userGroup_Id = null;
                    $scope.filterModel.userGroup_Name = null;

                    // return dpMessageBox.alert({
                    //     ok: 'Close',
                    //     title: 'Success',
                    //     message: 'กรุณา เลือก User Group'
                    // });
                }

                viewModel.filter($scope.filterModel).then(function (res) {
                    if (res.data.items) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.items;
                    } else {

                        $vm.searchResultModel = {};
                    }
                }).catch(function (error) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Success',
                        message: 'Error'
                    });
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                wave: "Autocomplete/autoSearchWave",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.confirm = function () {
                if (!$vm.searchResultModel) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Success',
                        message: 'กรุณา เลือก User Group'
                    });
                }
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to Confirm !'
                }).then(function () {
                    if ($vm.searchResultModel.length > 0) {
                        let obj = { items: $vm.searchResultModel, username: localStorageService.get('userTokenStorage') };
                        viewModel.confirm(obj).then(function (res) {
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Success',
                                message: res.data
                            });
                        }).catch(function (error) {
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Success',
                                message: 'Error'
                            });
                        });
                    }
                    else {
                        return dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Success',
                            message: 'กรุณา เลือก User Group'
                        });
                    }
                });
            }

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            this.$onInit = function () {
                getUserGroupMenu();
            };

        }
    });

})();