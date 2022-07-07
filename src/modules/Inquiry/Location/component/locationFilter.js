(function () {
    'use strict';
    app.component('inqLocationFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Inquiry/Location/component/locationFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?',
            resultLocationDetail: '=?',
            resultPutawaySuggestion: '=?',
            putAwaySug: '=?'

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, localStorageService, dpMessageBox, commonService, inquiryLocationFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = inquiryLocationFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                viewModel.search($vm.filterModel).then(function (res) {
                    pageLoading.hide();

                    $vm.resultLocationDetail = res.data.items;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.filterModel.maxSize = 3;

                    if (res.paginations != null || res.paginations != undefined) {
                        $vm.filterModel.totalRow = paginations.totalRow;
                    }


                });
            };

            $("#locationNo").bind("focus", function () {
                setTimeout(() => {
                    $("#locationNo").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#locationNo").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    $("#focusScanLocation").focus();
                }
            });

            $scope.selectedTab = function (tab) {
                if (tab == 1) {
                    $scope.colortab1 = "#FDFEFE";
                    $scope.colortab2 = "#D3D3D3";
                    $vm.filterModel.selected = 1;
                }
                else if (tab == 2) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#FDFEFE";
                    $vm.filterModel.selected = 2;

                }
                $scope.selected = tab;

            }


            $scope.ScanlocationName = function () {
                $vm.filterModel = $vm.filterModel || {};
                debugger
                viewModel.search($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    $vm.filterModel.maxSize = 5;
                    if (res.paginations != null || res.paginations != undefined) {
                        $vm.filterModel.totalRow = paginations.totalRow;
                    }
                    $vm.resultLocationDetail = res.data.items;
                });
            }

            $scope.putawaySuggestSearch = function () {
                // $vm.filterModel.orderNo = $scope.filterModel.orderNo;
                debugger
                viewModel.searchPutawaySuggest($vm.putAwaySug).then(function (res) {
                    debugger
                    $vm.resultPutawaySuggestion = res.data.items;
                    // $vm.filterModel = $scope.filterModel;
                    $vm.putAwaySug.totalRow = res.data.pagination.totalRow;
                    $vm.putAwaySug.currentPage = res.data.pagination.currentPage;
                    $vm.putAwaySug.perPage = res.data.pagination.perPage;
                    $vm.putAwaySug.numPerPage = res.data.pagination.perPage;
                    $vm.putAwaySug.maxSize = 5;


                }, function error(res) { });
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



            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();
                $state.reload();
                $window.scrollTo(0, 0);
            }


            $scope.popupZone = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZone.onShow = !$scope.popupZone.onShow;
                    $scope.popupZone.delegates.zonePopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $vm.filterModel.zoneId = angular.copy(param.zoneId);
                        $vm.filterModel.zoneName = angular.copy(param.zoneName);
                    }
                }
            };


            //-----------------------------------------------------
            //Export Excel

            $scope.exportFile = {
                ExportFileLocationDetails: function (fileType) {
                    dpMessageBox.confirm({
                        title: 'Confirm.',
                        message: 'Do you want to download?'
                    }).then(function success() {
                        // var item = $vm.searchResultModel;
                        ExportFileLocationDetails(fileType);
                    });
                },
                ExportFilePutawaySuggestionLocation: function (fileType) {
                    debugger
                    dpMessageBox.confirm({
                        title: 'Confirm.',
                        message: 'Do you want to download?'
                    }).then(function success() {
                        // var item = $vm.searchResultModel;
                        ExportFilePutawaySuggestionLocation(fileType);
                    });
                },
            }
    
            function ExportFileLocationDetails(fileType) {
                var item = angular.copy($vm.resultLocationDetail);
                // var model = {};
    debugger
                // model = { 'listInquiryLocationDetails': $vm.resultLocationDetail, 'locationName': $vm.filterModel.locationName };
    
                // debugger
                // let dataList = model.listInquiryLocationDetails;
                // for (var i = 0; i <= dataList.length - 1; i++) {
                //     model.listInquiryLocationDetails[i].rowIndex = i + 1
                //     model.listInquiryLocationDetails[i].Type = 'LocationDetails';
                // }
    
                var deferred = $q.defer();
                $vm.filterModel.excelName = 'LocationDetails'
                $vm.filterModel.reportType = fileType
                viewModel.ExportLocationDetails($vm.filterModel).then(
                    function success(results) {
                        $vm.triggerSearch
                        deferred.resolve(results);
                    },
                    function error(response) {
    
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
    
            function ExportFilePutawaySuggestionLocation(fileType) {
                var item = angular.copy($vm.resultPutawaySuggestion);
                // var model = {};
    
                // model = { 'listInquiryPutawaySuggestionLocation': $vm.resultPutawaySuggestion, 'locationName': $vm.putAwaySug.locationName };
    
                // debugger
                // let dataList = model.listInquiryPutawaySuggestionLocation;
                // for (var i = 0; i <= dataList.length - 1; i++) {
                //     model.listInquiryPutawaySuggestionLocation[i].rowIndex = i + 1
                //     model.listInquiryPutawaySuggestionLocation[i].Type = 'PutawaySuggestionLocation';
                // }
                debugger
                var deferred = $q.defer();
                // 
                $vm.putAwaySug.excelName = 'PutawaySuggestionLocation';
                $vm.putAwaySug.reportType = fileType
                viewModel.ExportPutawaySuggestionLocation($vm.putAwaySug).then(
                    function success(results) {
                        $vm.triggerSearch
                        deferred.resolve(results);
                    },
                    function error(response) {
    
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
    

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

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

            this.$onInit = function () {
                // $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                setTimeout(() => {
                    $("#locationNo").focus();
                }, 300);

            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

        }
    });

})();