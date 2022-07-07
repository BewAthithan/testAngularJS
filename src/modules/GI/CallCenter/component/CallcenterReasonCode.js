(function () {
    'use strict'
    app.component('callCenterReasonCode', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/CallCenter/component/CallcenterReasonCode.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
            reasonCode: '=?',
            isFilterTable: '=?'

        },
        controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, reasonCodeFactory, cartNumberFactory) {
            var $vm = this;
            $scope.items = [];
            $scope.items = $scope.items || [];
            // setting column
            $scope.reasonCode = false;
            
            var viewModel = reasonCodeFactory;
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
            $vm.reasonCode = function (param) {
                
                defer = $q.defer();
                $scope.filterModel = param;
                $vm.isFilterTable  = false;
                $scope.reasonCode = true;

                return defer.promise;
            };

            function validate() {
                let formData = $scope.formData;
                let formFilter = $scope.filterModel;
                if (formFilter.length > 0) {
                    for (var i = 0; i <= formFilter.length - 1; i++) {                       
                        $scope.StatusTaskItem.taskItemIndex = formFilter[0].taskItemIndex;
                        $scope.StatusTaskItem.reasonCodeId = formData.reasonCodeId;
                        $scope.StatusTaskItem.reasonCodeIndex = formData.reasonCodeIndex;
                        $scope.StatusTaskItem.reasonCodeName = formData.reasonCodeName;
                        $scope.StatusTaskItem.updateBy = $scope.userName;
                    }

                }
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
                var defer = $q.defer();
                let _viewModel = cartNumberFactory;
                validate();
                pageLoading.show();
                _viewModel.updateStatusTaskItem($scope.StatusTaskItem).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.length > 0) {
                        $scope.reasonCodeAllItem = res.data;
                    }
                }, function error(param) {
                    // dpMessageBox.alert({
                    //     ok: 'Close',
                    //     title: 'Information.',
                    //     message: " Error !!"
                    // })
                });

                defer.resolve();
            }

            $scope.reasonCode = function () {
                let selectedReason = $scope.formData;
                if (selectedReason != null) {
                    let newItem = [];
                    let item = $scope.reasonCodeAllItem;
                    for (var i = 0; i <= item.length - 1; i++) {
                        let addparam = {};
                        if (selectedReason.reasonCodeName == item[i].reasonCodeName) {
                            addparam.reasonCodeIndex = item[i].reasonCodeIndex;
                            addparam.reasonCodeName = item[i].reasonCodeName;
                            addparam.reasonCodeId = item[i].reasonCodeId;

                            newItem.push(addparam);
                        }
                    }
                    $scope.formData.reasonCodeName = newItem[0].reasonCodeName;
                    $scope.formData.reasonCodeIndex = newItem[0].reasonCodeIndex;
                    $scope.formData.reasonCodeId = newItem[0].reasonCodeId;
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
                    // dpMessageBox.alert({
                    //     ok: 'Close',
                    //     title: 'Information.',
                    //     message: " Error !!"
                    // })
                });

                defer.resolve();
            }
            $scope.NotConfirm = function () {
                defer.resolve('');
            }

            var init = function () {
                searchData();
            };
            init();

        }
    })
})();