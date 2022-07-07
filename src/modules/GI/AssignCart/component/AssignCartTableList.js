'use strict'
app.component('assignCartTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/AssignCart/component/AssignCartTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, assignCartFactory, scanTaskFactory) {
        var $vm = this;
        var viewModel = assignCartFactory;
        var _viewModel = scanTaskFactory;

        $vm.$onInit = function () {

        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.selectedTab = function (tab) {
            if (tab == 1) {
                $scope.colortab1 = "#FDFEFE";
                $scope.colortab2 = "#D3D3D3";
                $scope.colortab3 = "#D3D3D3";
                $vm.filterModel.tab = false;
            }
            else if (tab == 2) {
                $scope.colortab1 = "#D3D3D3";
                $scope.colortab2 = "#FDFEFE";
                $scope.colortab3 = "#D3D3D3";
                $vm.filterModel.tab = true;
            }
            else if (tab == 3) {
                $scope.colortab1 = "#D3D3D3";
                $scope.colortab2 = "#D3D3D3";
                $scope.colortab3 = "#FDFEFE";
                $vm.filterModel.tab = true;
            }

            if (tab == 3) {
                $vm.triggerSearch(true);
            }
            else {
                $vm.triggerSearch();
            }
            $scope.selected = tab;
        }

        $scope.selectTask = function (param) {
            if (!$vm.filterModel.equipmentItem_Index) {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "Cart Location is incorrect"
                })
            }

            if ($vm.filterModel.equipmentItem_Index.length != 9 && $vm.filterModel.equipmentItem_Index.length != 36) {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "Format ไม่ถูกต้อง"
                })
            }
            viewModel.CheckTask($vm.filterModel.equipmentItem_Index, $vm.filterModel.equipment_Index, param.task_Index).then(function (res) {
                if (!res.data.isuse) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Alert ?',
                        message: res.data.msg
                    });
                }
                else {
                    if (res.data.msg == "Add") {
                        $vm.filterModel.equipmentItem_Index = res.data.items[0].equipmentItem_Index;
                        $vm.filterModel.equipmentItem_Id = res.data.items[0].equipmentItem_Id;
                        $vm.filterModel.equipmentItem_Name = res.data.items[0].equipmentItem_Name;
           
                    }

                    param.equipmentItem_Index = $vm.filterModel.equipmentItem_Index;
                    param.equipmentItem_Id = $vm.filterModel.equipmentItem_Id;
                    param.equipmentItem_Name = $vm.filterModel.equipmentItem_Name;
                    param.equipment_Index = $vm.filterModel.equipment_Index;
                    param.equipment_Id = $vm.filterModel.equipment_Id;
                    param.equipment_Name = $vm.filterModel.equipment_Name;
                    param.userName = localStorageService.get('userTokenStorage');

                    viewModel.AssignTask(param).then(function success(res) {
                        debugger
                        if (!res.data.isUse) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Cart Location is incorrect"
                            })
                            $vm.triggerSearch();

                        }
                        if (res.data.msg == "Pick") {
                            $scope.pick();
                        }
                        else {
                            $vm.triggerSearch();

                        }
                    })
                }
            }, function error(res) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "Error API"
                })
            });
        }

        $scope.pick = function (param) {
            if (!$vm.filterModel.equipment_Index) {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "Cart Location is incorrect"
                })
            }

            $vm.filterModel.isCartNumber = true;
            $vm.filterModel.userName = localStorageService.get('userTokenStorage');
            _viewModel.checkCartDataAssign($vm.filterModel).then(function success(res) {
                if (res.data.msgResult == "False") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Cart Location is incorrect"
                    })
                }
                else {
                    if (res.data.msgResult == "Pick") {
                        viewModel.setParam(res.data.itemResult);
                        $state.go('tops.scan_task', {})
                    }
                    else if (res.data.msgResult == "Drop") {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: " Cart Location " + res.data.itemResult[0].equipmentItem_Name + " Completed !! But not yet Drop Staging"
                        }).then(function () {
                            if (res.data.itemResult) {
                                _viewModel.setParam(res.data.itemResult);
                                $state.go('tops.scan_task_drop', {})
                            }
                        });
                    }
                    else if (res.data.msgResult == "PrintRF") {
                        if (param) {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Confirm ?',
                                message: " Cart Location " + param.task_No + " Completed !!"
                            }).then(function () {
                                if (param != null) {
                                    // viewModel3.setParam($scope.filterModel.equipmentItemName);
                                    viewModel.setParam(param);
                                    $state.go('tops.scan_task_confrim_carton', {})
                                }
                            });
                        }
                        else {
                            return dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Alert ?',
                                message: "กรุณา Assign งาน"
                            });
                        }

                    }
                    else if (res.data.msgResult == "Work") {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Alert ?',
                            message: "กรุณาทำงานที่ถูก assign ให้เสร็จก่อน"
                        });
                    }
                }
            }, function error(res) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "Error API"
                })
            });
        }

        $scope.delete = function (param) {
            viewModel.daleteUserAssign(param.task_Index).then(function (res) {
                if (res.data) {
                    $vm.searchResultModel.splice($vm.searchResultModel.indexOf(param), 1);
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "success"
                    })
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Error"
                    })
                }
            }, function error(res) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "Error API"
                })
            });;
        }


        $scope.pageOption = [{
            'value': 30
        }, {
            'value': 50
        },
        {
            'value': 100
        },
        {
            'value': 500
        },
        ];

        $scope.changePage = function () {
            var page = $vm.filterModel;
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }

            $vm.triggerSearch(page);
        }

        $scope.changeTableSize = function () {
            let ChangeTable = 1;
            var p = $vm.filterModel;

            $vm.triggerSearch(p);
        }

        $vm.filterModel = {
            num: 1,
            totalRow: 0,
            currentPage: 1,
            maxSize: 10,
            perPage: $vm.filterModel.perPage,
        };
        // function serchPage(data) {
        //     if (data != null) {
        //         pageLoading.show();
        //         viewModel.filter(data).then(function (res) {

        //             pageLoading.hide();
        //             if (res.data.length != 0 && res.data.length != undefined) {
        //                 $vm.filterModel.totalRow = res.data[0].count;
        //                 $vm.searchResultModel = res.data;

        //             }
        //             else {
        //                 if (res.data.pagination != null) {
        //                     $vm.filterModel.totalRow = res.data.pagination.totalRow;
        //                     $vm.filterModel.currentPage = res.data.pagination.currentPage;
        //                     $vm.searchResultModel = res.data.items;

        //                 }
        //             }
        //         })
        //     }
        // }

        var init = function () {
            $scope.selected = 1;
            $scope.colortab1 = "#FDFEFE";
            $scope.colortab2 = "#D3D3D3";
            $scope.colortab3 = "#D3D3D3";
        };
        init();

    }
});