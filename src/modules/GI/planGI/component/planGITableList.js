'use strict'
app.component('planGiTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/planGI/component/planGITableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsIssueFactory) {
        var $vm = this;
        $scope.items = $scope.items || [];
        var viewModel = planGoodsIssueFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: $vm.filterModel.numPerPage,
                num: 1,
                maxSize: 2,
                perPage: 20,
                change: function () {
                    $vm.filterModel.currentPage = this.currentPage - 1;
                    if ($vm.triggerSearch) {
                        $vm.triggerSearch();
                    }
                },
                changeSize: function () {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    $vm.triggerSearch();
                }
            }
            $scope.userName = localStorageService.get('userTokenStorage');

        }

        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = true;
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                });
            }
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

        // dpMessageBox.confirm({
        //     ok: 'Yes',
        //     cancel: 'No',
        //     title: 'InformaTion',
        //     message: 'Do you want to Cancel ?'
        // }).then(function success() {
        //     param.cancelBy =  localStorageService.get('userTokenStorage');
        //     viewModel.getDelete(param).then(function success(res) {
        //         $vm.triggerSearch();
        //     }, function error(res) { });
        // });

        $scope.editItem = function (param) {
            viewModel.getId(param.planGoodsIssueIndex).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    viewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {
                                pageLoading.hide();
                                $vm.isFilter = true;
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    });
                }
                // if (res.data.userAssign != $scope.UserName) {
                else {
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
        }
        $scope.confirm_Status = function () {
            var validateChk = "";
            var chkStatus = "";
            var chkStatusClose = "";
            let defer = $q.defer();
            let models = $vm.searchResultModel;
            for (let i = 0; i <= $vm.searchResultModel.length; i++) {
                if ($vm.searchResultModel[i] != undefined) {
                    if ($vm.searchResultModel[i].selected) {
                        // if ($vm.searchResultModel[index].documentStatus != "-1")
                        validateChk = validateChk + ' ' + $vm.searchResultModel[i].planGoodsIssueNo;
                    }
                }

            }

            for (let index = 0; index <= $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index] != undefined) {
                    if ($vm.searchResultModel[index].selected == true) {
                        if ($vm.searchResultModel[index].documentStatus != "-1")
                            chkStatus = $vm.searchResultModel[index].documentStatus;
                    }
                }

            }

            for (let index = 0; index <= $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index] != undefined) {
                    if ($vm.searchResultModel[index].selected == true) {
                        if ($vm.searchResultModel[index].documentStatus == "-1")
                            chkStatusClose = $vm.searchResultModel[index].documentStatus;
                    }
                }

            }

            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'กรุณาเลือกข้อมูล !!'
                });
                return;
            }
            if (chkStatusClose == "-1") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'เอกสารมีการยกเลิกไปแล้ว !!'
                });
                return;
            }
            if (chkStatus != "0") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'เอกสารได้รับการยืนยันไปแล้ว !!'
                });
                return;
            }


            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to ConfirmStatus !'
                }).then(function () {

                    pageLoading.show();
                    ConfirmStatus(models).then(function success(res) {
                        pageLoading.hide();
                        $state.reload($state.current.name);
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            }


            defer.resolve();

        }

        $scope.closed_Status = function () {
            var validateChk = "";
            var chkStatus = "";
            let defer = $q.defer();
            let models = $vm.searchResultModel;
            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    if ($vm.searchResultModel[index].documentStatus != "-1")
                        validateChk = validateChk + ' ' + $vm.searchResultModel[index].planGoodsIssueNo;
                }
            }
            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    if ($vm.searchResultModel[index].documentStatus == "-1")
                        validateChk = validateChk + $vm.searchResultModel[index].documentStatus;
                }
            }
            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    if ($vm.searchResultModel[index].documentStatus == "0")
                        chkStatus = chkStatus + $vm.searchResultModel[index].documentStatus;
                }
            }
            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'กรุณาเลือกข้อมูล !!'
                });
                return;
            }



            if (validateChk == "-1") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'เอกสารมีการยกเลิกไปแล้ว !!'
                });
                return;
            }


            if (chkStatus == "0") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'เอกสารยังไม่ได้รับการยืนยัน ไม่สามารถ Closed ได้ !!'
                });
                return;
            }

            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to Close !'
                }).then(function () {
                    pageLoading.show();
                    CloseStatus(models).then(function success(res) {
                        pageLoading.hide();
                        $state.reload($state.current.name);
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            }
            defer.resolve();
        }

        $scope.copy_So = function () {
            let defer = $q.defer();
            let models = $vm.searchResultModel;
            var validateChk = "";

            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    if ($vm.searchResultModel[index].documentStatus != "-1")
                        validateChk = validateChk + ' ' + $vm.searchResultModel[index].planGoodsIssueNo;
                }
            }

            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'กรุณาเลือกข้อมูล !!'
                });
                return;
            }
            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to Copy !'
                }).then(function () {
                    pageLoading.show();
                    CopySo(models).then(function success(res) {
                        pageLoading.hide();
                        if (res.data == "Fail") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Order นี้อยู่ในระหว่างการหยิบสินค้า ไม่สามารถ Reschedule ได้ กรุณาลองใหม่หลังหยิบเสร็จ"
                            })
                        }
                        else if(res.data == "true") {
                            $vm.triggerSearch();
                        }
                        else
                        {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data
                            })
                        }
                    }, function error(ex) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: ex
                        })
                    });
                });
            }
            defer.resolve();
        }


        function CopySo(item) {
            let deferred = $q.defer();
            let userName = localStorageService.get('userTokenStorage');
            let param = "";
            if (item.length > 0) {
                var Activity = [];
                for (var i = 0; i <= item.length - 1; i++) {
                    let newItem = {};
                    if (item[i].selected == true) {
                        newItem.planGoodsIssueIndex = item[i].planGoodsIssueIndex;
                        newItem.createBy = userName;
                        newItem.updateBy = userName;
                    }
                    else {
                        newItem.emtry = 1;
                    }
                    if (newItem.emtry != 1) {
                        Activity.push(newItem);
                    }
                }
            }
            if (Activity) {
                param = Activity;
            }
            let dataList = {
                listPlanGoodIssueViewModel: param
            }

            viewModel.copySo(dataList).then(
                function success(results) {
                    debugger
                    deferred.resolve(results);
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function CloseStatus(item) {
            let deferred = $q.defer();
            let userName = localStorageService.get('userTokenStorage');
            let param = "";
            if (item.length > 0) {
                var Activity = [];
                for (var i = 0; i <= item.length - 1; i++) {
                    let newItem = {};
                    if (item[i].selected == true) {
                        newItem.createBy = userName;
                        newItem.documentStatus = 6;
                        newItem.planGoodsIssueIndex = item[i].planGoodsIssueIndex;
                        newItem.planGoodsIssueNo = item[i].planGoodsIssueNo;
                        newItem.updateBy = userName;
                    }
                    else {
                        newItem.emtry = 1;
                    }
                    if (newItem.emtry != 1) {
                        Activity.push(newItem);
                    }
                }
            }
            if (Activity) {
                param = Activity;
            }
            let dataList = {
                listPlanGoodIssueViewModel: param
            }

            viewModel.UpdateStatus(dataList).then(
                function success(results) {
                    deferred.resolve(results);
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        function ConfirmStatus(item) {
            let deferred = $q.defer();
            let userName = localStorageService.get('userTokenStorage');
            let param = "";
            if (item.length > 0) {
                var Activity = [];
                for (var i = 0; i <= item.length - 1; i++) {
                    let newItem = {};
                    if (item[i].selected == true) {
                        newItem.createBy = userName;
                        newItem.documentStatus = 1;
                        newItem.planGoodsIssueIndex = item[i].planGoodsIssueIndex;
                        newItem.planGoodsIssueNo = item[i].planGoodsIssueNo;
                        newItem.updateBy = userName;
                    }
                    else {
                        newItem.emtry = 1;
                    }
                    if (newItem.emtry != 1) {
                        Activity.push(newItem);
                    }
                }
            }
            if (Activity) {
                param = Activity;
            }
            let dataList = {
                listPlanGoodIssueViewModel: param
            }

            viewModel.UpdateStatus(dataList).then(
                function success(results) {
                    deferred.resolve(results);
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        $scope.delete = function (param) {
            if (param.documentStatus == 3) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Alert',
                    message: 'ทำการ RunWave ไปแล้ว ไม่สามารถลบได้ '
                })
            }
            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'InformaTion',
                    message: 'Do you want to Cancel ?'
                }).then(function success() {
                    param.cancelBy = localStorageService.get('userTokenStorage');
                    viewModel.getDelete(param).then(function success(res) {
                        $vm.triggerSearch();
                    }, function error(res) { });
                });
            }
        };
        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };
        // coload toggle
        $scope.showCoload = false;
  
        $scope.changeTableSize = function() {
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

        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.serchPage = function (param) {                     
            viewModel.planGIsearch(param).then(function success(res) {           
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                $vm.filterModel.perPage = res.data.pagination.perPage;   
                $vm.filterModel.numPerPage = res.data.pagination.perPage;   
                $vm.searchResultModel = res.data.items;

            }, function error(res) { });
        }
        $scope.popupReason = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReason.onShow = !$scope.popupReason.onShow;
                $scope.popupReason.delegates.popupReason(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (item, param) {
                    var obj = {};
                    obj.PlanGoodsIssueIndex = item.planGoodsIssueIndex;
                    obj.ReasonCodeIndex = param.reasonCodeIndex
                    obj.ReasonCodeId = param.reasonCodeId;
                    obj.ReasonCodeName = param.reasonCodeName;
                    obj.UserName = localStorageService.get('userTokenStorage');
                    viewModel.updateReason(obj).then(
                        function success(results) {

                            if (results.data) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "Confirm Success"
                                })
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "ERROR"
                                })
                            }
                            //Progressbar.hide();
                            $state.reload();
                        },
                        function error(response) {
                            //Progressbar.hide();
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "ERROR"
                            })
                            deferred.reject(response);
                        }
                    );
                }
            }
        };

        var init = function () {
        };
        init();

    }
});