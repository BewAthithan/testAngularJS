'use strict'
app.component('runWaveTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/runWave/component/runWaveTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, runWaveFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = runWaveFactory;
        var item = $vm.searchResultModel;
        var MessageBox = dpMessageBox;
        // setting column
        $scope.showColumnSetting = false;

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

        $scope.editItem = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        function validate(param) {
            var msg = "";
            return msg;
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

        $scope.RunWave = function (param) {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            $scope.dateTime2 = date + ' ' + time;

            var validateChk = "";

            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    validateChk = validateChk + ' ' + $vm.searchResultModel[index].planGoodsIssueNo;
                }
            }

            if (param.waveIndex == null) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'Please choose wave template"'
                });
                return;
            }

            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'Please choose sale order'
                });
                return;
            }


            else {
                MessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm.',
                    message: 'Do You Want to Run Wave ?'
                }).then(function success() {
                    var item = angular.copy($vm.searchResultModel);
                    var Wave_Index = angular.copy($vm.searchResultModel.waveIndex);
                    var models = {};
                    var idx = [];
                    angular.forEach(item, function (v, k) {

                        if (v.selected) {
                            idx.push(v.planGoodsIssueIndex)
                        }
                    });
                    models = { 'planGoodsIssueIndex': idx, Wave_Index };
                    RunWave(models);
                });
            }

        }

        function RunWave(param) {
            var deferred = $q.defer();
            var item = param;
            Progressbar.show();
            var msg = validate();
            if (msg != '') {
                deferred.reject(msg);
            } else {
                item.create_By = localStorageService.get('userTokenStorage');
                if (param.incomplete) {
                    item.isPageRunWave = false;
                }
                else {
                    item.isPageRunWave = true;
                }
                viewModel.RunWave(item).then(
                    function success(results) {
                        // var today = new Date();
                        // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        // var dateTime = date + ' ' + time;
                        var contentArr =  results.data.result[0].param_1.split('<br>');
                        if(parseInt(results.data.statusCode) >= 4000 && parseInt(results.data.statusCode) <= 5999) {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Error.',
                                message: results.data.statusDesc
                            });
                        } else {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                messageNewLine:  contentArr
                            });
                        }
                        Progressbar.hide();
                        deferred.resolve(results);
                        //$vm.triggerSearch(true);
                        $scope.changePage();
                    },
                    function error(response) {
                        Progressbar.hide();
                        // MessageBox.alert({
                        //     ok: 'Close',
                        //     title: 'Information.',
                        //     message: 'RunWave Fail !!'
                        // })
                        // var today = new Date();
                        // var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                        // var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                        // var dateTime = date + ' ' + time;
                        MessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm.',
                            message: "Order  นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่ "
                            // message: "Order  นี้ ไม่สมบูรณ์ ต้องการ ซ่อมดาต้าหรือไม่ " + $scope.dateTime2 + " หลัง " + dateTime
                        }).then(function success() {
                            param.incomplete = true;
                            RunWave(param)
                        });
                        deferred.reject(response);
                        // $vm.triggerSearch(true);
                        $scope.changePage();
                    }
                );
            }
            return deferred.promise;
        }

        $scope.test = function () {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            viewModel.test({}).then(
                function success(results) {
                    var today2 = new Date();
                    var date2 = today2.getFullYear() + '-' + (today2.getMonth() + 1) + '-' + today2.getDate();
                    var time2 = today2.getHours() + ":" + today2.getMinutes() + ":" + today2.getSeconds();
                    var dateTime2 = date2 + ' ' + time2;
                    MessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        // message: results.data
                        message: "ไม่พัง เริ่ม" + dateTime + " จบ " +dateTime2
                    })
                },
                function error(response) {
                    var today3 = new Date();
                    var date3 = today3.getFullYear() + '-' + (today3.getMonth() + 1) + '-' + today3.getDate();
                    var time3 = today3.getHours() + ":" + today3.getMinutes() + ":" + today3.getSeconds();
                    var dateTime3 = date3 + ' ' + time3;
                    MessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        // message: results.data
                        message: "พัง เริ่ม" + dateTime + " จบ " +dateTime3
                    })
                }
            );
        }

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }


        $scope.popupWavetemple = {
            onShow: false,
            delegates: {},
            onClick: function (param, index) {
                $scope.popupWavetemple.onShow = !$scope.popupWavetemple.onShow;
                $scope.popupWavetemple.delegates.waveTemplatePopup(param, index);
            },
            config: {
                title: "wave"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    $vm.searchResultModel.waveIndex = angular.copy(param.waveIndex);
                    $vm.searchResultModel.waveId = angular.copy(param.waveId);
                    $vm.searchResultModel.waveName = angular.copy(param.waveName);

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
            { value: 15 },
            {
                value: 30
            }
        ];



        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.serchPage = function (param) {

            viewModel.runWavesearch(param).then(function success(res) {

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