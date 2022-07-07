(function () {
    'use strict'
    app.component('cartShortPick', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/CartNumber/component/cartShortPick.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            pickingTools: '=?',
            isLoading: '=?',
            pickingToolsList: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, reasonCodeMasterFactory, cartNumberFactory) {
            var $vm = this;
            $scope.items = [];
            $scope.items = $scope.items || [];
            $scope.StatusTaskItem = {};
            $vm.pickingToolsList = {};
            // setting column 
            var viewModel = reasonCodeMasterFactory;
            $vm.$onInit = function () {
            }
            var defer = {};

            $scope.filterModel = {
                currentPage: 0,
                numPerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };
            $vm.isLoading = function (param) {
                defer = $q.defer();
                $scope.filterModel = param;
                $scope.isLoading = true;
                $vm.pickingToolsList = $vm.pickingTools;
                $vm.pickingTools = false;
                if ($scope.StatusTaskItem != null) {
                    $scope.StatusTaskItem = {};
                }
                if ($scope.formData != null) {
                    $scope.formData = {};
                }


                return defer.promise;
            };

            function validate() {
                let defer = $q.defer();
                let formData = $scope.formData;
                let msg = "";
                if (formData == undefined || formData == null) {
                    msg = ' กรุณาเลือกเหตุผลที่จะ Short Pick !'
                    defer.resolve(msg);
                }
                else if (formData.reasonCodeIndex == undefined || formData.reasonCodeIndex == "" ) {
                    msg = ' กรุณาเลือกเหตุผลที่จะ Short Pick !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);
    
                return defer.promise;
            }

            function checkData() {
                let formData = $scope.formData;
                let formFilter = $scope.filterModel;
                $scope.StatusTaskItem.totalQty = formFilter.totalQty;
                $scope.StatusTaskItem.taskIndex = formFilter.taskIndex;
                $scope.StatusTaskItem.taskItemIndex = formFilter.taskItemIndex;
                $scope.StatusTaskItem.goodsIssueIndex = formFilter.goodsIssueIndex;
                $scope.StatusTaskItem.documentStatus = formFilter.documentStatus;
                $scope.StatusTaskItem.numberOfScan = formFilter.numberOfScan;
                $scope.StatusTaskItem.productConversionIndex = formFilter.productConversionIndex;
                $scope.StatusTaskItem.refDocumentItemIndex = formFilter.refDocumentItemIndex;
                $scope.StatusTaskItem.pickingRatio = formFilter.ratio;
                $scope.StatusTaskItem.reasonCodeId = formData.reasonCodeId;
                $scope.StatusTaskItem.reasonCodeIndex = formData.reasonCodeIndex;
                $scope.StatusTaskItem.reasonCodeName = formData.reasonCodeName;           
                $scope.StatusTaskItem.updateBy = $scope.userName;
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

            $scope.Confirm = function () {
                let _viewModel = cartNumberFactory;                
                $scope.validateMsg = "";
                validate().then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    } 
                    else {
                        checkData();
                        pageLoading.show();
                        _viewModel.updateStatusTaskItem($scope.StatusTaskItem).then(function success(res) {
                            pageLoading.hide();
                            $vm.pickingTools = $vm.pickingToolsList;
                            defer.resolve('');

                            // if (res.data) {
                            //     dpMessageBox.alert({
                            //         ok: 'Yes',
                            //         title: 'Information.',
                            //         message: " ShortPick Success "
                            //     })

                            //     defer.resolve();
                            // }
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " Error !!"
                            })
                        });
                    }
                })


            }

            $scope.reasonCode = function () {
                let selectedReason = $scope.formData;
                if (selectedReason != null) {
                    let newItem = [];
                    let item = $scope.reasonCodeAllItem;
                    if (item != true) {
                        for (var i = 0; i <= item.length - 1; i++) {
                            let addparam = {};
                            if (selectedReason.reasonCodeName != null) {
                                if (selectedReason.reasonCodeName == item[i].reasonCodeName) {
                                    addparam.reasonCodeIndex = item[i].reasonCodeIndex;
                                    addparam.reasonCodeName = item[i].reasonCodeName;
                                    addparam.reasonCodeId = item[i].reasonCodeId;

                                    newItem.push(addparam);
                                }
                            }

                        }
                        if ($scope.formData.reasonCodeName != null) {
                            $scope.formData.reasonCodeName = newItem[0].reasonCodeName;
                            $scope.formData.reasonCodeIndex = newItem[0].reasonCodeIndex;
                            $scope.formData.reasonCodeId = newItem[0].reasonCodeId;
                        }
                        else {
                            $scope.formData = null;
                        }

                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information',
                        message: 'ReasonCode Name is Null'
                    }).then(function ok() { });
                }
            }

            function searchData() {
                var defer = $q.defer();
                pageLoading.show();
                viewModel.filter().then(function success(res) {
                    pageLoading.hide();
                    if (res.data.length > 0) {
                        $scope.reasonCodeAllItem = res.data;
                    }
                }, function error(param) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Error !!"
                    })
                });

                defer.resolve();
            }
            $scope.NotConfirm = function () {
                defer.resolve('');
                $vm.pickingTools = $vm.pickingToolsList;
            }

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                searchData();
            };
            init();

        }
    })
})();