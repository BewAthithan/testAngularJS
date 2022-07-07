'use strict'
app.component('marshalConfirmTransferTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/MarshalConfirmTransfer/component/marshalConfirmTransferTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        pickingTools: '=?'

    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, marshalConfirmTransferFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = marshalConfirmTransferFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $scope.isFilter = true;


        $vm.$onInit = function () {
        }

        $vm.release = function () {

            if ($scope.pickingTools) {
                $vm.isFilter = false;
                $scope.pickingTools().then(function () {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }


        $vm.triggerCreate = function () {
            if ($scope.pickingTools) {
                $vm.isFilter = false;
                $scope.pickingTools().then(function (result) {
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };


        $scope.Confirm = function (param) {
            var validateChk = "";
            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    if ($vm.searchResultModel[index].documentStatus != "-1")
                        validateChk = validateChk + ' ' + $vm.searchResultModel[index].marshallNo;
                }
            }
            if (validateChk == "") {
                MessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'กรุณาเลือกข้อมูล !!'
                });
                return;
            }
            else {
                MessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm.',
                    message: 'Do You Want to Confirm ?'
                }).then(function success() {
                    var item = angular.copy($vm.searchResultModel);
                    var models = [];
                    angular.forEach(item, function (v, k) {
                        if (v.selected) {
                            models.push(v);
                        }
                    });
                    goToConfirm(models);
                });
            }
        }

        function goToConfirm(param) {
            var deferred = $q.defer();
            var item = { ListGetConfirmMarshallViewModel: [] };

            for (let index = 0; index < param.length; index++) {
                item.ListGetConfirmMarshallViewModel.push(param[index]);
            }
            Progressbar.show();
            var msg = validate();
            if (msg != '') {
                deferred.reject(msg);
            } else {

                viewModel.ConfirmMarshall(item).then(
                    function success(results) {
                        if (results.data == "ready") {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "SO นี้ มีการ ConfirmMarshall แล้ว"
                            })
                        }
                        else {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Confirm Success"
                            })
                            $vm.triggerSearch();
                            Progressbar.hide();
                            deferred.resolve(results);
                        }

                    },
                    function error(response) {
                        Progressbar.hide();
                        MessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    }
                );

            }
            return deferred.promise;
        }

        $scope.delete = function (item) {
            item.userName = $scope.userName;
            MessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirm ?',
                message: 'Do you want to Delete !'
            }).then(function () {
                viewModel.getDelete(item).then(
                    function success(results) {
                        if (results.data) {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Delete Success"
                            })
                            $state.reload();
                        }
                        else if (results.data == false) {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "So No นี้ confirm แล้ว ไม่สามารถลบได้"
                            })
                        } else {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "ERROR"
                            })
                        }
                        Progressbar.hide();
                    },
                    function error(response) {
                        Progressbar.hide();
                        MessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    }
                );
            });
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
        $scope.pageMode = 'Master';

        $scope.$watch('tblHeader', function (n, o) {
            if (n) {
                localStorageService.set(_storageName, n);
            }
        }, true);

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
            viewModel.confirmMarshallSearch(param).then(function success(res) {
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.searchResultModel = res.data.items;

            }, function error(res) { });
        }


        var initForm = function () {
        };
        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});