'use strict'
app.component('packConfirmPWBTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/packConfirmPWB/component/packConfirmPWBTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsIssueFactory, packConfirmPWBFactory, posFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = packConfirmPWBFactory;
        var _viewModel = posFactory;

        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
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

        $scope.editItem = function (param) {
            _viewModel.checkUser(param.posIndex).then(function (res) {
                if (res.data == "" || res.data == undefined
                    || res.data == null || res.data == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    _viewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {

                                if (result == '1') {
                                    $vm.filterModel.chkinitpage = true;
                                    $vm.triggerSearch();
                                    $vm.isFilter = true;
                                }
                                else {
                                    $vm.isFilter = true;
                                }

                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    });
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        param.UserAssign = $scope.userName;
                        _viewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                $scope.onShow(param).then(function (result) {

                                    if (result == '1') {
                                        $vm.filterModel.chkinitpage = true;
                                        $vm.triggerSearch();
                                        $vm.isFilter = true;
                                    }
                                    else {
                                        $vm.isFilter = true;
                                    }

                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }, function error(res) { });
                    });
                }
            });


            // if ($scope.onShow) {
            //     $vm.isFilter = false;
            //     $scope.onShow(param).then(function (result) {

            //         if (result == '1') {
            //             $vm.filterModel.chkinitpage = true;
            //             $vm.triggerSearch();
            //             $vm.isFilter = true;
            //         }
            //         else {
            //             $vm.isFilter = true;
            //         }

            //     }).catch(function (error) {
            //         defer.reject({ 'Message': error });
            //     });
            // }
        }

        $scope.closed = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Close',
                message: 'Do you want to Confirm ?'
            }).then(function success() {
                viewModel.checkUser(param.posIndex).then(function (res) {

                    if (res.data) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "User ไม่ตรงกับ UserAssign"
                        })
                    }
                    else {

                        var dataConfirm = {PlanGoodsIssue_No : param.planGoodsIssueNo , Update_By : $scope.userName}
                        viewModel.ConfirmPacked(dataConfirm).then(function success(res) {
                            if (res.data.statusCode == "200") {
                                viewModel.Confirm(param).then(function success(res) {
                                    if (res.data == "Success") {
                                        // $state.reload();
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: "Success Confirm Data Status"
                                        });
                                        $vm.filterModel.chkinitpage = true;
                                        $vm.triggerSearch();
                                       
                                    }
                                   
                                }, function error(res) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "Error Confirm Data Status"
                                    });
                                 });
                            }else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Error.',
                                    message: "Error code " + res.data.statusCode + " | Result Interface : " + res.data.result
                                });
                            }},function error(res) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "Error Confirm Interface Status"
                                });
                             }) ;

                    }
                });
            });
        };

        $scope.getcolor = function(param)
        {
            let color = "";
            if (param == 2) {
                color = "#FFD3D3";
            }
            return color;
        }


        $scope.postInvoice = function (param) {
            viewModel.postInvoice(param).then(function success(res) {
                if (res.data != "" || res.data != undefined) {
                    $scope.popupReport.onClick(res.data)
                }
            }, function error(res) { });
        }

        $scope.postReceipt = function (param) {
            if (param != undefined) {
                param.ticketFrom = "2020-01-01";
                param.ticketTo = "2020-01-31";
            }
            viewModel.postReceipt(param).then(function success(res) {
                if (res.data != "" || res.data != undefined) {
                    $scope.popupReport.onClick(res.data)
                }
            }, function error(res) { });
        }

        $scope.PostShippmentDispatch = function (param) {
            viewModel.PostShippmentDispatch(param).then(function success(res) {
                if (res.data == "OK") {
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
                        message: "error"
                    })
                }
            }, function error(res) { });
        }

        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.viewPopup(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                }
            }
        };

        $scope.popupReportDO = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param.planGoodsIssueNo, "deliveryNote");
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                }
            }
        };


        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.planGoodsIssueIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };

        $scope.ConfirmShipment = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to ConfirmShipment ?'
            }).then(function success() {
                var item = angular.copy(param);
                var model = {};
                var idx = [];
                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        idx.push(v)
                    }
                });
                model = { 'listAutoPosModel': idx };
                $scope.filterModel = model;
                $scope.filterModel.sender = $scope.userName;
                viewModel.ConfirmShipment($scope.filterModel).then(function success(res) {
                    var contentArr = res.data.split(',');

                    debugger
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        messageNewLine: contentArr
                    })
                }, function error(res) {
                });
            });
        }


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

        // coload toggle
        $scope.showCoload = false;

        $scope.changeTableSize = function () {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
        };


        $scope.changePage = function () {
            var page = $vm.filterModel;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            $scope.serchPage(page);
        }

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];

        $scope.serchPage = function (param) {
            packConfirmPWBFactory.filter(param).then(function success(res) {
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.searchResultModel = res.data.items;

            }, function error(res) { });
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        var initForm = function () {
        };
        var init = function () {
        };
        init();

    }
});