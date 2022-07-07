(function () {
    'use strict';
    app.component('assignCartFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/AssignCart/component/AssignCartFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?'

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, localStorageService, assignCartFactory,webServiceAPI) {
            var $vm = this;
            var viewModel = assignCartFactory;
            $scope.url = webServiceAPI.GI
            $scope.api = "AssignCart/AutoEquipmentItem";
            // ----------------------------------------------------

            function dropdownUserGroup() {
                viewModel.dropdownUserGroup({}).then(function (res) {
                    $scope.dropdownUserGroup = res.data;
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
            function getUserGroup() {
                let username = localStorageService.get('userTokenStorage');
                viewModel.getUserGroup(username).then(function (res) {
                    let perPage = angular.copy($vm.filterModel);
                    $scope.dropdownWordGroup = res.data
                    $scope.dropdownWordGroup.model = res.data[0];
                    // $scope.filterModel = res.data
                    $vm.filterModel = res.data[0];
                    $vm.filterModel.num = perPage.num;
                    $vm.filterModel.totalRow = perPage.totalRow;
                    $vm.filterModel.currentPage = perPage.currentPage;
                    $vm.filterModel.maxSize = perPage.maxSize;
                    $vm.filterModel.perPage = perPage.perPage;
                });
            };

            $vm.triggerSearch = function (param) {
                $scope.filterSearch(param);
            };

            $scope.Submit = function () {
                if ($scope.filterModel.equipment) {
                    let username = localStorageService.get('userTokenStorage');
                    viewModel.CheckEquipment($scope.filterModel.equipment, username).then(function (res) {
                        if (!res.data.isuse) {
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msg
                            })
                        }
                        else if (res.data.items.length == 0) {
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msg
                            })
                        }
                        else {
                            $scope.filterSearch();
                            // $scope.dropdownequipmentItem = res.data.items;
                            // $scope.dropdownequipmentItem.model = res.data.items[0].equipmentItem_Index ? res.data.items[0] : res.data.items[1];
                            $scope.filterModel.equipment_Index = res.data.items[0].equipment_Index;
                            $scope.filterModel.equipment_Id = res.data.items[0].equipment_Id;
                            $scope.filterModel.equipment_Name = res.data.items[0].equipment_Name;
                            $vm.filterModel.equipment_Index = res.data.items[0].equipment_Index;
                            $vm.filterModel.equipment_Id = res.data.items[0].equipment_Id;
                            $vm.filterModel.equipment_Name = res.data.items[0].equipment_Name;
                            $vm.isFilter = true;
                        }
                    });
                }
            }

            $scope.filterSearch = function (param) {
                if ($scope.dropdownUserGroup) {
                    if ($scope.dropdownUserGroup.model) {
                        $scope.filterModel.userGroup_Index = $scope.dropdownUserGroup.model.userGroup_Index;
                        $scope.filterModel.userGroup_Id = $scope.dropdownUserGroup.model.userGroup_Id;
                        $scope.filterModel.userGroup_Name = $scope.dropdownUserGroup.model.userGroup_Name;
                    }
                    else{
                        $scope.filterModel.userGroup_Index = undefined;
                        $scope.filterModel.userGroup_Id = undefined;
                        $scope.filterModel.userGroup_Name = undefined;
                    }
                }
                if ($scope.dropdownDocumentType) {
                    if ($scope.dropdownDocumentType.model) {
                        $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                        $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                        $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                    }
                    else{
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
                    else{
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
                    else{
                        $scope.filterModel.round_Index = undefined;
                        $scope.filterModel.round_Id = undefined;
                        $scope.filterModel.round_Name = undefined;
                    }
                }
                if ($scope.dropdownWordGroup) {
                    if ($scope.dropdownWordGroup.model) {
                        // $scope.filterModel.user_Index = $scope.dropdownWordGroup.model.user_Index;
                        // $scope.filterModel.user_Id = $scope.dropdownWordGroup.model.user_Id;
                        // $scope.filterModel.user_Name = $scope.dropdownWordGroup.model.user_Name;

                        $scope.filterModel.taskGroup_Index = $scope.dropdownWordGroup.model.taskGroup_Index;
                        $scope.filterModel.taskGroup_Id = $scope.dropdownWordGroup.model.taskGroup_Id;
                        $scope.filterModel.taskGroup_Name = $scope.dropdownWordGroup.model.taskGroup_Name;

                        $scope.filterModel.taskGroupUser_Index = $scope.dropdownWordGroup.model.taskGroupUser_Index;
                        $scope.filterModel.taskGroupUser_Id = $scope.dropdownWordGroup.model.taskGroupUser_Id;
                    }
                    else{
                        $scope.filterModel.taskGroup_Index = undefined;
                        $scope.filterModel.taskGroup_Id = undefined;
                        $scope.filterModel.taskGroup_Name = undefined;
                        $scope.filterModel.taskGroupUser_Index = undefined;
                        $scope.filterModel.taskGroupUser_Id = undefined;
                    }
                }
                // if ($scope.dropdownequipmentItem) {
                //     if ($scope.dropdownequipmentItem.model) {
                //         $scope.filterModel.equipmentItem_Index = $scope.dropdownequipmentItem.model.equipmentItem_Index;
                //         $scope.filterModel.equipmentItem_Id = $scope.dropdownequipmentItem.model.equipmentItem_Id;
                //         $scope.filterModel.equipmentItem_Name = $scope.dropdownequipmentItem.model.equipmentItem_Name;
                //         $scope.filterModel.equipment_Index = $scope.dropdownequipmentItem.model.equipment_Index;
                //         $scope.filterModel.equipment_Id = $scope.dropdownequipmentItem.model.equipment_Id;
                //         $scope.filterModel.equipment_Name = $scope.dropdownequipmentItem.model.equipment_Name;
                //     }
                //     else {
                //         $scope.filterModel.equipmentItem_Index = undefined;
                //         $scope.filterModel.equipmentItem_Id = undefined;
                //         $scope.filterModel.equipmentItem_Name = undefined;
                //         $scope.filterModel.equipment_Index = undefined;
                //         $scope.filterModel.equipment_Id = undefined;
                //         $scope.filterModel.equipment_Name = undefined;
                //     }
                // }

                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                if (param) {
                    viewModel.filterCart($scope.filterModel).then(function (res) {
                        if (res.data.length != 0) {
                            $vm.filterModel = $scope.filterModel;
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
                else {
                    viewModel.filter($scope.filterModel).then(function (res) {
                        if (res.data.length != 0) {
                            $vm.filterModel = $scope.filterModel;
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
            }
            
            $scope.back = function () {
                $state.go('tops', {})
            }

            $scope.changeCart = function (param) {
                $vm.filterModel.equipmentItem_Index = param.equipmentItem_Index;
                $vm.filterModel.equipmentItem_Id = param.equipmentItem_Id;
                $vm.filterModel.equipmentItem_Name = param.equipmentItem_Name;
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
                $scope.filterModel.user_Name = localStorageService.get('userTokenStorage');
                $scope.filterModel.planGoodsIssue_Due_Date = getToday();
                dropdownUserGroup();
                dropdownDocumentType();
                dropdownRoute();
                dropdownRound();
                getUserGroup();
            };
            init();
        }
    });
})();