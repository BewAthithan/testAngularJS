'use strict'
app.component('callCenterTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/CallCenter/component/callCenterTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        reasonCode: '=?'

    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, callCenterFactory, planGoodsIssueItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = callCenterFactory;
        // setting column
        $scope.showColumnSetting = false;
        $vm.$onInit = function () {
            $scope.model = {};
            $scope.model.CreateBy = localStorageService.get('userTokenStorage');
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
            viewModel.getId(param.callCenterIndex).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    viewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            setTimeout(() => { document.getElementById("location").focus() }, 500);
                            $scope.onShow(param).then(function (result) {
                                $vm.isFilter = true;
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    });
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        param.UserAssign = $scope.userName;
                        viewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                setTimeout(() => { document.getElementById("location").focus() }, 500);
                                $scope.onShow(param).then(function (result) {
                                    $vm.isFilter = true;
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
            //         $vm.isFilter = true;
            //     }).catch(function (error) {
            //         defer.reject({ 'Message': error });
            //     });
            // }
        }

        var MessageBox = dpMessageBox;
        $scope.dragHead = '';
        $scope.dragImageId = "dragtable";

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }

        $scope.pageMode = 'Master';

        var init = function () {
            if ($scope.config.pageMode == "Search") {
                $scope.pageMode = "Search";
            }
        }

        $scope.showColumnSetting = false;

        $scope.toggleSetting = function () {
            $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        };

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.callCenterIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.close = function (param) {
            console.log("with param", param);
            var count = 0;
            var item = angular.copy(param);
            var model = {};
            var idx = [];
            angular.forEach(item, function (v, k) {
                if (v.selected) {
                    idx.push(v);
                    count++;
                }
            });
            model = { 'listCallCenterModel': idx };
            console.log(count);
            if(count == 0 ) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "เลือกรายการอย่างน้อย 1 รายการ"
                });
            } else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'InformaTion',
                    message: 'Do you want to Close ?'
                }).then(function success() {                    
                    $scope.CloseCall = 1;
                    $scope.filterModel = model;
                    $scope.filterModel.type = "filter";
                    $scope.popupReasonCode.onClick($scope.filterModel);
                });
            }
        }

        $scope.Close = function () {
            console.log("without param");

            for(i = 0; i < $scope.filterModel.listCallCenterModel.length; i++) {
                $scope.filterModel.listCallCenterModel[i].ReasonCodeIndex = $scope.filterModel.ReasonCodeIndex;
                $scope.filterModel.listCallCenterModel[i].ReasonCodeId = $scope.filterModel.ReasonCodeId;
                $scope.filterModel.listCallCenterModel[i].ReasonCodeName = $scope.filterModel.ReasonCodeName;
                $scope.filterModel.listCallCenterModel[i].IsAccept = $scope.filterModel.IsAccept;
                $scope.filterModel.listCallCenterModel[i].IsDissmiss = $scope.filterModel.IsDissmiss;
            }

            let dataList = $scope.filterModel.listCallCenterModel;
            for (var i = 0; i <= dataList.length - 1; i++) {
                $scope.filterModel.listCallCenterModel[i].CreateBy = $scope.model.CreateBy;
            }
            viewModel.Close($scope.filterModel).then(function success(res) {
                if(res.data == "false") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "กำลังทำงานอยู่ หรือ มีการกด Close ไปแล้ว "
                    });
                    $vm.triggerSearch();
                } else if(res.data == "true") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Close Success"
                    });
                    $vm.triggerSearch();
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: res.data.Message
                    });
                    $vm.triggerSearch();
                }
                $scope.CloseCall = null;
                // $state.reload();
                $vm.triggerSearch();
            }, function error(res) {
                // dpMessageBox.alert({
                //     ok: 'Close',
                //     title: 'Information.',
                //     message: "Rollback Save Error or Network-related"
                // })
            });
        };

        $scope.popupReasonCode = {
            onShow: false,
            delegates: {},
            onClick: function (param, index) {
                $scope.popupReasonCode.onShow = !$scope.popupReasonCode.onShow;
                $scope.popupReasonCode.delegates.reasonCodePopup(param, index);
            },
            config: {
                title: "ResonCode"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param, model) {

                    console.log(param, model);

                    $scope.filterModel.ReasonCodeIndex = angular.copy(param[0].reasonCodeIndex);
                    $scope.filterModel.ReasonCodeId = angular.copy(param[0].reasonCodeId);
                    $scope.filterModel.ReasonCodeName = angular.copy(param[0].reasonCodeName);
                    if (model == null) {
                        $scope.filterModel.IsAccept = angular.copy(param.IsAccept);
                        $scope.filterModel.IsDissmiss = angular.copy(param.IsDissmiss);
                    } else {
                        $scope.filterModel.IsAccept = angular.copy(model.IsAccept);
                        $scope.filterModel.IsDissmiss = angular.copy(model.IsDissmiss);
                    }

                    $scope.Close();
                }
            }
        };

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
            viewModel.search(param).then(function success(res) {
                $vm.filterModel = $scope.filterModel;
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.searchResultModel = res.data.items;
            }, function error(res) {});
        }

        var initForm = function () {};

        var init = function () {
            $scope.filterModel = {};
        };

        init();

    }
});