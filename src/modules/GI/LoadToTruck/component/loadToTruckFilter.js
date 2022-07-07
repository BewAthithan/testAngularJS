(function () {
  "use strict";
  app.component("loadToTruckFilter", {
    controllerAs: "$vm",
    templateUrl: function (
      $element,
      $attrs,
      /*ngAuthSettings,*/ $window,
      commonService
    ) {
      return "modules/GI/LoadToTruck/component/loadToTruckFilter.html";
    },
    bindings: {
      searchResultModel: "=?",
      filterModel: "=?",
      triggerSearch: "=?",
      triggerCreate: "=?",
      filterSearch: "=?",
    },
    controller: function (
      $scope,
      $q,
      $http,
      $filter,
      $state,
      $window,
      $element,
      $timeout,
      $translate,
      /*ngAuthSettings,*/ pageLoading,
      commonService,
      dpMessageBox,
      loadTruckFactory,
      localStorageService
    ) {
      var $vm = this;

      // ----------------------------------------------------
      // This default object
      var xString = commonService.string;
      var xObject = commonService.objects;
      var loading = commonService.loading;
      var MessageBox = commonService.messageBox;
      var viewModel = loadTruckFactory;
      var model = $scope.filterModel;

      $scope.truckRouteSelected = [];
      $scope.storeSelected = [];
      $scope.truckRouteData = [];
      $scope.storeData = [];
      $scope.truckIdList = [];
      $scope.truckGroupIds = [];

      $scope.truckRouteSetting = {
        enableSearch: true,
        checkBoxes: true,
        displayProp: "truckRoundName",
        idProp: "truckRoundId",
        selectByGroups: $scope.truckGroupIds,
        groupBy: "truckRouteGroupId",
      };

      $scope.storeSetting = {
        enableSearch: true,
        showCheckAll: false,
        showUncheckAll: false,
        checkBoxes: true,
        displayProp: "displayStore",
        idProp: "storeNo",
      };
      $scope.isFilter = true;
      $scope.storeList = [];
      $vm.cartonSelected = [];

      $vm.stores = [];
      $vm.storeSearch = {
        storeNo: "",
        storeName: ""
      };

      $scope.pageOption = [{ value: "All" }, { value: 15 }, { value: 30 }];

      $scope.filterModelModal = {
        currentPage: 1,
        perPage: "All",
        totalRow: 0,
        key: "",
        advanceSearch: false,
        showError: false,
        type: 1,
        chkinitpage: false,
        maxSize: 30,
        num: 1,
      };

      $vm.triggerSearch = function () {
        pageLoading.show();
        if ($vm.filterModel.chkinitpage) {
          $scope.filterSearch();
        } else {
          $vm.filterModel.CreateDate = getToday();
          $vm.filterModel.columnName = "TruckLoad_No";
          $vm.filterModel.orderBy = "ASC";
          viewModel.search($vm.filterModel).then(function (res) {
            pageLoading.hide();
            $vm.filterModel.totalRow = res.data.pagination.totalRow;
            $vm.filterModel.currentPage = res.data.pagination.currentPage;
            $vm.filterModel.perPage = res.data.pagination.perPage;
            $vm.filterModel.numPerPage = res.data.pagination.perPage;
            $vm.searchResultModel = res.data.items;
          });
        }
      };

      $scope.header = {
        Search: true,
      };

      $scope.hide = function () {
        $scope.header.Search = $scope.header.Search === false ? true : false;
      };

      $scope.toggleSearch = function () {
        $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
      };

      $scope.filter = function () {
        $vm.triggerSearch();
      };

      $scope.getSearchParams = function () {
        return angular.copy($vm.filterModel);
      };

      $scope.searchFilter = function (param) {
        var deferred = $q.defer();
        if (
          param.truckLoadDateFrom == "" &&
          param.truckLoadDateTo == "" &&
          param.deliveryDateFrom == "" &&
          param.deliveryDateTo == "" &&
          (param.truckLoadNo === undefined || param.truckLoadNo == "") &&
          (param.vehicleTypeName === undefined ||
            param.vehicleTypeName == "") &&
          (param.soldToName === undefined || param.soldToName == "") &&
          (param.ownerName === undefined || param.ownerName == "") &&
          (param.shipToName === undefined || param.shipToName == "") &&
          (param.dockDoorName === undefined || param.dockDoorName == "") &&
          (param.c3PLName === undefined || param.c3PLName == "") &&
          (param.routeName === undefined || param.routeName == "") &&
          (param.roundName === undefined || param.roundName == "")
        )
          dpMessageBox
            .confirm({
              ok: "Yes",
              cancel: "No",
              title: "Confirm.",
              message: "Do you want to Search Data ?",
            })
            .then(function success() {
              viewModel.search(param).then(
                function success(res) {
                  deferred.resolve(res);
                },
                function error(response) {
                  deferred.reject(response);
                }
              );
            });
        else
          viewModel.search(param).then(
            function success(res) {
              deferred.resolve(res);
            },
            function error(response) {
              deferred.reject(response);
            }
          );
        return deferred.promise;
      };

      $scope.filterSearch = function () {
        $scope.filterModel = $scope.filterModel || {};
        $scope.filterModel.totalRow = $vm.filterModel.totalRow;
        $scope.filterModel.currentPage = $vm.filterModel.currentPage;
        $scope.filterModel.perPage = $vm.filterModel.perPage;
        $scope.filterModel.numPerPage = $vm.filterModel.numPerPage;
        $scope.filterModel.num = $vm.filterModel.num;
        $vm.filterModel.chkinitpage = true;
        $vm.filterModel.CreateDate = "";

        $scope.searchFilter($scope.filterModel).then(
          function success(res) {
            $vm.filterModel = $scope.filterModel;
            $vm.filterModel.totalRow = res.data.pagination.totalRow;
            $vm.filterModel.currentPage = res.data.pagination.currentPage;
            $vm.filterModel.perPage = res.data.pagination.perPage;
            $vm.filterModel.numPerPage = res.data.pagination.perPage;
            $vm.searchResultModel = res.data.items;
          },
          function error(res) {}
        );
      };

      $scope.filterSearchHelper = function () {
        // $vm.filterModel.chkinitpage = true;
        // let body = {
        //     size:  $scope.filterModelModal.perPage == "All" ? null : $scope.filterModelModal.perPage,
        //     page: $scope.filterModelModal.currentPage,
        //     cartonStatusId: $scope.filterModel.cartonStatusId,
        //     StoreNos: $scope.storeList,
        //     excludedCartons: []
        // }

        let body = {
          Size:
            $scope.filterModelModal.perPage == "All"
              ? null
              : $scope.filterModelModal.perPage,
          Page: $scope.filterModelModal.currentPage,
          RequestBody: {
            CartonStatusId: $scope.filterModel.cartonStatusId,
            StoreNos: $scope.storeList,
            UserId: localStorageService.get("userTokenStorage"),
          },
        };

        viewModel.getCartonStore(body).then(function success(param) {
          if (param.data.statusCode == "200") {
            // $scope.filterModel.totalRow = param.data.totalRow;
            // $scope.filterModel.currentPage = $vm.filterModel.currentPage;
            // $scope.filterModel.perPage = $vm.filterModel.perPage;
            // $scope.filterModel.numPerPage = $vm.filterModel.numPerPage;

            $vm.searchResultModel = param.data.result;
            $vm.filterModelModal.totalRow = param.data.totalRows;
            $vm.filterModelModal.currentPage =
              $scope.filterModelModal.currentPage;
            $vm.filterModelModal = $scope.filterModelModal;
            $vm.filterModelModal.perPage =
              $scope.filterModelModal.perPage ?? "All";
            $vm.filterModelModal.numPerPage = $scope.filterModelModal.perPage;

            let filterCarton = param.data.result;
            if ($vm.cartonSelected.length > 0) {
              filterCarton = filterCarton.filter(
                (it) =>
                  !$vm.cartonSelected
                    .map((i) => i.cartonNo)
                    .includes(it.cartonNo)
              );
            }
            $vm.searchResultModel = filterCarton;
          }
        });
      };

      $scope.changePage = function () {
        var page = $vm.filterModelModal;

        var all = {
          currentPage: 0,
          perPage: 0,
        };
        if ($vm.filterModelModal.currentPage != 0) {
          page.currentPage = page.currentPage;
        }

        $scope.filterSearchHelper();
      };

      $scope.detectCheckAllCartonStatus = function () {
        if ($scope.checkAllCartonStatus === true) {
          angular.forEach($vm.searchResultModel, function (v, k) {
            $vm.searchResultModel[k].selected = true;
          });
        } else {
          angular.forEach($vm.searchResultModel, function (v, k) {
            $vm.searchResultModel[k].selected = false;
          });
        }
      };

      $scope.detectCheckAllAddCartonStatus = function () {
        if ($scope.checkAllAddCartonStatus === true) {
          angular.forEach($vm.cartonSelected, function (v, k) {
            $vm.cartonSelected[k].selected = true;
          });
        } else {
          angular.forEach($vm.cartonSelected, function (v, k) {
            $vm.cartonSelected[k].selected = false;
          });
        }
      };

      $scope.clearSearch = function () {
        $scope.filterModel = {};
        $scope.filterModel.truckLoadDateFrom = getToday();
        $scope.filterModel.truckLoadDateTo = getToday();
        $scope.filterModel.deliveryDateFrom = getToday();
        $scope.filterModel.deliveryDateTo = getToday();
        $scope.filterModel.deliveryDate = getToday();
        $scope.filterModel.truckLoadDate = getToday();
        $scope.filterModel.truckLoadRound = "1";
        
        $scope.storeData = [];
        $scope.truckIdList = [];
        $scope.storeSelected = [];
        $scope.storeList = [];
        $scope.truckRouteSelected = [];
        $vm.cartonSelected = [];
        $vm.searchResultModel = [];
        $scope.loadDefaultOwner();
        $scope.loadTruckRoute();
        $scope.loadStatusCarton();

        //$state.reload();
        $window.scrollTo(0, 0);
      };

      $vm.setDateFormate = function (v) {
        try {
            return $filter("dateFormate")(v);
        } catch (e) {
            return "-";
        }
      }

      // -----------------SET DAY default-----------------//
      function getToday() {
        var today = new Date();

        var mm = today.getMonth() + 1;
        var yyyy = today.getUTCFullYear();
        var dd = today.getDate();

        if (dd < 10) dd = "0" + dd;
        if (mm < 10) mm = "0" + mm;

        return yyyy.toString() + mm.toString() + dd.toString();
      }

      // -----------------ALL POPUP IN PAGE-----------------//

      $scope.popupOwner = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
          $scope.popupOwner.delegates.ownerPopup(param, index);
        },
        config: {
          title: "owner",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
            $scope.filterModel.ownerId = angular.copy(param.ownerId);
            $scope.filterModel.ownerName = angular.copy(param.ownerName);

            localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
            localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
            localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
          },
        },
      };

      //Check Date----------------------------
      $scope.$watch("filterModel.truckLoadDateFrom", function () {
        var pattern = /(\d{4})(\d{2})(\d{2})/;
        if (
          $scope.filterModel.truckLoadDateFrom != undefined &&
          $scope.filterModel.truckLoadDateTo != undefined
        ) {
          var ds = Date.parse(
            $scope.filterModel.truckLoadDateFrom.replace(pattern, "$1-$2-$3")
          );
          var de = Date.parse(
            $scope.filterModel.truckLoadDateTo.replace(pattern, "$1-$2-$3")
          );
        }

        if (ds > de) {
          dpMessageBox.alert({
            ok: "Close",
            title: "Validate",
            message: "ระบุวันที่ไม่ถูกต้อง !",
          });
          $scope.filterModel.truckLoadDateFrom =
            $scope.filterModel.truckLoadDateTo;
        }
      });

      $scope.$watch("filterModel.truckLoadDateTo", function () {
        var pattern = /(\d{4})(\d{2})(\d{2})/;
        if (
          $scope.filterModel.truckLoadDateFrom != undefined &&
          $scope.filterModel.truckLoadDateTo != undefined
        ) {
          var ds = Date.parse(
            $scope.filterModel.truckLoadDateFrom.replace(pattern, "$1-$2-$3")
          );
          var de = Date.parse(
            $scope.filterModel.truckLoadDateTo.replace(pattern, "$1-$2-$3")
          );
        }

        if (de < ds) {
          dpMessageBox.alert({
            ok: "Close",
            title: "Validate",
            message: "ระบุวันที่ไม่ถูกต้อง !",
          });
          $scope.filterModel.truckLoadDateTo =
            $scope.filterModel.truckLoadDateFrom;
        }
      });
      /////
      $scope.$watch("filterModel.deliveryDateFrom", function () {
        var pattern = /(\d{4})(\d{2})(\d{2})/;
        if (
          $scope.filterModel.deliveryDateFrom != undefined &&
          $scope.filterModel.deliveryDateTo != undefined
        ) {
          var ds = Date.parse(
            $scope.filterModel.deliveryDateFrom.replace(pattern, "$1-$2-$3")
          );
          var de = Date.parse(
            $scope.filterModel.deliveryDateTo.replace(pattern, "$1-$2-$3")
          );
        }

        if (ds > de) {
          dpMessageBox.alert({
            ok: "Close",
            title: "Validate",
            message: "ระบุวันที่ไม่ถูกต้อง !",
          });
          $scope.filterModel.deliveryDateFrom =
            $scope.filterModel.deliveryDateTo;
        }
      });

      $scope.$watch("filterModel.deliveryDateTo", function () {
        var pattern = /(\d{4})(\d{2})(\d{2})/;
        if (
          $scope.filterModel.deliveryDateFrom != undefined &&
          $scope.filterModel.deliveryDateTo != undefined
        ) {
          var ds = Date.parse(
            $scope.filterModel.deliveryDateFrom.replace(pattern, "$1-$2-$3")
          );
          var de = Date.parse(
            $scope.filterModel.deliveryDateTo.replace(pattern, "$1-$2-$3")
          );
        }

        if (de < ds) {
          dpMessageBox.alert({
            ok: "Close",
            title: "Validate",
            message: "ระบุวันที่ไม่ถูกต้อง !",
          });
          $scope.filterModel.deliveryDateTo =
            $scope.filterModel.deliveryDateFrom;
        }
      });

      //Clear Index
      $scope.$watch("filterModel.ownerName", function () {
        if ($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp) {
          $scope.filterModel.ownerIndex =
            "00000000-0000-0000-0000-000000000000";
        }
      });
      $scope.$watch("filterModel.shipToName", function () {
        if (
          $scope.filterModel.shipToName != $scope.filterModel.shipToNameTemp
        ) {
          $scope.filterModel.shipToIndex =
            "00000000-0000-0000-0000-000000000000";
        }
      });
      $scope.$watch("filterModel.shipToName", function () {
        if (
          $scope.filterModel.shipToName != $scope.filterModel.shipToNameTemp
        ) {
          $scope.filterModel.shipToIndex =
            "00000000-0000-0000-0000-000000000000";
        }
      });
      $scope.$watch("filterModel.vehicleTypeName", function () {
        if (
          $scope.filterModel.vehicleTypeName !=
          $scope.filterModel.vehicleTypeNameTemp
        ) {
          $scope.filterModel.vehicleTypeIndex =
            "00000000-0000-0000-0000-000000000000";
        }
      });
      $scope.$watch("filterModel.dockDoorName", function () {
        if (
          $scope.filterModel.dockDoorName != $scope.filterModel.dockDoorNameTemp
        ) {
          $scope.filterModel.dockDoorIndex =
            "00000000-0000-0000-0000-000000000000";
        }
      });
      $scope.$watch("filterModel.c3PLName", function () {
        if ($scope.filterModel.c3PLName != $scope.filterModel.c3PLNameTemp) {
          $scope.filterModel.c3PLIndex = "00000000-0000-0000-0000-000000000000";
        }
      });

      $scope.popupSoldTo = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupSoldTo.onShow = !$scope.popupSoldTo.onShow;
          $scope.popupSoldTo.delegates.soldToPopup(param, index);
        },
        config: {
          title: "soldTo",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.soldToIndex = angular.copy(param.soldToIndex);
            $scope.filterModel.soldToId = angular.copy(param.soldToId);
            $scope.filterModel.soldToName = angular.copy(param.soldToName);
            $scope.filterModel.soldToNameTemp = $scope.filterModel.soldToName;
          },
        },
      };

      $scope.popupShipTo = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupShipTo.onShow = !$scope.popupShipTo.onShow;
          $scope.popupShipTo.delegates.shipToPopup(param, index);
        },
        config: {
          title: "shipTo",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.shipToIndex = angular.copy(param.shipToIndex);
            $scope.filterModel.shipToId = angular.copy(param.shipToId);
            $scope.filterModel.shipToName = angular.copy(param.shipToName);
            $scope.filterModel.shipToNameTemp = $scope.filterModel.shipToName;
          },
        },
      };

      $scope.popupRound = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupRound.onShow = !$scope.popupRound.onShow;
          $scope.popupRound.delegates.roundPopup(param, index);
        },
        config: {
          title: "Round",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.roundIndex = angular.copy(param.roundIndex);
            $scope.filterModel.roundId = angular.copy(param.roundId);
            $scope.filterModel.roundName = angular.copy(param.roundName);
            $scope.filterModel.roundNameTemp = $scope.filterModel.roundName;
          },
        },
      };

      $scope.popupRoute = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupRoute.onShow = !$scope.popupRoute.onShow;
          $scope.popupRoute.delegates.routePopup(param, index);
        },
        config: {
          title: "Route",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.routeIndex = angular.copy(param.routeIndex);
            $scope.filterModel.routeId = angular.copy(param.routeId);
            $scope.filterModel.routeName = angular.copy(param.routeName);
            $scope.filterModel.routeNameTemp = $scope.filterModel.routeName;
          },
        },
      };

      $scope.popupt3pl = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupt3pl.onShow = !$scope.popupt3pl.onShow;
          $scope.popupt3pl.delegates.t3plPopup(param, index);
        },
        config: {
          title: "3PL",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.c3PLIndex = angular.copy(param.c3PLIndex);
            $scope.filterModel.c3PLId = angular.copy(param.c3PLId);
            $scope.filterModel.c3PLName = angular.copy(param.c3PLName);
            $scope.filterModel.c3PLNameTemp = $scope.filterModel.c3PLName;
          },
        },
      };

      $scope.popupImport = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupImport.onShow = !$scope.popupImport.onShow;
          $scope.popupImport.delegates.importPopup(param, index);
        },
        config: {
          title: "Import",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            dpMessageBox.alert({
              ok: "Close",
              title: "Information.",
              message: "นำเข้าข้อมูลสำเร็จ",
            });
            $vm.triggerSearch();
          },
        },
      };

      $scope.popupVehicleType = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupVehicleType.onShow = !$scope.popupVehicleType.onShow;
          $scope.popupVehicleType.delegates.vehicleTypePopup(param, index);
        },
        config: {
          title: "VehicleType",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.vehicleTypeIndex = angular.copy(
              param.vehicleTypeIndex
            );
            $scope.filterModel.vehicleTypeId = angular.copy(
              param.vehicleTypeId
            );
            $scope.filterModel.vehicleTypeName = angular.copy(
              param.vehicleTypeName
            );
            $scope.filterModel.vehicleTypeNameTemp =
              $scope.filterModel.vehicleTypeName;
          },
        },
      };

      $scope.popupDockDoor = {
        onShow: false,
        delegates: {},
        onClick: function (param, index) {
          $scope.popupDockDoor.onShow = !$scope.popupDockDoor.onShow;
          $scope.popupDockDoor.delegates.dockDoorPopup(param, index);
        },
        config: {
          title: "DockDoor",
        },
        invokes: {
          add: function (param) {},
          edit: function (param) {},
          selected: function (param) {
            $scope.filterModel.dockDoorIndex = angular.copy(
              param.dockDoorIndex
            );
            $scope.filterModel.dockDoorId = angular.copy(param.dockDoorId);
            $scope.filterModel.dockDoorName = angular.copy(param.dockDoorName);
            $scope.filterModel.dockDoorNameTemp =
              $scope.filterModel.dockDoorName;
          },
        },
      };

      $scope.listTruckRound = ["1", "2", "3"];

      $scope.SelectFile = function (file) {
        $scope.SelectedFile = file;
      };

      $scope.Upload = function (file) {
        $scope.SelectedFile = file;
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
        if (regex.test($scope.SelectedFile.name.toLowerCase())) {
          if (typeof FileReader != "undefined") {
            var reader = new FileReader();
            //For Browsers other than IE.
            if (reader.readAsBinaryString) {
              reader.onload = function (e) {
                $scope.ProcessExcel(e.target.result);
              };
              reader.readAsBinaryString($scope.SelectedFile);
            } else {
              //For IE Browser.
              reader.onload = function (e) {
                var data = "";
                var bytes = new Uint8Array(e.target.result);
                for (var i = 0; i < bytes.byteLength; i++) {
                  data += String.fromCharCode(bytes[i]);
                }
                $scope.ProcessExcel(data);
              };
              reader.readAsArrayBuffer($scope.SelectedFile);
            }
          } else {
            $window.alert("This browser does not support HTML5.");
          }
        } else {
          $window.alert("Please upload a valid Excel file.");
        }
      };

      $scope.ProcessExcel = function (data) {
        //Read the Excel File data.
        var workbook = XLSX.read(data, {
          type: "binary",
        });

        //Fetch the name of First Sheet.
        var firstSheet = workbook.SheetNames[0];

        //Read all rows from First Sheet into an JSON array.
        var excelRows = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[firstSheet]
        );

        //Display the data from Excel file in Table.
        $scope.$apply(function () {
          $scope.ImportTruckLoad = excelRows;

          $scope.IsVisible = true;
          $scope.import($scope.ImportTruckLoad);
        });
      };

      $scope.import = function (param) {
        viewModel.postImport(param).then(function (res) {
          if (res.data == "S") {
            dpMessageBox.alert({
              ok: "Close",
              title: "Information.",
              message: "นำเข้าข้อมูลสำเร็จ",
            });
            $scope.ImportTruckLoad = {};
            $vm.triggerSearch();
            $scope.IsVisible = true;
          } else {
            dpMessageBox.alert({
              ok: "Close",
              title: "Information.",
              message: "ไม่สามารถนำเข้าข้อมูลได้ : " + res.data,
            });
            $scope.ImportTruckLoad = {};
            $vm.triggerSearch();
            $scope.IsVisible = true;
          }
        });
      };

      function ImportTruckLoad(param) {
        let deferred = $q.defer();
        viewModel.postImport(param).then(
          function success(results) {
            deferred.resolve(results);
          },
          function error(response) {
            deferred.reject(response);
          }
        );
        return deferred.promise;
      }

      this.$onDestroy = function () {};

      $scope.$on("$destroy", function () {
        $vm.$onDestroy();
      });

      $(document).on("show.bs.modal", ".modal .helper", function (event) {
        var zIndex = 1040 + 10 * $(".modal:visible").length;
        $(this).css("z-index", zIndex);
        setTimeout(function () {
          $(".modal-backdrop")
            .not(".modal-stack")
            .css("z-index", zIndex - 1)
            .addClass("modal-stack");
        }, 0);
      });

      $scope.loadTruckRoute = function () {
        let body = { userId: localStorageService.get("userTokenStorage") };
        viewModel.getTruckRoute(body).then(
          function success(res) {
            if (res.data.statusCode == 200) {
              $scope.truckRouteData = res.data.truckRoutes;
              for (var i = 0; i < res.data.truckRouteGroups.length; i++) {
                $scope.truckGroupIds.push(
                  res.data.truckRouteGroups[i].truckRouteGroupId
                );
              }
            }
          },
          function error(err) {
            console.log("err", err);
          }
        );
      };

      $scope.changeTruckRoute = {
        onSelectionChanged: function () {
          // filter store
          if ($scope.truckRouteSelected.length == 0) {
            $scope.storeData = [];
            $scope.storeSelected = [];
          } else {
            $scope.truckIdList = [];
            $scope.truckRouteSelected.forEach((value, index) => {
              $scope.truckIdList.push(value.truckRoundId);
            });

            $scope.loadStore();
            pageLoading.hide();
          }
        },
      };

      $scope.loadStore = function () {
        let body = {
          TruckRouteIds: $scope.truckIdList,
          UserId: localStorageService.get("userTokenStorage"),
        };
        viewModel.getStoreByRoute(body).then(
          function success(res) {
            if (res.data.statusCode === "200") {
              $scope.storeData = res.data.result;
              $scope.selectDefaultAllStore();
            }

            pageLoading.hide();
          },
          function error(err) {}
        );
      };

      $scope.selectDefaultAllStore = function () {
        $scope.storeSelected = [];
        $scope.storeList = [];
        $scope.storeData.forEach((value) => {
          $scope.storeSelected.push(value);
        });
        $scope.storeSelected.forEach((value) => {
          $scope.storeList.push(value.storeNo);
        });
      };

      $scope.changeStoreRoute = {
        onSelectionChanged: function () {
          // filter store
          if ($scope.storeSelected.length == 0) {
            $scope.storeSelected = [];
          } else {
            $scope.storeList = [];
            $scope.storeSelected.forEach((value, index) => {
              $scope.storeList.push(value.storeNo);
            });
            // $scope.loadStatusCarton();
          }
        },
      };

      $scope.loadStatusCarton = function () {
        let body = {
          TruckRouteIds: $scope.truckIdList,
          StoreNos: $scope.storeList,
          UserId: localStorageService.get("userTokenStorage"),
        };
        viewModel.getCartonStatus(body).then(
          function success(res) {
            $vm.filterModel.chkinitpage = true;
            if (res.data.statusCode == "200") {
              $scope.filterModel.cartonStatusName =
                res.data.result[3].statusName;
              $scope.filterModel.cartonStatusId = res.data.result[3].statusId;
            }
          },
          function error(err) {}
        );
      };

      $scope.addCartonToTable = function () {
        $scope.checkAllCartonStatus = false;
        $vm.searchResultModel
          .filter((it) => it.selected == true)
          .forEach((value) => {
            // if($vm.searchResultModel[index].selected === true){
            value.selected = false;
            $vm.cartonSelected.push(value);
            // }
          });

        let filterCarton = $vm.searchResultModel.filter(
          (it) =>
            !$vm.cartonSelected.map((i) => i.cartonNo).includes(it.cartonNo)
        );
        $vm.searchResultModel = filterCarton;
      };

      $scope.deleteCartonFromTable = function () {
        $scope.checkAllAddCartonStatus = false;
        $vm.cartonSelected
          .filter((it) => it.selected == true)
          .forEach((element) => {
            let removeIndex = $vm.cartonSelected
              .map((item) => item.cartonNo)
              .indexOf(element.cartonNo);
            $vm.cartonSelected.splice(removeIndex, 1);
          });

        $scope.filterSearchHelper();
      };

      $scope.changeTableSize = function () {
        let ChangeTable = 1;
        if ($scope.invokes.page) {
          if ($scope.model.numPerPage == undefined) {
            $scope.model.numPerPage = $scope.pagging.perPage;
          }
          var p = {
            currentPage: ChangeTable,
            numPerPage: $scope.pagging.perPage,
          };
          $scope.invokes.page(p);
        }
      };

      $scope.changeTableSizeModal = function () {
        let ChangeTable = 1;

        $scope.filterSearchHelper();
        // console.log($scope.invokes);
        // if ($scope.invokes.page) {
        //     if ($scope.model.numPerPage == undefined) {
        //         $scope.model.numPerPage = $scope.pagging.perPage;
        //     }
        //     var p = {
        //         currentPage: ChangeTable,
        //         numPerPage: $scope.pagging.perPage
        //     };
        //     $scope.invokes.page(p);
        // }
      };

      $scope.saveHelper = function () {
        console.log($scope.truckRouteSelected);
        if (!$scope.filterModel.ownerId) {
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณาเลือก Owner",
          });
        }
        else if(!$scope.filterModel.deliveryDate){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณาเลือก Delivery Date",
          });
        } 
        else if(!$scope.filterModel.truckLoadDate){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณาเลือก Loading Date",
          });
        } 
        else if(!$scope.filterModel.c3PLId){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณาเลือก 3PL",
          });
        }
        else if(!$scope.filterModel.vechicleReg){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณากรอก Vehicle Registration",
          });
          document.getElementById("vechicleReg_input").focus();
        }
        else if(!$scope.filterModel.driver){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณากรอก Driver",
          });
          document.getElementById("driver_input").focus();
        }
        else if($scope.truckRouteSelected.length == 0){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณาเลือก Truck Route",
          });
        }
        else if(!$scope.filterModel.dockDoorId){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณาเลือก Dock Door",
          });
        }
        else if($vm.cartonSelected.length == 0){
          dpMessageBox.alert({
            ok: "Yes",
            title: "Error",
            message: "กรุณาเลือก Carton",
          });
        }
        else {
          let body = {
            userId: localStorageService.get("userTokenStorage"),
            ownerId: $scope.filterModel.ownerId,
            // ownerId: "CFM FC",
            deliveryDate: $scope.filterModel.deliveryDate,
            loadingDate: $scope.filterModel.truckLoadDate,
            truckLoadRound: $scope.filterModel.truckLoadRound,
            sender3PL: $scope.filterModel.c3PLId,
            vehicleReg: $scope.filterModel.vechicleReg,
            driver: $scope.filterModel.driver,
            dockDoor: $scope.filterModel.dockDoorId,
            reference: $scope.filterModel.reference,
            remark: $scope.filterModel.remark,
            // cartonNos: $vm.cartonSelected.map((it) => it.cartonNo),
            cartonStores: $vm.cartonSelected.map((obj) => ({
              cartonNo: obj.cartonNo,
              storeNo: obj.storeNo,
            })),
          };

          viewModel.saveLoadHelper(body).then(function success(res) {
            if (res.data.statusCode == "200") {
              $scope.clearSearch();
            }
            dpMessageBox.alert({
              ok: "Yes",
              title: res.data.statusCode == 200 ? "Success" : "Error",
              message: res.data.statusDesc,
            });
          });
        }
      };

      $scope.getStore = function () {
        let body = {};
        viewModel.getStore(body).then(function success(res) {
          if (res.data.statusCode == "200") {
            $vm.stores = res.data.result;
          }
        });
      };

      $scope.searchStore = function () {
        if($scope.actionPS == "1") {
          $vm.store.storeName = "";
        } else {
          $vm.store.storeNo = "";
        }
        let body = $vm.store;
        viewModel.getStore(body).then(function success(res) {
          if (res.data.statusCode == "200") {
            $vm.stores = res.data.result;
          }
        });
      }

      $scope.selectedStore = function (data) {
        console.log(data);
        $scope.filterModel.storeNo = data.storeNo;
        // $scope.filterModel.storeName = data.storeName;
      }

      $scope.loadDefaultOwner = function () {
        viewModel
          .getDefaultOwner(localStorageService.get("userTokenStorage"))
          .then(
            function success(res) {
              $scope.filterModel.ownerId = res.data.result[0].ownerID;
              $scope.filterModel.ownerIndex = res.data.result[0].ownerIndex;
              $scope.filterModel.ownerName = res.data.result[0].ownerName;
              $scope.filterModel.ownerNameTemp = res.data.result[0].ownerName;
            },
            function error(err) {
              $scope.filterModel.ownerId = "";
              $scope.filterModel.ownerIndex = "";
              $scope.filterModel.ownerName = "";
              $scope.filterModel.ownerNameTemp = "";
            }
          );
        pageLoading.hide();
      };


      this.$onInit = function () {
        //$vm.triggerSearch();
        $scope.filterModel = {};
        $scope.filterModel.truckLoadDateFrom = getToday();
        $scope.filterModel.truckLoadDateTo = getToday();
        $scope.filterModel.deliveryDateFrom = getToday();
        $scope.filterModel.deliveryDateTo = getToday();
        $scope.filterModel.deliveryDate = getToday();
        $scope.filterModel.truckLoadDate = getToday();
        $scope.filterModel.truckLoadRound = "1";

        $scope.loadDefaultOwner();
        $scope.loadTruckRoute();
        $scope.loadStatusCarton();

        $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
        $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
        $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
        $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
        
        $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
        $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
        $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
        $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
      };
    },
  });
})();
