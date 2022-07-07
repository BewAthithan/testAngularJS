(function() {
    'use strict';
    app.component('packingFilter', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, $window, commonService) {
            return "modules/GI/Packing/component/PackingFilter.html";
        },
        bindings: {
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchResultModel: '=?',
            saleOrderTable: '=?',
            saleOrderTableRender: '=?'
        },
        controller: function($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, commonService, packingFactory, localStorageService) {
            var $vm = this;
            
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var model = $scope.filterModel;

            var viewModel = packingFactory;
            $vm.packingItemTable = [];
            $vm.filterModel.boxQty = 1;
            
            document.getElementById("packStationInput").focus();

            $scope.inputPackStation = function() {
                if (!$scope.filterModel.packStation) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: "กรุณากรอก Pack Station ID"
                    })
                } else {
                    $vm.filterModel.packstation = $scope.filterModel.packStation;
                    viewModel.getPackStation($scope.filterModel.packStation).then(function success(res) {
                        if (res.data.statusCode >= 200 && res.data.statusCode < 300) {
                            if (!res.data.result[0].tagNo) {
                                document.getElementById("lpnNoInput").disabled = false;
                                $scope.filterModel.lpnNo = null;
                                document.getElementById("lpnNoInput").focus();
                            } 
                            else {
                                document.getElementById("lpnNoInput").disabled = true;
                                $scope.filterModel.lpnNo = res.data.result[0].tagNo;
                                document.getElementById("saleOrderNoInput").focus();
                            }
                            
                        } else if (res.data.statusCode >= 400 && res.data.statusCode < 500) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ข้อมูลไม่ถูกต้อง',
                                message: res.data.statusDesc
                            })
                        }
                    }, function error(err) {});
                }
            }

            $scope.inputSaleOrderNo = function() {
                if (!$vm.filterModel.saleOrderNo) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: "กรุณากรอก Sale Order Number"
                    })
                } else {
                    if(!$scope.filterModel.packStation){
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ข้อมูลไม่ครบ',
                            message: "กรุณากรอก Pack Station"
                        })
                        document.getElementById("packStationInput").focus();
                    }
                    else if (!$scope.filterModel.lpnNo) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ข้อมูลไม่ครบ',
                            message: "กรุณากรอก LPN Number"
                        })
                        document.getElementById("lpnNoInput").focus();
                    }
                    else {
                        $vm.filterModel.saleOrderNo = $vm.filterModel.saleOrderNo;
                        viewModel.getCancelOrder($scope.filterModel.ownerId, $vm.filterModel.saleOrderNo).then(function success(res) {
                            if (res.data.statusCode >= 4000 && res.data.statusCode < 6000) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ข้อมูลไม่ถูกต้อง',
                                    message: res.data.statusDesc
                                })
                                $vm.packStatus = null;
                                $vm.filterModel.saleOrderTable = null;
                                $vm.saleOrderTableRender = null;
                                $vm.filterModel.chkAddress = null;
                                $vm.filterModel.addressInput = null;
                                $vm.filterModel.province = null;
                                $vm.filterModel.district = null;
                                $vm.filterModel.subDistrict = null;
                                $vm.filterModel.postcode = null;
                                $vm.searchResultModel = null;
                                $vm.filterModel.saleOrderNo = null;
                                $vm.filterModel.saleOrderType = null;

                                $scope.getDefaultPackingOption();
                                $vm.box = $scope.boxSizes[0];
                                $vm.filterModel.boxQty = 1;
                            } else {
                                if (res.data.result[0]) {
                                    if (res.data.result[0].webRespone.isConfirm) {
                                        res.data.result[0].webRespone.isConfirmTxt = "Pack Confirmed";
                                    } else {
                                        res.data.result[0].webRespone.isConfirmTxt = "Packing";
                                    }
                                    if(res.data.result[0].packingOption) {
                                        $scope.filterModel.packingOption = res.data.result[0].packingOption;
                                    } else {
                                        $scope.getDefaultPackingOption();
                                        $vm.box = $scope.boxSizes[0];
                                        $vm.filterModel.boxQty = 1;
                                    }
                                    $vm.filterModel.packOption = $scope.filterModel.packingOption;
                                    $vm.filterModel.packStatus = res.data.result[0].webRespone.isConfirm;
                                    $vm.filterModel.saleOrderTable = res.data.result[0];
                                    $vm.saleOrderTableRender = res.data.result;
                                    $vm.filterModel.chkAddress = res.data.result[0].chkAddress;
                                    if (res.data.result[0].webRespone.statusCode == 0) {
                                        $vm.filterModel.saleOrderType = res.data.result[0].documentTypeId;
                                        // binding address
                                        $vm.filterModel.addressInput = res.data.result[0].shiptoAddress;
                                        $vm.filterModel.addressTemp = {
                                            province: res.data.result[0].provinceId,
                                            district: res.data.result[0].districtId,
                                            subDistrict: res.data.result[0].subDistrictId,
                                            postcode: res.data.result[0].postcodeId
                                        }
                                        if(res.data.result[0].provinceId && res.data.result[0].districtId && res.data.result[0].subDistrictId && res.data.result[0].postcodeId) {
                                            $vm.filterModel.bindingAddress();
                                        } else {
                                            $vm.filterModel.unBindingAddress();
                                        }
                                        if (res.data.result.length > 1) {
                                            document.getElementById("saleOrderNoBtn").click();
                                        }
                                    }
                                    viewModel.getCartonList($scope.filterModel.ownerId, $vm.filterModel.saleOrderNo).then(function success(res) {
                                        $vm.searchResultModel = res.data;
                                    }, function error(err) {});
                                }
                            }
                        }, function error(err) {});
                    }
                }
            }

            $scope.inputLPN = function() {
                if (!$scope.filterModel.lpnNo) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ถูกต้อง',
                        message: "กรุณาใส่ LPN Number"
                    })
                } else {
                    let body = {
                        packStationId: $scope.filterModel.packStation,
                        tagNo: $scope.filterModel.lpnNo
                    }
                    viewModel.generateLPNPackStation(body).then(function success(res) {
                        if (res.data.statusCode >= 400 && res.data.statusCode < 500) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ข้อมูลไม่ถูกต้อง',
                                message: res.data.statusDesc
                            }).then(function success() {
                                $scope.filterModel.lpnNo = null;
                            });
                        } else {
                            document.getElementById("saleOrderNoInput").focus();
                        }
                    }, function error(err) {});
                }
            }
            
            $scope.saveLpn = function() {
                if (!$scope.filterModel.lpnNo) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ถูกต้อง',
                        message: "กรุณาใส่ LPN Number"
                    })
                } else {
                    let body = {
                        packStationId: $scope.filterModel.packStation,
                        tagNo: $scope.filterModel.lpnNo
                    }
                    viewModel.generateLPNPackStation(body).then(function success(res) {
                        if (res.data.statusCode >= 400 && res.data.statusCode < 500) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ข้อมูลไม่ถูกต้อง',
                                message: res.data.statusDesc
                            }).then(function success() {
                                $scope.filterModel.lpnNo = null;
                                document.getElementById("packStationBtn").click();
                            });
                        } else {
                            document.getElementById("saleOrderNoInput").focus();
                        }
                    }, function error(err) {});
                    document.getElementById("btnCloseLpnNo").click();
                }
            }

            $scope.inputProductBarcode = function() {
                if($scope.filterModel.productBarcode && $scope.filterModel.packH && $scope.filterModel.packL &&
                $scope.filterModel.packWeight && $scope.filterModel.packW) {
                    let body = {
                        PlanGoodsIssueNo: $vm.packingItem.planGoodsIssueNo,
                        TagOutNo: $vm.packingItem.tagOutNo,
                        Productbarcode: $scope.filterModel.productBarcode,
                        BoxId: $vm.box.boxId,
                        PackHeight: parseFloat($scope.filterModel.packH),
                        PackLength: parseFloat($scope.filterModel.packL),
                        PackWeight: parseFloat($scope.filterModel.packWeight),
                        PackWidth: parseFloat($scope.filterModel.packW),
                        Qty: 1,
                        User: localStorageService.get('userTokenStorage')
                    }
                    viewModel.savePackingItem(body).then(function success(res) {
                        if (res.data.statusCode != 200) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ข้อมูลไม่ถูกต้อง',
                                message: res.data.statusDesc
                            })
                            setTimeout(function(){
                                $scope.filterModel.productBarcode = null;
                                document.getElementById("productBarcode").focus();
                            }, 500);
                            document.getElementById("newBoxModal").style.overflowX = "hidden";
                            document.getElementById("newBoxModal").style.overflowY = "auto";
                        } else {
                            viewModel.getPackingItem(
                                $scope.filterModel.ownerId,
                                $vm.packingItem.planGoodsIssueNo,
                                $vm.packingItem.tagOutNo
                            ).then(function success(res) {
                                if (res.data.statusCode == 200) {
                                    $vm.packingItemTable = res.data.result;
                                    document.getElementById("productBarcode").focus();
                                    document.getElementById("productBarcode").select();
                                } else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'ข้อมูลไม่ถูกต้อง',
                                        message: res.data.statusDesc
                                    })
                                }
                            }, function error(err) {});
                        }
                    }, function error(err) {});
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: "กรุณากรอก Product Barcode, ความยาว, ความกว้าง, ความสูง, น้ำหนัก"
                    })
                }
            }

            $scope.createNewCarton = function() {
                $scope.filterModel.productBarcode = null;
                if($scope.filterModel.packingOption == "1") {
                    $vm.box = $scope.boxSizes[0];
                }
                $vm.customBox = true;
                $vm.filterModel.packOption = $scope.filterModel.packingOption;
                $scope.filterModel.packL = $vm.box.length;
                $scope.filterModel.packW = $vm.box.width;
                $scope.filterModel.packH = $vm.box.height;
                $scope.filterModel.packWeight = $vm.box.weight;
                if (!$scope.filterModel.ownerId || !$vm.filterModel.saleOrderNo || !$scope.filterModel.packStation || !$vm.filterModel.boxQty) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: "กรุณากรอก Owner, Pack Station, Sale Order Number และจำนวนกล่อง"
                    })
                } else {
                    $vm.packingItemTable = null;
                    if($scope.filterModel.packingOption == "1") {
                        document.getElementById("newBoxBtn").click();
                        setTimeout(function(){document.getElementById("productBarcode").focus();}, 500);
                        let body = {
                            OrderNo: $vm.filterModel.saleOrderNo,
                            PackStationId: $scope.filterModel.packStation,
                            PackingOption: $scope.filterModel.packingOption,
                            BoxId: $vm.box.boxId,
                            BoxQty: 1,
                            user: $scope.userName
                        }
                        viewModel.createNewCarton(body).then(function success(res) {
                            if (res.data.statusCode >= 400 && res.data.statusCode < 500) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ข้อมูลไม่ถูกต้อง',
                                    message: res.data.statusDesc
                                })
                            } else {
                                $vm.packingItem = res.data.result[0];
                                viewModel.getCartonList(
                                    $scope.filterModel.ownerId,
                                    $vm.filterModel.saleOrderNo
                                ).then(function success(res) {
                                    $vm.searchResultModel = res.data;
                                }, function error(err) {});
                            }
                        }, function error(err) {});
                    } else {
                        let body = {
                            OrderNo: $vm.filterModel.saleOrderNo,
                            PackStationId: $scope.filterModel.packStation,
                            PackingOption: $scope.filterModel.packingOption,
                            BoxId: $vm.box.boxId,
                            BoxQty: parseInt($vm.filterModel.boxQty),
                            user: $scope.userName
                        }
                        viewModel.createNewCarton(body).then(function success(res) {
                            if (res.data.statusCode >= 400 && res.data.statusCode < 500) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ข้อมูลไม่ถูกต้อง',
                                    message: res.data.statusDesc
                                })
                            } else {
                                viewModel.getCartonList(
                                    $scope.filterModel.ownerId,
                                    $vm.filterModel.saleOrderNo
                                ).then(function success(res) {
                                    $vm.searchResultModel = res.data;
                                }, function error(err) {});
                            }
                        }, function error(err) {});
                    }
                }
            }

            $scope.newBox = function() {
                $vm.packingItemTable = null;
                $scope.filterModel.productBarcode = null;
                setTimeout(function(){document.getElementById("productBarcode").focus();}, 500);
                $vm.box = $scope.boxSizes[0];
                $vm.customBox = true;
                $vm.filterModel.packOption = $scope.filterModel.packingOption;
                $scope.filterModel.packL = $vm.box.length;
                $scope.filterModel.packW = $vm.box.width;
                $scope.filterModel.packH = $vm.box.height;
                $scope.filterModel.packWeight = $vm.box.weight;
                let body = {
                    OrderNo: $vm.filterModel.saleOrderNo,
                    PackStationId: $scope.filterModel.packStation,
                    PackingOption: "1",
                    BoxId: $vm.box.boxId,
                    BoxQty: 1,
                    user: $scope.userName
                }
                viewModel.createNewCarton(body).then(function success(res) {
                    if (res.data.statusCode >= 400 && res.data.statusCode < 500) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ข้อมูลไม่ถูกต้อง',
                            message: res.data.statusDesc
                        })
                    } else {
                        $vm.packingItem = res.data.result[0];
                        viewModel.getCartonList(
                            $scope.filterModel.ownerId,
                            $vm.filterModel.saleOrderNo
                        ).then(function success(res) {
                            $vm.searchResultModel = res.data;
                        }, function error(err) {});
                    }
                }, function error(err) {});
            }

            $vm.triggerSearch = function() {
                pageLoading.show();
                if ($vm.filterModel.chkinitpage) {
                    $scope.filterSearch()
                } else {
                    $vm.filterModel.totalRow = 0;
                    $vm.filterModel.currentPage = 1;
                    $vm.filterModel.numPerPage = 1;
                    $vm.filterModel.num = 10;
                    $vm.filterModel.maxSize = 10;
                    $vm.filterModel.perPage = 30;
                }
            };

            $scope.toggleSearch = function() {
                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };

            $scope.filter = function() {
                $vm.triggerSearch();
            };

            $scope.header = {
                Search: true
            };

            $scope.hide = function() {
                $scope.header.Search = $scope.header.Search === false ? true : false;
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };

            $scope.searchFilter = function(param) {
                var deferred = $q.defer();
                if ((param.ownerName === undefined || param.ownerName == ""))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {});
                return deferred.promise;
            }

            $scope.filterSearch = function() {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.totalRow = $vm.filterModel.totalRow
                $scope.filterModel.currentPage = $vm.filterModel.currentPage
                $scope.filterModel.perPage = $vm.filterModel.perPage
                $scope.filterModel.numPerPage = $vm.filterModel.numPerPage
                $vm.filterModel.chkinitpage = true;
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                }, function error(res) {});
            }

            $scope.clearSearch = function() {
                $scope.filterModel = {};
                $scope.filterSearch();
                $window.scrollTo(0, 0);
            }

            // This local function
            $vm.setDateFormate = function(v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            //Clear Index
            $scope.$watch('filterModel.ownerName', function() {
                if ($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp) {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })

            function initialize() {};

            this.$onInit = function() {
                $scope.filterModel = {};
                $scope.filterModel.ownerId = localStorageService.get("ownerVariableId");
                $vm.filterModel.ownerId = localStorageService.get("ownerVariableId");
                $scope.filterModel.ownerIndex = localStorageService.get("ownerVariableIndex");
                $scope.filterModel.ownerName = localStorageService.get("ownerVariableName");
                $scope.filterModel.ownerNameTemp = $scope.filterModel.ownerName;
                $scope.getDefaultPackingOption();
                $scope.getBoxMaster();
                $vm.customBox = true;
                $scope.userName = localStorageService.get('userTokenStorage');
            };

            this.$onDestroy = function() {};

            $scope.$on('$destroy', function() {
                $vm.$onDestroy();
            });

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function(param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                    document.getElementById("packStationInput").focus();
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function(param) {},
                    edit: function(param) {},
                    selected: function(param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $vm.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);
                        $scope.filterModel.ownerNameTemp = $scope.filterModel.ownerName;
                        document.getElementById("packStationInput").focus();

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));

                        $vm.filterModel.saleOrderTable = null;
                        $vm.searchResultModel = null;
                        $vm.packStatus = null;
                        $scope.filterModel.packStation = null;
                        $scope.filterModel.lpnNo = null;
                        $vm.filterModel.saleOrderNo = null;
                        $vm.filterModel.saleOrderType = null;

                        $scope.getDefaultPackingOption();
                        $vm.box = $scope.boxSizes[0];
                        $vm.filterModel.boxQty = 1;

                        $vm.filterModel.chkAddress = null;
                        $vm.filterModel.addressInput = null;
                        $vm.filterModel.province = null;
                        $vm.filterModel.district = null;
                        $vm.filterModel.subDistrict = null;
                        $vm.filterModel.postcode = null;
                    }
                }
            };

            $scope.closeLPN = function(){
                if (!$scope.filterModel.packStation ||
                    !$scope.filterModel.ownerId) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: "กรุณากรอกข้อมูลให้ครบ"
                    })
                    document.getElementById("packStationInput").focus();
                }
                else if(!$scope.filterModel.lpnNo){
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ข้อมูลไม่ครบ',
                        message: "กรุณากรอก LPN Number"
                    })
                    document.getElementById("lpnNoInput").focus();
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm',
                        message: 'Do you want to Close LPN ?'
                    }).then(function success() {
                        let body = {
                            packstationId: $scope.filterModel.packStation,
                            userId: localStorageService.get('userTokenStorage')
                        }
                        viewModel.closePackStation(body).then(function success(res) {
                            document.getElementById("packStationInput").focus();
                            $scope.filterModel.packStation = null;
                            $scope.filterModel.lpnNo = null;
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information',
                                message: res.data.statusDesc
                            })
                        }, function error(err) {});
                    });
                }
            }

            $scope.changePackingOption = function() {
                $vm.filterModel.packOption = $scope.filterModel.packingOption;
            }

            $scope.getDefaultPackingOption = function() {
                viewModel.getDefaultPackingOption().then(function success(res) {
                    $scope.filterModel.packingOption = res.data.result.configValueNo;
                }, function error(err) {});
            }

            $scope.getBoxMaster = function() {
                viewModel.getBoxMaster().then(function success(res) {
                    $scope.boxSizes = res.data;
                    $vm.box = res.data[0];
                }, function error(err) {});
            }

            $scope.getBoxSize = function() {
                var box = $vm.box;
                if($vm.box == "0") {
                    $vm.customBox = true;
                } else {
                    $vm.customBox = false;
                }
                for(var i = 0; i < $scope.boxSizes.length; i++) {
                    if($scope.boxSizes[i].boxId == $vm.box) {
                        $vm.box = $scope.boxSizes[i];
                        break;
                    }
                }
                $scope.filterModel.packL = $vm.box.length;
                $scope.filterModel.packW = $vm.box.width;
                $scope.filterModel.packH = $vm.box.height;
                $scope.filterModel.packWeight = $vm.box.weight;
                if($vm.packingItemTable && $vm.packingItemTable.length > 0) {
                    if($vm.packingItemTable.packingItem.length > 0 && box == "0") {
                        $scope.filterModel.packL = $scope.boxSizes[0].length;
                        $scope.filterModel.packW = $scope.boxSizes[0].width;
                        $scope.filterModel.packH = $scope.boxSizes[0].height;
                        $scope.filterModel.packWeight = $scope.boxSizes[0].weight;
                    }
                }                
            }

        }
    });

})();