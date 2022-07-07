(function () {
    'use strict'

    app.component('cartAssignPickingV2', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CartAssignV2/component/cartAssignPickingV2.html",
        bindings: {
            isLoadingPicking: '=?',
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $filter, $http, $state, pageLoading, localStorageService, commonService, $timeout, $translate, $q, dpMessageBox, cartAssignFactory, cartNumberFactory, taskListFactory) {
            var $vm = this;
            var viewModel = cartAssignFactory;
            var _viewModel = cartNumberFactory;
            // var viewModel3 = taskListFactory;

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

            $vm.isLoadingPicking = function (param) {
                defer = $q.defer();
                $vm.isLoading = false;
                $vm.isLoadingPicking = true;
                if (param != undefined) {

                }
                else {
                }
                return defer.promise;
            };


            $scope.Confirm = function () {
                $scope.filterModel.userName = localStorageService.get('userTokenStorage');
                var defer = $q.defer();
                if ($scope.filterModel.equipmentItemName == undefined || $scope.filterModel.equipmentItemName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Cart Location is Required"
                    })
                }
                else {
                    _viewModel.checkCartDataAssignV2($scope.filterModel).then(function success(res) {
                        if(res.data.msgResult == "False")
                        {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Cart Location is incorrect"
                            })
                        }
                        else
                        {
                        if(res.data.msgResult == "Pick")
                        {
                            viewModel.setParam(res.data.itemResult);
                            $state.go('tops.cart_number_summary', { })
                        }
                        else if(res.data.msgResult == "Drop")
                        {
                            dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: 'Confirm ?',
                                    message: " Cart Location " + res.data.itemResult[0].equipmentItem_Name + " Completed !! But not yet Drop Staging"
                                }).then(function () { 
                                    if ($scope.filterModel != null) {
                                        _viewModel.setParam(res.data.itemResult);
                                        $state.go('tops.put_to_staging', { })
                                }
                            });
                        }
                        else if(res.data.msgResult == "PrintRF")
                        {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Confirm ?',
                                message: " Cart Location " + $scope.filterModel.equipmentItemName + " Completed !!"
                            }).then(function () { 
                                if ($scope.filterModel != null) {
                                    // viewModel3.setParam($scope.filterModel.equipmentItemName);
                                    viewModel.setParam($scope.filterModel.equipmentItemName);
                                    $state.go('tops.print_carton', { })
                            }
                        });
                        }
                    }
                        defer.resolve();
                    })       
                }
            }
            $scope.back = function () {
                //defer.resolve('0');
                $state.go('tops.cart_assign_summary', {
                })
            }

            $("#focusScanLocation").bind("focus", function () {
                setTimeout(() => {
                    $("#focusScanLocation").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#focusScanLocation").attr("readonly", "readonly");
            });

            var init = function () {
                $scope.tme = viewModel.getTime();
                let item = viewModel.getParam();
                if (item != undefined) {
                    if(item == "")
                    {
                        $scope.filterModel.equipmentItemName = "";
                    }
                    else if (item[0].equipmentItem_Name != undefined)
                    {
                        $scope.filterModel.equipmentItemName = item[0].equipmentItem_Name
                    }
                    else if(item != "")
                    {
                        $scope.filterModel.equipmentItemName = item;
                    }
                }
                else {
                    $scope.filterModel.equipmentItemName = "";
                }
                if ($scope.filterModel.equipmentItemName == "") {
                    document.getElementById("focusScanLocation").focus();
                }
            };
            init();
        }

    })
})();