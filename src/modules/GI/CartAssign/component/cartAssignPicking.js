(function () {
    'use strict'

    app.component('cartAssignPicking', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CartAssign/component/cartAssignPicking.html",
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
        controller: function ($scope, $filter, $http, $state, pageLoading, localStorageService, commonService, $timeout, $translate, $q, dpMessageBox, cartAssignFactory, cartNumberFactory) {
            var $vm = this;
            var viewModel = cartAssignFactory;
            var _viewModel = cartNumberFactory;
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
                    // $scope.buttons.add = true;
                    // $scope.buttons.update = false;
                }
                return defer.promise;
            };

            function updateAssign() {
                let deferred = $q.defer();
                let model = {};
                model.userName = localStorageService.get('userTokenStorage');
                model.equipmentItemName = $scope.filterModel.equipmentItemName;
                _viewModel.upDateUserAssign(model).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.Confirm = function () {
                var models = $scope.filterModel.equipmentItemName;
                var defer = $q.defer();
                if (models == undefined || models == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Cart Location is Required"
                    })
                }
                else {
                    updateAssign();
                    _viewModel.checkCartDataAssign(models).then(function success(res) {
                        // if(res.data.itemsForCheck.length > 0){     

                        
                        if (res.data.itemsUse.length > 0) {

                            var recriepData = "";
                            if (models != null) {
                                recriepData = models;
                            } else {
                                recriepData = models.equipmentItemName;
                            }

                            if (recriepData != null) {


                                if (res.data.msg != "") {
                                    var contentArr = res.data.msg.split(',');


                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        // message: results.data
                                        messageNewLine: contentArr
                                    }).then(function success() {
                                        
                                        viewModel.setParam(recriepData);
                                        $state.go('tops.cart_number_summary', {
                                        })
                                    })
                                }
                                else
                                {
                                    viewModel.setParam(recriepData);
                                    $state.go('tops.cart_number_summary', {
                                    })
                                }
                            };
                        }
                        else {
                            if (res.data.itemCheckData.length > 0) {
                                if (res.data.itemsForCheck.length > 0) {
                                    var recriepData = res.data.itemsForCheck[0];
                                    if (recriepData != undefined || recriepData != null) {

                                        var sendData = "";
                                        sendData = recriepData.equipmentItemName;

                                        if (sendData != null) {
                                            viewModel.setParam(sendData);
                                            $state.go('tops.cart_number_summary', {
                                            })
                                        };
                                    }
                                    // =======
                                    //                     // updateAssign();
                                    //                     updateAssign(models).then(function success(res) {
                                    //                         if(res.data == true){
                                    //                             _viewModel.checkCartDataAssign(models).then(function success(res) {
                                    //                                 // if(res.data.itemsForCheck.length > 0){     
                                    //                                 if (res.data.itemsUse.length > 0) {        
                                    //                                     var recriepData = "";
                                    //                                     if (models != null) {
                                    //                                         recriepData = models;
                                    //                                     } 
                                    //                                     else {
                                    //                                         recriepData = models.equipmentItemName;
                                    //                                     }        
                                    //                                     if (recriepData != null) {
                                    //                                         viewModel.setParam(recriepData);
                                    //                                         $state.go('tops.cart_number_summary', {
                                    //                                         })
                                    //                                     };
                                    // >>>>>>> 93f989bf13f89176851b3693955faaed656a8f71
                                }
                                else {
                                    if (res.data.itemCheckData.length > 0) {
                                        if (res.data.itemsForCheck.length > 0) {
                                            var recriepData = res.data.itemsForCheck[0];
                                            if (recriepData != undefined || recriepData != null) {

                                                var sendData = "";
                                                sendData = recriepData.equipmentItemName;

                                                if (sendData != null) {
                                                    
                                                    viewModel.setParam(sendData);
                                                    $state.go('tops.cart_number_summary', {
                                                    })
                                                };
                                            }
                                        }
                                        else {
                                            dpMessageBox.confirm({
                                                ok: 'Yes',
                                                cancel: 'No',
                                                title: 'Confirm ?',
                                                message: " Cart Location " + $scope.filterModel.equipmentItemName + " Completed !! "
                                            }).then(function () {
                                                if ($scope.filterModel != null) {
                                                    _viewModel.setParam($scope.filterModel);
                                                    $state.go('tops.put_to_staging', {
                                                    })
                                                }
                                            });
                                        }
                                    }
                                    else {
                                        $scope.filterModel.equipmentItemName = "";
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: " Cart Location " + models + " Not Found !!"
                                        })
                                    }
                                }
                                // }
                                // else {
                                //     $scope.filterModel.equipmentItemName = "";
                                //     dpMessageBox.alert({
                                //         ok: 'Close',
                                //         title: 'Information.',
                                //         message: " Cart Location " + models + " Not Found !!"
                                //     })
                                // }  
                            }
                            else{
                                $scope.filterModel.equipmentItemName = "";
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " Cart Location " + models + " Not Found !!"
                                })
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
                    $scope.filterModel.equipmentItemName = item;
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