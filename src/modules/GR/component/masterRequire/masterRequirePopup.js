
(function () {
    'use strict'
    app.directive('masterRequirePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/component/masterRequire/masterRequirePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                       
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.masterRequire = {};
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            masterRequireId: ''
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
                        $scope.delegates.masterRequirePopup = function (param, index, masterRequire) {
                            
                            $scope.masterRequire = $scope.masterRequire || {};
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.productyear = masterRequire.productyear;
                            $scope.productmonth = masterRequire.productmonth;
                            $scope.productday = masterRequire.productday;
                            $scope.isExpDate = masterRequire.isExpDate;
                            $scope.isMfgDate = masterRequire.isMfgDate;
                            $scope.isLot = masterRequire.isLot;
                            $scope.documentTypeIndex = masterRequire.documentTypeIndex;
                            $scope.isCatchWeight = masterRequire.isCatchWeight;
                            
                            $scope.checkValidate = masterRequire.checkValidate;
                            $scope.checkAuth = masterRequire.checkAuth;
                            $scope.userGroupName = localStorage.getItem('userGroupName');
                            
                            if(masterRequire.results) {
                                if (masterRequire.results.statusCode == 411) {
                                    $scope.masterRequire.overrideBtn = true;
                                    $scope.masterRequire.expiryDate = masterRequire.results.result.expiryDate;
                                    $scope.masterRequire.mlor = masterRequire.results.result.mlor;
                                    $scope.masterRequire.mlorValidation = masterRequire.results.result.mlorValidation;
                                } else if (masterRequire.results.statusCode == 412) {
                                    $scope.masterRequire.checkAuth = true;
                                    $scope.masterRequire.overrideBtn = true;

                                    $scope.masterRequire.expiryDate = masterRequire.results.result.expiryDate;
                                    $scope.masterRequire.mlor = masterRequire.results.result.mlor;
                                    $scope.masterRequire.mlorValidation = masterRequire.results.result.mlorValidation;
                                } else if (masterRequire.results.statusCode == 200 || masterRequire.results.statusCode == 201) {
                                    $scope.masterRequire = {};
                                    $scope.onShow = false;
                                }
                            }
                        
                        }


                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();                            
                        }
                        $scope.datalist = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.numPerPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    
                                    $scope.masterRequire = $scope.masterRequire || {};
                                    $scope.masterRequire.currentPage = param.currentPage;
                                    $scope.masterRequire.numPerPage = param.numPerPage;
                                    $scope.search($scope.masterRequire).then(function success(res) {
                                          
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data, res.data.pagination);
                                    }, function error(res) { });
                                },
                                delete: function (param) {
                                    if ($scope.invokes.delete != undefined)
                                        $scope.invokes.delete(param);
                                },
                                edit: function (param) {
                                    if ($scope.invokes.edit != undefined)
                                        $scope.invokes.edit(param);
                                },
                                selected: function (param) {}

                                
                            }
                        };

                        $scope.selected = function () {

                            if($scope.masterRequire.overrideBtn == true) {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: 'Override',
                                    message: 'Do you want to override ?'
                                }).then(function success() {
                                    if ($scope.invokes.selected != undefined ) {
                                        $scope.invokes.selected($scope.masterRequire);                     
                                    }
                                }, function error(res) {});
                            } else {
                                if ($scope.invokes.selected != undefined ) {
                                    $scope.invokes.selected($scope.masterRequire);                    
                                }
                            }

                        }

                        $scope.$watch('masterRequire.MfgDate', function(newData, oldData) {
                            // console.log(newData, oldData);
                            if($scope.masterRequire) {
                                $scope.masterRequire.overrideBtn = false;
                                $scope.masterRequire.checkAuth = false;
                            }                            
                        });
                        $scope.$watch('masterRequire.ExpDate', function(newData, oldData) {
                            // console.log(newData, oldData);
                            if($scope.masterRequire) {
                                $scope.masterRequire.overrideBtn = false;
                                $scope.masterRequire.checkAuth = false;
                            }                            
                        });


                        function getExpDate() {
                            
                            var date = moment();
                            var today = date.toDate();

                            var mm = today.getMonth() + 1;
                            var yyyy = today.getUTCFullYear() + 10;
                            var dd = today.getDate();

                            if (dd < 10) dd = '0' + dd;
                            if (mm < 10) mm = '0' + mm;

                            return yyyy.toString() + mm.toString() + dd.toString();
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


                        var init = function () {

                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };

                        init();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
