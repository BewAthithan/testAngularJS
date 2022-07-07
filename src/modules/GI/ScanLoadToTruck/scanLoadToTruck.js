(function () {
    'use strict'

    app.component('scanLoadToTruck', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/ScanLoadToTruck/scanLoadToTruck.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox,scanLoadToTruckFactory) {
            var $vm = this;

            var viewModel = scanLoadToTruckFactory;
            var defer = {};

            $vm.scanLoadToTruck = true;
            $scope.filterModel = {};

            $scope.ScanLoadNo = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendLoadNo($vm.filterModel).then(function success(res) {
                    // $vm.filterModel.loadNo = res.data[0].loadNo;
                    // setTimeout(() => {
                    //     var focusElem = jQuery('input[ng-model="$vm.filterModel.Route"]');
                    //     focusElem[0].focus();

                    // }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendLoadNo = function (model) {
                var deferred = $q.defer();
                viewModel.ScanLoadNo(model).then(
                    function success(res) {
                        
                        $scope.filterModel = res.data; 

                        document.getElementById("dockDoorConfirm").focus();
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ไม่พบ Load No !!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanRoute = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendRoute($vm.filterModel).then(function success(res) {
                    $vm.filterModel.Route = res.data[0].Route;
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.filterModel.cartonQty"]');
                        focusElem[0].focus();

                    }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendRoute = function (model) {
                var deferred = $q.defer();
                viewModel.ScanRoute(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanRound = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendRound($vm.filterModel).then(function success(res) {
                    $vm.filterModel.Round = res.data[0].Round;
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.filterModel.cartonQty"]');
                        focusElem[0].focus();

                    }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendRound = function (model) {
                var deferred = $q.defer();
                viewModel.ScanRound(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanDockDoor = function () {
                $vm.filterModel = $vm.filterModel || {};
                $scope.SendDockDoor($vm.filterModel).then(function success(res) {
                    $vm.filterModel.DockDoor = res.data[0].DockDoor;
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.filterModel.cartonQty"]');
                        focusElem[0].focus();

                    }, 200);
                },
                    function error(res) {

                    });
            }
            $scope.SendDockDoor = function (model) {
                var deferred = $q.defer();
                viewModel.ScanDockDoor(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanDockDoorConfirm = function (param) {
                if( $scope.filterModel.dockDoorName != $vm.filterModel.dockDoorConfirm)
                {
                    MessageBox.alert({
                        ok:'Close',
                        title: 'Information.',
                        message: "dock Door invalid confirm ."
                    })
                }
                else{
                    $vm.filterModel = $vm.filterModel || {};
                    
                    if(param != undefined)
                    {
                        $vm.chksoCartonList(param);
                    }
                    
                    // $scope.SendDockDoorConfirm($vm.filterModel).then(function success(res) {
                    //     $vm.filterModel.DockDoorConfirm = res.data[0].DockDoorConfirm;
                    //     setTimeout(() => {
                    //         var focusElem = jQuery('input[ng-model="$vm.filterModel.cartonQty"]');
                    //         focusElem[0].focus();

                    //     }, 200);
                    // },

                    // function error(res) {

                    // });
                }
            }
            $scope.SendDockDoorConfirm = function (model) {
                var deferred = $q.defer();
                viewModel.ScanDockDoorConfirm(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            $scope.ScanCarton = function () {
                if( $scope.filterModel.dockDoorName != $vm.filterModel.dockDoorConfirm)
                {
                    MessageBox.alert({
                        ok:'Close',
                        title: 'Information.',
                        message: "dock Door invalid confirm ."
                    })
                }
                else{
                    $vm.filterModel = $vm.filterModel || {};
                    $scope.SendCarton($vm.filterModel).then(function success(res) {
                        
                        MessageBox.alert({
                            ok:'Close',
                            title: 'Information.',
                            message: "Scan carton success!!"
                        })
                        $vm.filterModel = {};
                        $scope.filterModel = {};
                        // $vm.filterModel.Carton = res.data[0].Carton;
                        // setTimeout(() => {
                        //     var focusElem = jQuery('input[ng-model="$vm.filterModel.cartonQty"]');
                        //     focusElem[0].focus();
                            
                        // }, 200);
                    },
                
                    function error(res) {

                    });
                }
            }
            $scope.SendCarton = function (model) {
                var deferred = $q.defer();
                
                viewModel.ScanCarton(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }

            var MessageBox = dpMessageBox;

            $vm.chksoCartonList = function (param) {

                if (param == undefined || param.truckLoadNo == '')
                {
                    var focusElem = jQuery('input[ng-model="$vm.filterModel.truckLoadNo"]');
                        focusElem[0].focus();
                    MessageBox.alert({
                        ok:'Close',
                        title: 'Information.',
                        message: "Please input loading no."
                    })
                    deferred.reject(Response);
                }
                else{
                    if(($scope.filterModel.dockDoorName == undefined) ||  ($scope.filterModel.dockDoorName != $vm.filterModel.dockDoorConfirm))
                    {
                        MessageBox.alert({
                            ok:'Close',
                            title: 'Information.',
                            message: "dock Door invalid confirm ."
                        })
                    }
                    else{
                        if ($scope.expected) {
                            $vm.scanLoadToTruck = false;
                            $scope.expected(param).then(function (result) { 
                                $vm.scanLoadToTruck = true;
                                //var soNo = param[index].refDocumentNo;
                                var model = $scope.filterModel;

                                $scope.filterModel = {};
                                $vm.filterModel = {};
                                setTimeout(() => {
                                    $("#truckLoadNo").focus();
                                }, 300);
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    }
                    
                }
                
            }

            $vm.chkCartonList = function (param) {
                defer = $q.defer();

                if (param == undefined)
                {
                    var focusElem = jQuery('input[ng-model="$vm.filterModel.truckLoadNo"]');
                        focusElem[0].focus();
                    MessageBox.alert({
                        ok:'Close',
                        title: 'Information.',
                        message: "Please input loading no."
                    })
                    deferred.reject(Response);
                }
                else{
                    if ($scope.loadToTruckCartonList) {
                        $vm.scanLoadToTruck = false;
                        $scope.loadToTruckCartonList(param).then(function (result) { 
                            $vm.scanLoadToTruck = true;
                            // var soNo = param[index].refDocumentNo;
                            var model = $scope.filterModel;
                        }).catch(function (error) {
                            defer.reject({ 'Message': error });
                        });
                    }
                }
            }

            $("#truckLoadNo").bind("focus", function () {
                setTimeout(() => {
                    $("#truckLoadNo").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#truckLoadNo").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    //$("#focusScanLocation").focus();
                }
            });

            $("#dockDoorConfirm").bind("focus", function () {
                setTimeout(() => {
                    $("#dockDoorConfirm").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#dockDoorConfirm").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    //$("#focusScanLocation").focus();
                }
            });

            var init = function () {
                setTimeout(() => {
                    $("#truckLoadNo").focus();
                }, 300);
            }
            init();
        }
    })
})();