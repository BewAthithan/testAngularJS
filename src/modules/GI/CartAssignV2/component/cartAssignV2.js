(function () {
    'use strict'

    app.component('cartAssignV2', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CartAssignV2/component/cartAssignV2.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
            isLoadingPicking: '=?',
        },
        controller: function ($scope, $filter, $http, $state, pageLoading, $window, localStorageService, $translate, $q, dpMessageBox, cartAssignFactory, equipmentFactory, $interval) {
            var $vm = this;
            var viewModel = cartAssignFactory;
            $scope.isFilter = true;
            $scope.filterModel = {};
            var defer = {};
            $scope.isLoadingPicking = true;
            $vm.CartList = function () {
                let models = $scope.filterModel;
                //CheckCartNumberList(models.equipmentItemName);
                if (models.equipmentItemName != "" && models.equipmentItemName != undefined) {
                    viewModel.CheckCartNumberList(models.equipmentItemName).then(function success(res) {
                        if (res.data.length > 0) {
                            $vm.searchResultModel = res.data;
                            if (models.equipmentItemName != "" && models.equipmentItemName != undefined) {
                                if ($scope.isLoading) {
                                    $vm.isFilter = false;
                                    var data = res.data[0];
                                    $scope.isLoading(data).then(function () {
                                        $vm.isFilter = true;
                                        $scope.isLoadingPicking = true;
                                    }).catch(function (error) {
                                        defer.reject({ 'Message': error });
                                    });


                                }
                            }
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Information.',
                                message: "Data " + " " + $scope.filterModel.equipmentItemName + " Not Found "
                            })
                        }
                    })
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Cart Location ต้องไม่เป็นค่าว่าง !!"
                    })
                }            
            }

            $scope.ScanPickTicket = function () {



                var models = $scope.filterModel || {};

                $scope.fight(1);
                $scope.SendPickTicket(models).then(function success(res) {
                    $scope.stopFight(1);
                    if (res.data.length > 0) {
                        $scope.filterModel.tagOutNo = res.data[0].tagOutNo;
                        $scope.filterModel.tagOutPickNo = res.data[0].tagOutPickNo;

                        document.getElementById("tagOutPickNo1").focus();
                        document.getElementById("tagOutPickNo1").select();
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "This Ticket " + models.tagOutPickNo + " " + " ไม่พบข้อมูลหรือมีการ Assign แล้ว!!"
                        })

                        $scope.filterModel.tagOutPickNo = null;
                        document.getElementById("focusScan").focus();
                        document.getElementById("focusScan").select();
                        $scope.filterModel = {};
                    }
                },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });
            }
            $scope.SendPickTicket = function (model) {
                var deferred = $q.defer();
                viewModel.pickTicket(model).then(
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

            $scope.Cleardata = function () {
                $scope.filterModel.tagOutPickNo = "";
                $scope.filterModel.tagOutNo = "";
                $scope.filterModel.equipmentItemName = "";

            }

            $scope.ConfirmNextPage = function () {
                var models = $scope.filterModel || {};
                models.updateBy = $scope.userName;
                $scope.validateMsg = "";
                validate(models).then(function (result) {
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
                        // ------------------------------- Check Cart Location ว่ามีในระบบไหม ------------------------------//
                        if ($scope.filterModel.isScanCartLocation == 1) {
                            models.equipmentItemName = $scope.filterModel.getCartLocation;

                            $scope.fight(6);
                            $scope.SendCartNumber(models).then(function success(check) {
                                $scope.stopFight(6);
                                if (check.data.length > 0) {
                                    viewModel.CheckCartNumberList(models.equipmentItemName).then(function success(res) {
                                        if (res.data.length > 0) {
                                            // dpMessageBox.confirm({
                                            //     ok: 'Yes',
                                            //     cancel: 'No',
                                            //     title: 'Confirm ?',
                                            //     message: 'Do you Want to Confrim !'
                                            // }).then(function () {
                                            //     pageLoading.show();
                                            //     var recriepData = models.equipmentItemName;
                                            //     if (recriepData != null) {
                                            //         viewModel.setParam(recriepData);
                                            //         $state.go('tops.cart_assign_picking', {
                                            //         })

                                            //     };
                                            // });
                                            var recriepData = models.equipmentItemName;
                                            if (recriepData != null) {
                                                viewModel.setParam(recriepData);
                                                viewModel.setTime({
                                                    t1: $scope.t1, t2: $scope.t2, t3: $scope.t3, t4: $scope.t4, t5: $scope.t5, t6: $scope.t6
                                                });
                                                $state.go('tops.cart_assign_picking', {
                                                    t1: $scope.t1, t2: $scope.t2, t3: $scope.t3, t4: $scope.t4, t5: $scope.t5, t6: $scope.t6
                                                })

                                            };
                                        }
                                        else {
                                            dpMessageBox.alert({
                                                ok: 'Yes',
                                                title: 'Information.',
                                                message: "Data " + " " + models.equipmentItemName + " Not Found "
                                            })
                                        }
                                    })
                                    $scope.filterModel = {};
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: " ไม่มี Cart Location ในระบบ !!"
                                    })
                                }
                            })
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " กรุณากดสแกน Cart Location ที่ถูกต้องก่อน Confirm !"
                            })
                            $scope.filterModel.equipmentItemName = "";
                            $scope.filterModel.isScanCartLocation = 0;
                        }


                    }
                })
            }
            $scope.selectAll = function () {
                document.getElementById("tagOutPickNo1").focus();
                document.getElementById("tagOutPickNo1").select();

            }
            $scope.ScanCartNumber = function () {
                if ($scope.filterModel.equipmentItemName != undefined && $scope.filterModel.equipmentItemName != "") {

                    document.getElementById("tagOutPickNo1").disabled = true;

                    var models = $scope.filterModel || {};
                    models.isScanCartLocation = 1;

                    $scope.fight(2);
                    $scope.SendCartNumber(models).then(function success(res) {
                        $scope.stopFight(2);
                        if (res.data.length > 0) {
                            $scope.filterModel.tagOutNo = $scope.filterModel.tagOutNo;
                            $scope.filterModel.tagOutPickIndex = $scope.filterModel.tagOutPickIndex;
                            $scope.filterModel.tagOutPickNo = $scope.filterModel.tagOutPickNo;
                            $scope.filterModel.equipmentItemDesc = res.data[0].equipmentItemDesc;
                            $scope.filterModel.equipmentName = res.data[0].equipmentName;
                            $scope.filterModel.equipmentId = res.data[0].equipmentId
                            $scope.filterModel.equipmentIndex = res.data[0].equipmentIndex;
                            $scope.filterModel.equipmentNo = res.data[0].equipmentNo;
                            $scope.filterModel.equipmentItemIndex = res.data[0].equipmentItemIndex;
                            $scope.filterModel.equipmentItemId = res.data[0].equipmentItemId;
                            $scope.filterModel.userName = $scope.userName;
                            $scope.filterModel.isScanCartLocation = 1;
                            // ------------------------------------ เช็คข้อมูลว่าเกิดการ Picking ในใบ Ticket หรือยัง ------------------------------------- //
                            $scope.fight(3);
                            viewModel.checkAssignPicking(models).then(function success(res) {

                                $scope.stopFight(3);
                                if (res.data == true) {
                                    document.getElementById("tagOutPickNo1").disabled = false;
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: " Cart Location:" + " " + $scope.filterModel.equipmentItemName + " ได้ถูกมอบหมาย PickTicket ไปแล้ว กรุณาเลือก Cart Location อื่น !"
                                    })
                                }
                                else {
                                    $scope.fight(4);
                                    viewModel.checkPickingCartAssigned(models).then(function success(res) {
                                        document.getElementById("tagOutPickNo1").disabled = false;
                                        $scope.stopFight(4);
                                        if (res.data.itemsCheckStatusNotZero.length > 0) {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: 'Information.',
                                                message: " Cart Location:" + " " + $scope.filterModel.equipmentItemName + " กำลังถูกใช้งานอยู่ กรุณาเลือก Cart Location อื่น !"
                                            })

                                            $scope.filterModel.equipmentItemName = "";
                                            $scope.filterModel.isScanCartLocation = 0;
                                        }
                                        else {
                                            if (res.data.itemsUseStatusZero.length > 0) {
                                                Confirm($scope.filterModel);
                                                // document.getElementById("focusScanLocation").focus();
                                                // document.getElementById("focusScanLocation").select();
                                                //document.getElementById("focusScan").focus();
                                                setTimeout(() => {
                                                    var focusElem = jQuery('input[ng-model="filterModel.tagOutPickNo"]');
                                                    if (focusElem[0].focus != undefined) {
                                                        focusElem[0].focus();
                                                    }
                                                }, 200);
                                            }
                                            else {
                                                // dpMessageBox.alert({
                                                //     ok: 'Close',
                                                //     title: 'Information.',
                                                //     message: " Cart Location:" + " " + $scope.filterModel.equipmentItemName + " กำลังถูกใช้งานอยู่ กรุณาเลือก Cart Location อื่น !"
                                                // })
                                                dpMessageBox.alert({
                                                    ok: 'Close',
                                                    title: 'Information.',
                                                    message: " กรุณาสแกน PickTicket ก่อนสแกน Cart Location !"
                                                })
                                                $scope.filterModel.equipmentItemName = "";
                                                $scope.filterModel.isScanCartLocation = 0;
                                            }
                                        }
                                        // else if (res.data.itemsUseStatusZero.length > 0) {
                                        //     Confirm($scope.filterModel);
                                        //     setTimeout(() => {
                                        //         var focusElem = jQuery('input[ng-model="filterModel.tagOutPickNo"]');
                                        //         if (focusElem[0].focus != undefined) {
                                        //             focusElem[0].focus();
                                        //         }
                                        //     }, 200);
                                        // }
                                        // else {
                                        //     dpMessageBox.alert({
                                        //         ok: 'Close',
                                        //         title: 'Information.',
                                        //         message: " Cart Location:" + " " + $scope.filterModel.equipmentItemName + " ยังไม่ถูก Drop Stagging กรุณาใช้ CartLocation อื่น !"
                                        //     })

                                        //     $scope.filterModel.equipmentItemName = "";
                                        //     $scope.filterModel.isScanCartLocation = 0;
                                        // }
                                    })
                                }
                            })

                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " ไม่มี Cart Location ในระบบ !!"
                            })
                            $scope.filterModel.isScanCartLocation = 0;
                            document.getElementById("tagOutPickNo1").disabled = false;
                        }
                    },
                        function error(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " กรุณาสแกน Cart Location ให้ถูกต้อง !!"
                            })
                            $scope.filterModel.isScanCartLocation = 0;
                            document.getElementById("tagOutPickNo1").disabled = false;
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "Cart Number is Required"
                    })
                    $scope.filterModel.isScanCartLocation = 0;
                }

            }
            $scope.SendCartNumber = function (model) {
                var deferred = $q.defer();
                let _viewModel = equipmentFactory;
                _viewModel.cartNumber(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                        document.getElementById("tagOutPickNo1").disabled = false;
                    });

                return deferred.promise;
            }

            // function CheckCartNumberList(param) {
            //     viewModel.CheckCartNumberList(param).then(
            //         function success(res) {
            //             if (res.data.length > 0) {
            //                 $vm.searchResultModel = res.data;
            //             }
            //             else {
            //                 dpMessageBox.alert({
            //                     ok: 'Yes',
            //                     title: 'Information.',
            //                     message: "Data " + " " + $scope.filterModel.equipmentItemName + " Not Found "
            //                 })
            //             }
            //         },
            //         function error(res) {
            //             dpMessageBox.alert({
            //                 ok: 'Close',
            //                 title: 'Information.',
            //                 message: "Error"
            //             })
            //         });
            // }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.tagOutPickNo == null) {
                    msg = ' TagOut PickNo is required !'
                    defer.resolve(msg);
                }
                else if (param.tagOutNo == null) {
                    msg = ' TagOut No. is required !'
                    defer.resolve(msg);
                }
                else if (param.equipmentItemName == null) {
                    msg = ' Cart Number is required !'
                    defer.resolve(msg);
                }

                defer.resolve(msg);

                return defer.promise;
            }

            function Confirm(param) {
                let deferred = $q.defer();
                let _viewModel = equipmentFactory;
                $scope.fight(5);
                _viewModel.updateCartAssign(param).then(
                    function success(results) {
                        $scope.stopFight(5);
                        if (results.data.length > 0) {
                            $scope.getTagOut = {};
                            $scope.getTagOut.tagOutPickNo = $scope.filterModel.tagOutPickNo;
                            $scope.getTagOut.tagOutNo = $scope.filterModel.tagOutNo;
                            $scope.filterModel.equipmentItemName = results.data[0].equipmentItemName;
                            $scope.filterModel.equipmentName = results.data[0].equipmentName;
                            $scope.filterModel.tagOutPickNo = "";
                            $scope.filterModel.tagOutNo = "";

                            $scope.filterModel.getCartLocation = $scope.filterModel.equipmentItemName;
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Scan CartLocation not Complete Try again !"
                            })
                            $scope.filterModel.equipmentItemName = "";
                            // document.getElementById("focusScanLocation").focus();
                        }


                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }


            $scope.t1 = 0;
            $scope.t2 = 0;
            $scope.t3 = 0;
            $scope.t4 = 0;
            $scope.t5 = 0;
            $scope.t6 = 0;

            var stop1;
            var stop2;
            var stop3;
            var stop4;
            var stop5;
            var stop6;
            $scope.fight = function (param) {
                // Don't start a new fight if we are already fighting
                // if (angular.isDefined(stop)) return;

                if (param == 1)
                    stop1 = $interval(function () {
                        $scope.t1 = $scope.t1 + 0.1;
                    }, 100);

                if (param == 2)
                    stop2 = $interval(function () {
                        $scope.t2 = $scope.t2 + 0.1;
                    }, 100);

                if (param == 3)
                    stop3 = $interval(function () {
                        $scope.t3 = $scope.t3 + 0.1;
                    }, 100);

                if (param == 4)
                    stop4 = $interval(function () {
                        $scope.t4 = $scope.t4 + 0.1;
                    }, 100);

                if (param == 5)
                    stop5 = $interval(function () {
                        $scope.t5 = $scope.t5 + 0.1;
                    }, 100);

                if (param == 6)
                    stop6 = $interval(function () {
                        $scope.t6 = $scope.t6 + 0.1;
                    }, 100);


            };

            $scope.stopFight = function (param) {

                if (param == 1) {
                    if (angular.isDefined(stop1)) {
                        $interval.cancel(stop1);
                        stop1 = undefined;
                    }
                }

                if (param == 2) {
                    if (angular.isDefined(stop2)) {
                        $interval.cancel(stop2);
                        stop2 = undefined;
                    }
                }

                if (param == 3) {
                    if (angular.isDefined(stop3)) {
                        $interval.cancel(stop3);
                        stop3 = undefined;
                    }
                }

                if (param == 4) {
                    if (angular.isDefined(stop4)) {
                        $interval.cancel(stop4);
                        stop4 = undefined;
                    }
                }

                if (param == 5) {
                    if (angular.isDefined(stop5)) {
                        $interval.cancel(stop5);
                        stop5 = undefined;
                    }
                }

                if (param == 6) {
                    if (angular.isDefined(stop6)) {
                        $interval.cancel(stop6);
                        stop6 = undefined;
                    }
                }

            };

            $scope.resetFight = function () {
                $scope.blood_1 = 100;
                $scope.blood_2 = 120;
            };

            // $("#divCartAssign").click(function () {
            //     if (!$("focusScanLocation").is("focus")) {
            //         $("#tagOutPickNo").focus();
            //     }
            // });

            $("#tagOutPickNo").bind("focus", function () {
                setTimeout(() => {
                    $("#tagOutPickNo").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#tagOutPickNo").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    $("#focusScanLocation").focus();
                }
            });

            $("#tagOutPickNo1").bind("focus", function () {
                setTimeout(() => {
                    $("#tagOutPickNo1").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#tagOutPickNo1").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    $("#focusScanLocation").focus();
                }
            });

            $("#visibleField").bind("focus", function (e) {
                // silently shift the focus to the hidden select box
                $("#hiddenField").focus();
                $("#cursorMeasuringDiv").css("font", $("#visibleField").css("font"));
            });

            // whenever the user types on his keyboard in the select box
            // which is natively supported for jumping to an <option>
            $("#hiddenField").bind("keypress", function (e) {


                // get the current value of the readonly field
                var currentValue = $("#visibleField").val();

                // and append the key the user pressed into that field
                if (e.key != "Enter") {
                    $("#visibleField").val(currentValue + e.key);
                    $("#cursorMeasuringDiv").text(currentValue + e.key);
                }
                else {
                    $("#visibleField").val(currentValue);
                    $("#cursorMeasuringDiv").text(currentValue);
                }


                // POpOz set scope
                var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
                scope.filterModel.tagOutPickNo = currentValue;
                scope.filterModel.eevent = e.key;
                scope.$apply();

                // measure the width of the cursor offset
                var offset = 3;
                var textWidth = $("#cursorMeasuringDiv").width();
                $("#hiddenField").css("marginLeft", Math.min(offset + textWidth, $("#visibleField").width()));

            });

            //-----------------------------------------------------------------------------------------------

            // $("#hiddenField").bind('keydown', (e) => {
            //     if (!e.repeat)
            //     {
            //         var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
            //         scope.filterModel.eevent1 = `Key "${e}" pressed  [event: keydown]`;
            //         scope.$apply();
            //     }
            //     else
            //     {
            //         var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
            //         scope.filterModel.eevent2 = `Key "${e}" pressed  [event: keydown]`;
            //         scope.$apply();
            //     }
            // });

            // $("#visibleField").bind('beforeinput', (e) => {
            //         var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
            //         scope.filterModel.eevent3 = `Key "${e}" pressed  [event: beforeinput]`;
            //         scope.$apply();
            // });

            // $("#visibleField").bind('input', (e) => {
            //         var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
            //         scope.filterModel.eevent4 = `Key "${e}" pressed  [event: input]`;
            //         scope.$apply();
            // });

            // $("#hiddenField").bind('keyup', (e) => {
            //         var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
            //         scope.filterModel.eevent5 = `Key "${e}" pressed  [event: keyup]`;
            //         scope.$apply();
            // });

            //-----------------------------------------------------------------------------------------------

            // $("#hiddenField").bind("keydown", function (e) {

            //     debugger
            //     var str = '';
            //     var el = document.getElementById('#visibleField');
            //     const currentCode = e.which || e.code;
            //     let currentKey = e.key;
            //     if (!currentKey) {
            //         currentKey = String.fromCharCode(currentCode);
            //     }
            //     str += currentKey;
            //     event.preventDefault();
            //     // el.innerHTML = str;

            //     // get the current value of the readonly field
            //     // var currentValue = $("#visibleField").val();

            //     // and append the key the user pressed into that field
            //     // if (e.key != "Enter") {
            //     //     $("#visibleField").val(currentValue + e.key);
            //     //     $("#cursorMeasuringDiv").text(currentValue + e.key);
            //     // }
            //     // else {
            //     //     $("#visibleField").val(currentValue);
            //     //     $("#cursorMeasuringDiv").text(currentValue);
            //     // }


            //     // POpOz set scope
            //     var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
            //     // scope.filterModel.tagOutPickNo = currentValue;
            //     scope.filterModel.eevent = str;
            //     scope.$apply();

            //     // measure the width of the cursor offset
            //     var offset = 3;
            //     var textWidth = $("#cursorMeasuringDiv").width();
            //     $("#hiddenField").css("marginLeft", Math.min(offset + textWidth, $("#visibleField").width()));
            //     $("#hiddenField").blur();
            // });



            //------------------------------------------------------------------------------------------------------

            // $(function(){
            //     $(document).pos();
            //     $(document).on('scan.pos.barcode', function(event){

            //         debugger
            //         var barcode = event.code;
            //         var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
            //         scope.filterModel.eevent5 = `Key "${barcode}" pressed  [event: barcode]`;
            //         scope.$apply();
            //         //handle your code here....
            //     });
            // });

            //----------------------------------------------------------------------------------------------------

            $scope.ScanCartNumberV2 = function () {
                if ($scope.filterModel.equipmentItemName != undefined && $scope.filterModel.equipmentItemName != "") {

                    document.getElementById("tagOutPickNo1").disabled = true;

                    var models = $scope.filterModel || {};
                    models.isScanCartLocation = 1;

                    $scope.fight(2);
                    $scope.SendCartNumber(models).then(function success(res) {
                        $scope.stopFight(2);
                        if (res.data.length > 0) {
                            $scope.filterModel.tagOutNo = $scope.filterModel.tagOutNo;
                            $scope.filterModel.tagOutPickIndex = $scope.filterModel.tagOutPickIndex;
                            $scope.filterModel.tagOutPickNo = $scope.filterModel.tagOutPickNo;
                            $scope.filterModel.equipmentItemDesc = res.data[0].equipmentItemDesc;
                            $scope.filterModel.equipmentName = res.data[0].equipmentName;
                            $scope.filterModel.equipmentId = res.data[0].equipmentId
                            $scope.filterModel.equipmentIndex = res.data[0].equipmentIndex;
                            $scope.filterModel.equipmentNo = res.data[0].equipmentNo;
                            $scope.filterModel.equipmentItemIndex = res.data[0].equipmentItemIndex;
                            $scope.filterModel.equipmentItemId = res.data[0].equipmentItemId;
                            $scope.filterModel.equipmentItemDesc = res.data[0].equipmentItemDesc;
                            $scope.filterModel.userName = $scope.userName;
                            $scope.filterModel.isScanCartLocation = 1;
                            // ------------------------------------ เช็คข้อมูลว่าเกิดการ Picking ในใบ Ticket หรือยัง ------------------------------------- //
                            $scope.fight(3);
                            viewModel.checkPickingCartAssignedV2(models).then(function success(res) {
                                document.getElementById("tagOutPickNo1").disabled = false;
                                $scope.stopFight(4);
                                if (res.data == "complete") {
                                    $scope.filterModel.tagOutPickNo = "";
                                    $scope.filterModel.tagOutNo = "";
                                    $scope.filterModel.getCartLocation = $scope.filterModel.equipmentItemName;
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: res.data
                                    })

                                    $scope.filterModel.equipmentItemName = "";
                                    $scope.filterModel.isScanCartLocation = 0;
                                }
                            },
                            function error(res) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " กรุณาสแกน Cart Location ให้ถูกต้อง !!"
                                })
                                $scope.filterModel.isScanCartLocation = 0;
                                document.getElementById("tagOutPickNo1").disabled = false;
                            })
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " ไม่มี Cart Location ในระบบ !!"
                            })
                            $scope.filterModel.isScanCartLocation = 0;
                            document.getElementById("tagOutPickNo1").disabled = false;
                        }
                    },
                        function error(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " กรุณาสแกน Cart Location ให้ถูกต้อง !!"
                            })
                            $scope.filterModel.isScanCartLocation = 0;
                            document.getElementById("tagOutPickNo1").disabled = false;
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "Cart Number is Required"
                    })
                    $scope.filterModel.isScanCartLocation = 0;
                    document.getElementById("tagOutPickNo1").disabled = false;
                }
            }



            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');



                setTimeout(() => {
                    $("#tagOutPickNo").focus();
                }, 300);

                // $scope.fight(1);
                // var field = document.createElement('input');
                // field.setAttribute('type', 'text');
                // document.body.appendChild(field);

                // setTimeout(function() {
                //     field.focus();
                //     setTimeout(function() {
                //         field.setAttribute('style', 'display:none;');
                //     }, 50);
                // }, 50);

            };
            init();
        }
    })
})();