'use strict'
app.component('assignTaskTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/AssignTask/component/AssignTaskTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, assignTaskFactory, scanTaskFactory) {
        var $vm = this;
        var viewModel = assignTaskFactory;
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
                $vm.filterModel.tab = false;
            }
            else if (tab == 2) {
                $scope.colortab1 = "#D3D3D3";
                $scope.colortab2 = "#FDFEFE";
                $vm.filterModel.tab = true;
            }
            $vm.triggerSearch();
            // viewModel.filter($vm.filterModel).then(function (res) {
            //     pageLoading.hide();
            //     if (res.data.length != 0 && res.data.length != undefined) {
            //         $vm.filterModel.totalRow = res.data[0].count;
            //         $vm.searchResultModel = res.data;

            //     }
            //     else {
            //         if (res.data.pagination != null) {
            //             $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             $vm.filterModel.currentPage = res.data.pagination.currentPage;
            //             $vm.searchResultModel = res.data.items;

            //         }
            //     }
            // })
            $scope.selected = tab;
        }

        $scope.selectTask = function (param) {
            param.userName = localStorageService.get('userTokenStorage');
            viewModel.CheckTask(param.userName).then(function (res) {
                if (!res.data && !$vm.filterModel.tab) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Alert ?',
                        message: "กรุณาทำงานที่ถูก assign ให้เสร็จก่อน"
                    });
                    $vm.triggerSearch();
                }
                else {
                    _viewModel.checkCartDataAssign(param).then(function success(res) {
                        if (res.data.msgResult == "False") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User not match"
                            })
                            $vm.triggerSearch();
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
                                    if (param != null) {
                                        _viewModel.setParam(res.data.itemResult);
                                        $state.go('tops.scan_task_drop', {})
                                    }
                                });
                            }
                            else if (res.data.msgResult == "PrintRF") {
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

            // viewModel.updateUserAssign(param).then(function (res) {
            //     if (res.data) {
            //         viewModel.setParam(param);
            //         $state.go('tops.scan_task', {})
            //     }
            //     else {
            //         dpMessageBox.alert({
            //             ok: 'Close',
            //             title: 'Information.',
            //             message: "Error"
            //         })
            //     }
            // }, function error(res) {
            //     dpMessageBox.alert({
            //         ok: 'Close',
            //         title: 'Information.',
            //         message: "Error API"
            //     })
            // });;
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
        };
        init();

    }
});