
(function () {
    'use strict'
    app.directive('importPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/LoadToTruck/component/importPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService','dpMessageBox', '$timeout', '$translate', 'localStorageService', '$interval', 'loadTruckFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService,dpMessageBox, $timeout, $translate, localStorageService, $interval, loadTruckFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = loadTruckFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            // $state.reload();
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 30,
                            totalRow: 0,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            if ($scope.model.advanceSearch)
                                $scope.filter();
                            else
                                $scope.find();
                        }
                        $scope.delegates.importPopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            //$scope.findimport();
                        }
                        $scope.listImportRound = ["1", "2", "3"];
                        

                        // -----------------SET DAY default-----------------//
                        function getToday() {
                            var today = new Date();

                            var mm = today.getMonth() + 1;
                            var yyyy = today.getUTCFullYear();
                            var dd = today.getDate();


                            if (dd < 10) dd = '0' + dd;
                            if (mm < 10) mm = '0' + mm;

                            return yyyy.toString() + mm.toString() + dd.toString();
                        }

                        function convertDate(convertdate) {
                                var yyyy = convertdate.substring(0,4);
                                var mm = convertdate.substring(4,6);
                                var dd = convertdate.substring(6,8);

                            return dd.toString() + '-' + mm.toString() + '-' + yyyy.toString();
                           
                        }
                        
                        

                        $scope.SelectFile = function (file) {
                            $scope.SelectedFile = file;
                        };
                        $scope.Upload = function (file,param) {
                            $scope.SelectedFile = file;
                            var importRound = param.importRound;
                            var truckLoadDateFrom = convertDate(param.truckLoadDateFrom);
                            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.xls|.xlsx)$/;
                            if (regex.test($scope.SelectedFile.name.toLowerCase())) {
                                if (typeof (FileReader) != "undefined") {
                                    var reader = new FileReader();
                                    //For Browsers other than IE.
                                    if (reader.readAsBinaryString) {
                                        reader.onload = function (e) {
                                            $scope.ProcessExcel(e.target.result,importRound,truckLoadDateFrom);
                                        };
                                        reader.readAsBinaryString($scope.SelectedFile);
                                    } else {
                                        //For IE Browser.
                                        reader.onload = function (e) {
                                            var data = "";
                                            var bytes = new Uint8Array(e.target.result,truckLoadDateFrom);
                                            for (var i = 0; i < bytes.byteLength; i++) {
                                                data += String.fromCharCode(bytes[i]);
                                            }
                                            $scope.ProcessExcel(data,importRound);
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

                        $scope.ProcessExcel = function (data,importRound,truckLoadDateFrom) {
                            //Read the Excel File data.
                            var workbook = XLSX.read(data, {
                                type: 'binary'
                            });

                            //Fetch the name of First Sheet.
                            var firstSheet = workbook.SheetNames[0];

                            //Read all rows from First Sheet into an JSON array.
                            var excelRows = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[firstSheet]);
                            if (excelRows.length > 0) {
                                var Activity = [];
                                var IsEqualDate = 0;
                                for (var i = 0; i <= excelRows.length - 1; i++) {
                                    let newItem = {};

                                    // newItem.importRound = 1;
                                    // newItem.no = excelRows[i].No;
                                    // newItem.truckLoadIndex = excelRows[i].TruckLoadDate;
                                    if (excelRows[i].TruckLoadDate != truckLoadDateFrom) { 
                                        dpMessageBox.alert({
                                            ok:'Close',
                                            title: 'Information.',
                                            message: "วันที่ Loading Date ไม่ตรงกับเอกสารที่นำเข้า"
                                        })
                                        IsEqualDate = 1;
                                        break; 
                                    } else if(excelRows[i].TruckNo == undefined){
                                        dpMessageBox.alert({
                                            ok:'Close',
                                            title: 'Information.',
                                            message: "ไม่พบ TruckNo เอกสารนำเข้าบรรทัดที่ " + (parseInt([i]) + 1)
                                        })
                                        IsEqualDate = 1;
                                        break; 
                                    } else {
                                        newItem.ImportRound = importRound;
                                        newItem.No = excelRows[i].No;
                                        newItem.TruckLoadDate = excelRows[i].TruckLoadDate;
                                        newItem.Round = excelRows[i].Round;
                                        newItem.Route = excelRows[i].Route;
                                        newItem.MDS_route = excelRows[i].MDS_route;
                                        newItem.TruckNo = excelRows[i].TruckNo;
                                        newItem.Driver = excelRows[i].Driver;
                                        newItem.VehicleRegister = excelRows[i].VehicleRegister;
                                        newItem.Order_number = excelRows[i].Order_number;
                                        newItem.Customer_Name = excelRows[i].Customer_Name;
                                        newItem.Tel = excelRows[i].Tel;
                                        newItem.Customer_Address = excelRows[i].Customer_Address;
                                        newItem.Price = excelRows[i].Price;
                                        newItem.Basket = excelRows[i].Basket;
                                        newItem.Dry = excelRows[i].Dry;
                                        newItem.Bulk = excelRows[i].Bulk;
                                        newItem.Fresh = excelRows[i].Fresh;
                                        newItem.Frozen = excelRows[i].Frozen;
                                        newItem.Processed = excelRows[i].Processed;
                                        newItem.Remark = excelRows[i].Remark;

                                        Activity.push(newItem);
                                    }
                                    
                                }
                                
                            }
                            // if (Activity) {
                            //     param = Activity;
                            // }
                            //Display the data from Excel file in Table.
                            $scope.$apply(function () {
                                //$scope.ImportTruckLoad = excelRows;
                                if (IsEqualDate == 0)
                                {
                                    $scope.ImportTruckLoad = Activity;
                                
                                    // viewModel.postImport(param).then(function (res) {
                                    // });
                                    // var a = excelRows;
                                    // import(a)
                                    // 
                                    
                                    $scope.IsVisible = true;
                                    $scope.import($scope.ImportTruckLoad);
                                }
                                
                            });
                        };



                        $scope.import = function (param) {
                            
                            viewModel.postImport(param).then(function (res) {
                                if(res.data == "S"){  
                                    $scope.ImportTruckLoad = {};
                                    $scope.IsVisible = true;
                                    $scope.invokes.selected();
                                    $scope.onShow = false;                                    
                                }
                                else{

                                    var arrayResult = res.data.split(',');

                                    dpMessageBox.alert({
                                        ok:'Close',
                                        title: 'Information.',
                                        //message: "ไม่สามารถนำเข้าข้อมูลได้ : " + res.data
                                        messageNewLine: arrayResult
                                    });
                                    $scope.ImportTruckLoad = {};
                                    
                                    $scope.IsVisible = true;
                                    // location.reload();
                                    // $scope.onClose();
                                }
                            });
                            // $state.reload();
                        }

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

                        var init = function () {
                            $scope.filterModel = {};
                            $scope.filterModel.truckLoadDateFrom = getToday();
                            $scope.filterModel.importRound = '1';
                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };


                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
