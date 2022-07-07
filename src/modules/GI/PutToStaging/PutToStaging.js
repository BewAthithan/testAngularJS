'use strict'
app.component('putToStaging', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/PutToStaging/PutToStaging.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        pickingToolsList: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, taskListFactory, cartNumberFactory, locationFactory, cartAssignFactory, $interval) {
        var $vm = this;
        $scope.items = $scope.items || [];
        var viewModel = taskListFactory;
        var _viewModel = locationFactory;
        var viewModelCartNumber = cartNumberFactory;
        // setting column
        $scope.pickingToolsList = false;
        $scope.filterModel = {};
        $scope.dataListFromService = {};
        var defer = {};

        $scope.CheckLocation = function () {
            let defer = $q.defer();
            let models = $scope.filterModel;
            if ($scope.filterModel.locationName == $scope.filterModel.stagingLocation) {
                $scope.CheckScanLocation(models);
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.tagOutNo"]');
                    focusElem[0].focus();
                }, 200);
                // _viewModel.CheckLocation(models).then(function success(res) {
                //     if (res.data.length > 0) {
                //         $scope.dataListFromService.locationIndex = res.data[0].locationIndex;
                //         $scope.dataListFromService.locationId = res.data[0].locationId;
                //         $scope.dataListFromService.locationName = res.data[0].locationName;
                //         setTimeout(() => {
                //             var focusElem = jQuery('input[ng-model="filterModel.tagOutNo"]');
                //             focusElem[0].focus();
                //         }, 200);
                //     }
                //     else {
                //         dpMessageBox.alert({
                //             ok: 'Close',
                //             title: 'Information.',
                //             message: " ไม่พบ Location Staging ที่ยืนยัน !"
                //         })
                //         $scope.filterModel.locationName = "";
                //         $scope.filterModel.isLoc = 1;
                //     }
                // },
                //     function error(response) {
                //     }
                // );
            }
            else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: " Location ที่ยืนยันต้องเป็น Location เดียวกันเท่านั้น ! "
                })
                $scope.filterModel.locationName = "";
                $scope.filterModel.isLoc = 0;
            }

            defer.resolve();
        }

        $scope.CheckScanCarton = function (param) {
            if ($scope.filterModel.locationName != undefined) {
                if (param.tagOutNo != "" && param.tagOutNo != undefined && param.isTagOutNo != 1 && param.isSave != 1) {
                    viewModel.checkCarton(param).then(function success(res) {
                        if (res.data.itemsForCheck.length > 0) {
                            let CheckData = $scope.APIreceieve;
                            let count = 0;
                            for (var i = 0; i <= CheckData.length - 1; i++) {
                                if (CheckData[i].tagOutNo == $scope.filterModel.tagOutNo && CheckData[i].equipmentItemName == $scope.filterModel.equipmentItemName) {
                                    //if (CheckData[i].tagOutNo == param.tagOutNo) {
                                    count = count + 1;

                                }
                            }
                            if (count == 0) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " Carton No: " + param.tagOutNo + " ไม่ได้อยู่ใน Cart :" + "  " + param.equipmentItemDesc
                                })
                                $scope.filterModel.tagOutNo = "";
                                $scope.filterModel.isTagOutNo = 1;
                            }
                            $scope.dataListFromService.tagOutNo = res.data.itemsForCheck[0].tagOutNo;
                            $scope.dataListFromService.goodsIssueIndex = res.data.itemsForCheck[0].goodsIssueIndex;
                            $scope.dataListFromService.tagOutStatus = res.data.itemsForCheck[0].tagOutStatus;
                            $scope.dataListFromService.goodsIssueItemLocationIndex = res.data.itemsForCheck[0].goodsIssueItemLocationIndex;
                            // if (res.data.itemsUse.length > 0) {

                            // }

                        }
                        else {
                            if (res.data.itemsUse.length > 0) {
                                if (res.data.itemsUse[0].tagOutStatus == 1) {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: " Carton No: " + param.tagOutNo + " เคยถูก Confirm แล้ว "
                                    })
                                    // $scope.filterModel.locationName = "";
                                    $scope.filterModel.tagOutNo = "";
                                    $scope.filterModel.isTagOutNo = 1;
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: " Carton No: " + param.tagOutNo + " นี้ไม่ตรงกับเลข PickTickket ที่สแกน กรุณาใช้ให้ถูกต้อง ! "
                                    })
                                }
                                $scope.filterModel.isTagOutNo = 1;
                                $scope.filterModel.tagOutNo = "";
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " Carton No: " + param.tagOutNo + " Not Found "
                                })
                            }
                            $scope.filterModel.isTagOutNo = 1;
                            $scope.filterModel.tagOutNo = "";
                        }
                    })
                }

            }
            else {
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Information.',
                    message: " คุณยังไม่ได้ Confirm Location "
                })
                param.isTagOutNo = 0;
                $scope.filterModel.tagOutNo = "";
            }

            param.isTagOutNo = 0;
        }
        $scope.CheckScanLocation = function (param) {
            if (param.locationName != undefined) {
                if (param.locationName != "" && param.tagOutNo == "" || param.tagOutNo == undefined && param.isLoc != 1) {
                    if ($scope.filterModel.locationName == $scope.filterModel.stagingLocation) {
                        _viewModel.CheckLocation(param).then(function success(res) {
                            if (res.data.length > 0) {
                                $scope.dataListFromService.locationIndex = res.data[0].locationIndex;
                                $scope.dataListFromService.locationId = res.data[0].locationId;
                                $scope.dataListFromService.locationName = res.data[0].locationName;
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "ไม่พบ Location Staging ที่ยืนยัน !"
                                })
                                $scope.filterModel.locationName = "";

                            }
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " Location ที่ยืนยันต้องเป็น Location เดียวกันเท่านั้น ! "
                        })
                        $scope.filterModel.locationName = "";
                        $scope.filterModel.isLoc = 0;
                    }
                }
                else {
                    //$scope.filterModel.stagingLocation = "";
                    $scope.filterModel.isLoc = 0;
                }

                param.isLoc = 0;
            }
        }
        $scope.ConfirmCarton = function () {
            let defer = $q.defer();
            let models = $scope.filterModel;
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

                    let CheckData = $scope.APIreceieve;
                    for (var i = 0; i <= CheckData.length - 1; i++) {
                        if (models.tagOutNo == CheckData[i].tagOutNo) {
                            models.taskNo = CheckData[i].taskNo;
                            models.tagOutPickNo = CheckData[i].tagOutPickNo;
                        }
                    }

                    pageLoading.show();
                    viewModel.checkCarton(models).then(function success(res) {
                        pageLoading.hide();

                        if (res.data.itemsForCheck.length > 0) {

                            // ------------------------------------ Check TagOutNo  ------------------------------------- //
                            let CheckData = $scope.APIreceieve;
                            $scope.filterModel.isCheckValidate = 0;
                            for (var i = 0; i <= CheckData.length - 1; i++) {
                                if (CheckData[i].tagOutNo == $scope.filterModel.tagOutNo && CheckData[i].equipmentItemName == $scope.filterModel.equipmentItemName) {
                                    $scope.filterModel.isCheckValidate = 1;
                                }
                            }

                            if ($scope.filterModel.isCheckValidate == 1) {
                                // ------------------------------------ Check UserAssign ------------------------------------- //
                                viewModelCartNumber.checkUserAssign(models).then(function (receieve) {
                                    if (receieve.data == true) {
                                        if (res.data.itemsForCheck.length > 0) {
                                            $scope.dataListFromService.tagOutNo = res.data.itemsForCheck[0].tagOutNo;
                                            $scope.dataListFromService.goodsIssueIndex = res.data.itemsForCheck[0].goodsIssueIndex;
                                            $scope.dataListFromService.tagOutStatus = res.data.itemsForCheck[0].tagOutStatus;
                                            $scope.dataListFromService.goodsIssueItemLocationIndex = res.data.itemsForCheck[0].goodsIssueItemLocationIndex;
                                            // dpMessageBox.alert({
                                            //     ok: 'Yes',
                                            //     title: 'Information',
                                            //     message: "Stagging Complete. "
                                            // })
                                            checkCartonForUpdate();
                                        }
                                        else {
                                            dpMessageBox.alert({
                                                ok: 'Yes',
                                                title: 'Information.',
                                                message: " Carton No: " + models.tagOutNo + " เคยถูก Confirm แล้ว "
                                            })
                                            $scope.filterModel.isTagOutNo = 1;
                                        }
                                    }
                                    else {
                                        dpMessageBox.alert({
                                            ok: 'Yes',
                                            title: 'Information.',
                                            message: " User ที่ใช้ไม่ตรงกัน กรุณา กด Confirm อีกครั้ง !! "
                                        }).then(function success(res) {
                                            $scope.filterModel.isTagOutNo = 1;
                                            $scope.back();
                                        })

                                    }
                                });
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " Carton No: " + models.tagOutNo + " ไม่ได้อยู่ใน Cart : " + "  " + models.equipmentItemDesc
                                })
                                $scope.filterModel.tagOutNo = "";
                                $scope.filterModel.isTagOutNo = 1;
                            }
                        }
                        else {
                            if (res.data.itemsUse.length > 0) {
                                if (res.data.itemsUse[0].tagOutStatus == 1) {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: " Carton No: " + models.tagOutNo + " เคยถูก Confirm แล้ว "
                                    })
                                    // $scope.filterModel.locationName = "";
                                    $scope.filterModel.tagOutNo = "";
                                    $scope.filterModel.isTagOutNo = 1;
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Yes',
                                        title: 'Information.',
                                        message: " Carton No: " + models.tagOutNo + " นี้ไม่ตรงกับเลข PickTickket ที่สแกน กรุณาใช้ให้ถูกต้อง ! "
                                    })
                                    $scope.filterModel.isTagOutNo = 1;
                                    $scope.filterModel.tagOutNo = "";
                                }
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " Carton No: " + models.tagOutNo + " Not Found "
                                })

                                $scope.filterModel.isTagOutNo = 1;
                                $scope.filterModel.tagOutNo = "";
                            }

                        }

                    })
                    defer.resolve();
                }
            });
        }

        $scope.back = function () {
            var viewModelCartAssign = cartAssignFactory;
            viewModelCartAssign.setParam("");
            $state.go('tops.cart_assign_picking', {
            })
        }

        function validate(param) {
            let defer = $q.defer();
            let msg = "";
            if (param.equipmentItemName == undefined || param.equipmentItemName == "") {
                msg = ' Cart Location ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            else if (param.stagingLocation == undefined || param.stagingLocation == "") {
                msg = ' Location ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            else if (param.stagingLocation == undefined || param.stagingLocation == "") {
                msg = ' Location ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            else if (param.locationName == undefined || param.locationName == "") {
                msg = ' Confirm Location ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            else if (param.tagOutNo == undefined || param.tagOutNo == "") {
                msg = ' Carton No ต้องไม่เป็นค่าว่าง !'
                defer.resolve(msg);
            }
            defer.resolve(msg);

            return defer.promise;
        }

        $scope.ConfirmToPrint = function () {
            let models = $scope.filterModel;
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
                    if ($scope.filterModel.isCheckValidate == 1) {
                        // dpMessageBox.confirm({
                        //     ok: 'Yes',
                        //     cancel: 'No',
                        //     title: 'Confirm',
                        //     message: 'Do you Want to Confirm ?'
                        // }).then(function success() {

                        // });
                        pageLoading.show();
                        //$scope.filterModel.ReceiveDataWEB = "Confirm"
                        $scope.fight(1);
                        viewModel.receivePutToStaging($scope.filterModel).then(function success(res) {
                            $scope.stopFight(1);
                            pageLoading.hide();
                            //-------------------------- check data มีการ assign ครบแล้ว --------------------------//
                            if (res.data.itemsForCheck.length > 0) {
                                // dpMessageBox.alert({
                                //     ok: 'Yes',
                                //     title: 'Information',
                                //     message: 'Confirm Completed !!'
                                // }).then(function success() {
                                //     viewModel.setParam($scope.filterModel);
                                //     $state.go('tops.print_carton', {
                                //     })
                                // })

                                let modelList = $scope.receieveSaveData;
                                //-------------------------- Binding Uername --------------------------//

                                // for (var i = 0; i <= modelList.length - 1; i++) {
                                //     modelList[i].createBy = $scope.userName;
                                // }

                                // let models1 = {
                                //     newArray: modelList
                                // }
                                // ------------------------------------------------------------------- //
                                // let data = {
                                //     listSaveCallCenterViewModel: modelList
                                // }

                                let dataList = modelList.listSaveCallCenterViewModel;
                                for (var i = 0; i <= dataList.length - 1; i++) {
                                    modelList.listSaveCallCenterViewModel[i].createBy = $scope.userName;
                                }

                                if (modelList.listSaveCallCenterViewModel.length > 0) {
                                    $scope.fight(2);
                                    viewModel.SaveToCallCenter(modelList).then(function success(res) {
                                        $scope.stopFight(2);
                                        pageLoading.hide();
                                        if (res.data != "") {
                                            // dpMessageBox.alert({
                                            //     ok: 'Yes',
                                            //     title: 'Information',
                                            //     message: 'Confirm Completed !!'
                                            // }).then(function success() {
                                            //     viewModel.setParam($scope.filterModel);
                                            //     $state.go('tops.print_carton', {
                                            //     })
                                            // })


                                            if (res.data == "POS") {

                                                var md = {};
                                                md.PlanGoodsIssue_Index = modelList.listSaveCallCenterViewModel[0].planGoodsIssueIndex;
                                                viewModel.postPickConfirm(md).then(function (res) {

                                                }, function error(res) {

                                                })
                                            }

                                            viewModel.setParam($scope.filterModel);
                                            $state.go('tops.print_carton', {
                                            })



                                        }
                                        else {

                                            let item = $scope.filterModel;
                                            viewModel.setParam(item);
                                            $state.go('tops.print_carton', {
                                            })
                                        }
                                    })
                                }
                            }
                            else {
                                if (res.data.itemsUse.length > 0) {
                                    //let modelList = res.data.itemsUse;
                                    let modelList = $scope.receieveSaveData;
                                    //-------------------------- Binding Uername --------------------------//                                                          
                                    // for (var i = 0; i <= modelList.length - 1; i++) {
                                    //     modelList[i].createBy = $scope.userName;
                                    // }
                                    // let models1 = {
                                    //     newArray: modelList
                                    // }
                                    // ------------------------------------------------------------------- //
                                    // let data = {
                                    //     listSaveCallCenterViewModel: modelList
                                    // }

                                    let dataList = modelList.listSaveCallCenterViewModel;
                                    for (var i = 0; i <= dataList.length - 1; i++) {
                                        modelList.listSaveCallCenterViewModel[i].createBy = $scope.userName;
                                    }

                                    if (modelList.listSaveCallCenterViewModel.length > 0) {
                                        $scope.fight(2);
                                        viewModel.SaveToCallCenter(modelList).then(function success(res) {
                                            $scope.stopFight(2);
                                            pageLoading.hide();
                                            if (res.data == true) {
                                                viewModel.setParam($scope.filterModel);
                                                $state.go('tops.print_carton', {
                                                })
                                                // dpMessageBox.alert({
                                                //     ok: 'Yes',
                                                //     title: 'Information',
                                                //     message: 'Confirm Completed !!'
                                                // }).then(function success() {
                                                //     viewModel.setParam($scope.filterModel);
                                                //     $state.go('tops.print_carton', {
                                                //     })
                                                // })
                                            }
                                            else {

                                                let item = $scope.filterModel;
                                                viewModel.setParam(item);
                                                viewModel.setTime({
                                                    t1: $scope.t1, t2: $scope.t2, t3: $scope.t3, t4: $scope.t4, t5: $scope.t5, t6: $scope.t6
                                                });
                                                $state.go('tops.print_carton', {
                                                })
                                            }
                                        })
                                    }
                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: " คุณยังไม่ได้สแกนเลข Carton No กดสแกนใหม่อีกครั้ง !!"
                                    })
                                }

                            }
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: " Carton No: " + $scope.filterModel.tagOutNo + " ยังไม่ได้สแกน กรุณาสแกนก่อนกด Confirm "
                        })
                    }

                }
            })
        }

        function checkCartonForUpdate() {
            let models = $scope.dataListFromService;
            models.UpdateBy = $scope.userName;
            let CheckData = $scope.APIreceieve;
            var Activity = [];
            let param = "";
            //-------------------------- Binding PlanGoodsIssueIndex --------------------------//
            for (var i = 0; i <= CheckData.length - 1; i++) {
                let newItem = {};
                if (models.tagOutNo == CheckData[i].tagOutNo) {
                    models.planGoodsIssueIndex = CheckData[i].planGoodsIssueIndex;
                    $scope.filterModel.tagOutPickNo = "";
                    $scope.filterModel.tagOutPickNo = CheckData[i].tagOutPickNo;


                    newItem.planGoodsIssueIndex = CheckData[i].planGoodsIssueIndex;
                    newItem.goodsIssueIndex = models.goodsIssueIndex;
                    newItem.goodsIssueItemLocationIndex = models.goodsIssueItemLocationIndex;
                    newItem.locationId = models.locationId;
                    newItem.locationIndex = models.locationIndex;
                    newItem.locationName = models.locationName;
                    newItem.tagOutNo = models.tagOutNo;
                    newItem.tagOutPickNo = models.tagOutPickNo;
                    newItem.tagOutStatus = models.tagOutStatus;
                    newItem.ownerIndex = models.ownerIndex;
                    newItem.ownerId = models.ownerId;
                    newItem.ownerName = models.ownerName;
                    newItem.UpdateBy = $scope.userName;
                }
                else {
                    newItem.emtry = 1;
                }
                if (newItem.emtry != 1) {
                    Activity.push(newItem);
                }
            }
            if (Activity) {
                param = Activity;
            }
            let data = {
                listSaveCallCenterViewModel: param
            }

            $scope.receieveSaveData = data;
            //--------------------------  --------------------------//
            if (models.locationName != null && models.tagOutNo != null) {

                pageLoading.show();
                viewModel.updateData(models).then(function success(res) {
                    pageLoading.hide();
                    if (res.data == true) {
                        $scope.filterModel.isSave = 1;
                        // dpMessageBox.alert({
                        //     ok: 'Close',
                        //     title: 'Information.',
                        //     message: " Stagging Completed !!"
                        // })
                        // document.getElementById("myText").focus();
                        // document.getElementById("myText").select();

                        document.getElementById("myText").disabled = true;
                        document.getElementById("myText1").disabled = true;
                        $scope.filterModel.isTagOutNo = 1;
                        $scope.ConfirmToPrint();
                        //init();
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " Update Error !!"
                        })
                    }

                },
                    function error(response) {
                    }
                );
            }
            else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: " กรุณากดยืนยัน Location อีกครั้ง !!"
                })
            }

        }

        $scope.clearSearch = function () {
            $scope.filterModel.locationName = "";
            $scope.filterModel.tagOutNo = "";
            document.getElementById("myText").disabled = false;
            document.getElementById("myText1").disabled = false;

        }

        $vm.pickingTools = function (param, index, owner) {
            $scope.filterModel.ownerIndex = owner;
            defer = $q.defer();
            $scope.pickingTools = true;

            return defer.promise;
        };
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

        var init = function () {
            $scope.Carton = $scope.filterModel.tagOutNo;
            $scope.userName = localStorageService.get('userTokenStorage');
            document.getElementById("myText1").focus();
            // $scope.filterModel.equipmentItemName = "CA003-001";
            // $scope.filterModel.stagingLocation = "STBE01";

            let item = viewModelCartNumber.getParam();
            if (item != undefined) {
                if (item.equipmentItem_Name != undefined && item.equipmentItem_Name != "") {
                    $scope.filterModel.equipmentItemName = item.equipmentItem_Name;
                }
                // else if(item.equipmentName != undefined && item.equipmentName != ""){
                //     $scope.filterModel.equipmentName = item.equipmentName;
                // }
                else {
                    $scope.filterModel.equipmentItemName = item;
                }

                pageLoading.show();
                viewModel.receivePutToStaging($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.itemsUse.length > 0) {
                        $scope.APIreceieve = res.data.itemsUse;
                        $scope.filterModel.stagingLocation = res.data.itemsUse[0].suggestLocationName;
                        $scope.filterModel.equipmentItemName = res.data.itemsUse[0].equipmentItemName;
                        $scope.filterModel.equipmentItemDesc = res.data.itemsUse[0].equipmentItemDesc;
                        $scope.filterModel.equipmentName = res.data.itemsUse[0].equipmentName;
                        $scope.filterModel.tagOutPickNo = res.data.itemsUse[0].tagOutPickNo;
                        $scope.dataListFromService.tagOutPickNo = res.data.itemsUse[0].tagOutPickNo;
                        $scope.dataListFromService.ownerIndex = res.data.itemsUse[0].ownerIndex;
                        $scope.dataListFromService.ownerId = res.data.itemsUse[0].ownerId;
                        $scope.dataListFromService.ownerName = res.data.itemsUse[0].ownerName;

                        $scope.filterModel.createBy = $scope.userName;
                        if ($scope.filterModel.isSave == 1) {
                            let countUpdate = 0;
                            let Item = $scope.APIreceieve;
                            for (var i = 0; i <= Item.length - 1; i++) {
                                countUpdate = countUpdate + 1;
                                if (Item[i].documentStatus == 1 && Item[i].tagOutStatus == 0 && Item[i].goodsIssueItemLocationStatus == 1) {
                                    $scope.dataListFromService.tagOutNo = Item[i].tagOutNo;
                                    $scope.dataListFromService.tagOutPickNo = Item[i].tagOutPickNo;
                                    $scope.dataListFromService.goodsIssueNo = Item[i].goodsIssueNo;
                                    $scope.dataListFromService.planGoodsIssueIndex = Item[i].planGoodsIssueIndex;
                                    $scope.dataListFromService.documentStatus = Item[i].documentStatus;
                                    $scope.dataListFromService.tagOutStatus = Item[i].tagOutStatus;
                                    $scope.dataListFromService.goodsIssueIndex = Item[i].goodsIssueIndex;

                                    if (countUpdate == 1) {
                                        dpMessageBox.confirm({
                                            ok: 'Yes',
                                            cancel: 'No',
                                            title: 'Information.',
                                            message: "Carton:" + " " + $scope.filterModel.tagOutNo + " " + "Completed!" + " ต้องการที่จะ Confirm Carton ถัดไปหรือไม่ ? "
                                        }).then(function success() {
                                            checkCartonForUpdate();
                                        })
                                    } else {
                                        dpMessageBox.confirm({
                                            ok: 'Yes',
                                            cancel: 'No',
                                            title: 'Information.',
                                            message: "Carton:" + " " + Item[i].tagOutNo + " " + "Completed!" + " ต้องการที่จะ Confirm Carton ถัดไปหรือไม่ ? "
                                        }).then(function success() {
                                            checkCartonForUpdate();
                                        })
                                    }

                                }
                            }
                        }
                        //$scope.filterModel.tagOutNo = "";
                    }
                    else {
                        if (res.data.itemsForCheck.length < 0) {
                            if ($scope.filterModel.locationName != undefined && $scope.filterModel.tagOutNo != undefined) {
                                // dpMessageBox.alert({
                                //     ok: 'Close',
                                //     title: 'Information.',
                                //     message: " Stagging Completed !!"
                                // })
                                // document.getElementById("myText").focus();
                                // document.getElementById("myText").select();
                                document.getElementById("myText").disabled = true;
                                document.getElementById("myText1").disabled = true;
                                $scope.filterModel.isTagOutNo = 1;
                            }
                            else {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: 'Information.',
                                    message: " Carton No " + $scope.filterModel.equipmentItemName + " Completed. "
                                }).then(function success() {
                                    viewModel.PrintCartonRF($scope.filterModel.equipmentItemName).then(function success(res) {
                                        if (res.data.length > 0) {
                                            let item = {};
                                            item.equipmentItemName = $scope.filterModel.equipmentItemName;
                                            item.stagingLocation = $scope.filterModel.stagingLocation;
                                            viewModel.setParam(item);
                                            $state.go('tops.print_carton', {
                                            })
                                        }
                                    })
                                });
                            }
                        }
                        else {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Information.',
                                message: " Carton No " + $scope.filterModel.equipmentItemName + " Completed. "
                            }).then(function success() {
                                viewModel.PrintCartonRF($scope.filterModel).then(function success(res) {
                                    if (res.data.length > 0) {
                                        let item = {};
                                        item.equipmentItemName = $scope.filterModel.equipmentItemName;
                                        item.stagingLocation = $scope.filterModel.stagingLocation;
                                        viewModel.setParam(item);
                                        $state.go('tops.print_carton', {
                                        })
                                    }
                                })
                            }, function No() {
                                $state.go('tops.cart_assign_picking', {
                                })
                            });
                        }
                    }

                },
                    function error(response) {
                    }
                );
            }

        };


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

        $("#myText").bind("focus", function () {
            setTimeout(() => {
                $("#myText").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#myText").attr("readonly", "readonly");
        });

        $("#myText1").bind("focus", function () {
            setTimeout(() => {
                $("#myText1").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#myText1").attr("readonly", "readonly");
        });

        init();

    }
});