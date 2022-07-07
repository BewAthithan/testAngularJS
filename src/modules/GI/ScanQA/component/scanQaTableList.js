'use strict'
app.component('scanQaTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/ScanQA/component/ScanQaTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanQaFactory) {
        var $vm = this;
        var viewModel = scanQaFactory;
        $scope.filterModel = {};
        // setting column
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

        $scope.Confirm = function (param) {
            let models = $vm.searchResultModel.filter(c => c.selected);
            ConfirmScan(models).then(function (res) {
                if (res.data == true) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Success ScanQA !!!"
                    })
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "ScanTicket Error !!!"
                    })
                }
                $vm.triggerSearch(true);
                // $vm.searchResultModel = $vm.searchResultModel.filter((member) => {
                //     return !member.selected
                //   })
                // setTimeout(() => {
                //     var focusElem = jQuery('input[ng-model="$scope.filterModel.Route"]');
                //     focusElem[0].focus();

                // }, 200);
            },
                function error(res) {

                });
        };

        function ConfirmScan(item) {
            
            let deferred = $q.defer();
            let userName = localStorageService.get('userTokenStorage');
            let param = "";
            var validateChk = "";
            var validateQty = "";
            // if (item.length > 0) {
            //     for (var i = 0; i <= item.length - 1; i++) {
            //         if(parseInt(item[i].pickQty) + parseInt(item[i].qtyBackOrder) <= parseInt(item[i].qty))
            //         {

            //         }
            //     }
            // }

            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    if ($vm.searchResultModel[index].documentStatus != "-1")
                    {
                        validateChk = validateChk + ' ' + $vm.searchResultModel[index].planGoodsIssueNo;
                    }

                    // if(parseInt($vm.searchResultModel[index].pickQty) + parseInt($vm.searchResultModel[index].qtyBackOrder) > parseInt($vm.searchResultModel[index].qty))
                    // {
                    //     validateChk = $vm.searchResultModel[index].tagOutPickNo;
                    //     validateQty += $vm.searchResultModel[index].productName +  ' Qty Invalid!!';
                    //     //validateQty += " Qty Invalid!!";
                    // }
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
            else if(validateChk != "" && validateQty != ""){
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: validateQty
                });
                return;
            }
            else {
                if (item.length > 0) {
                    var Activity = [];
                    for (var i = 0; i <= item.length - 1; i++) {
                        let newItem = {};
                        if (item[i].selected == true) {
                            if (item[i].pickQty != undefined) {
                                newItem.planGoodsIssueItemIndex = item[i].planGoodsIssueItemIndex;
                                newItem.tagOutPickIndex = item[i].tagOutPickIndex;
                                newItem.pickQty = item[i].pickQty;
                                newItem.pickedBy = userName;
                            }
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
                    listScanQaViewModel: param
                }

                viewModel.confirmData(dataList).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

        }


        $scope.Clear = function () {
            //
            // $vm.searchResultModel = {};
            // $vm.filterModel = {};
            // $scope.filterModel = {};
            location.reload();
        }

        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };

        // coload toggle
        $scope.showCoload = false;
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

        var init = function () {
        };
        init();

    }
});