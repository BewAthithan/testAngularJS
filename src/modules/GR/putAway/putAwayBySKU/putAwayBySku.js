app.component("putawayBySku", {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/putAway/putAwayBySKU/putAwayBySku.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        config: '=',
        isItem: "=?",
    },
   
    controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, dpMessageBox, putAwayFactory) {
        var $vm = this;
        var viewModel = putAwayFactory;
        $vm.$onInit = function () {
            
        }

        $scope.isFilter = true;
        // $scope.filterModel = {
        //     currentPage: 0,
        //     numPerPage: 30,
        //     totalRow: 0,
        //     key: '',
        //     advanceSearch: false,
        //     showError: false,
        //     type: 1,
        // };

        $scope.triggerSearch = function(lpn,chkputaway)
        {            
            var model = {tagNo:lpn,chk:chkputaway};
       
            $scope.ScanSku(model);
        };
         
      

        $scope.$watch("callSearch", function () {
            if ($scope.callSearch) {
                $scope.callSearch();
            }
        });

        $scope.ScanSku = function (model) {
            var deferred = $q.defer();
            if ($scope.putAwaySku != null) {
                $scope.putAwaySku = {}
            }
            pageLoading.show();          
            
            viewModel.CheckTAGPutAwayBySku(model).then(
                function success(res) {
                    pageLoading.hide();                                                     
                    var ProductDetail = res.data.filter(function (element) {
                        return element.tagStatus == 1;
                    });       
                    var ReceiveProduct = res.data.filter(function (element) {
                        return element.tagStatus == 2;
                    });             
                    $scope.filterModel = ProductDetail; 
                    $scope.searchResultModel = ReceiveProduct;  
                    
                    if (res.data.length != 0) {
                        let item = res.data;
                        for (var i = 0; i <= item.length - 1; i++) {
                            if (item[i].qty != null || item[i].qty != undefined) {
                                $scope.putAwaySku.tagNo = item[i].tagNo;
                                $scope.putAwaySku.tagNoTemp = $scope.putAwaySku.tagNo;
                            }
                        };
                    }
                    // if(ReceiveProduct.length != 0)
                    // {   
                    //     dpMessageBox.alert({
                    //         ok: 'Close',
                    //         title: 'Information.',
                    //         message: "LPN : " + model.tagNo + " มีการ Putaway ไปแล้ว"
                    //     })

                    // }
                    else if(res.data.length == 0 && model.chk == true)
                    {
                        
                        $scope.putAwaySku = {};
                        return "";
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "LPN : " + model.tagNo + " not found !!"
                        })
                    };
                    deferred.resolve(res);
                    
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="putAwaySku.locationName"]');
                        focusElem[0].focus();

                    }, 200);
                },
                function error(response) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "LPN No Incorrect "
                    })
                    deferred.reject(response);
                });


            return deferred.promise;
        }

       
    }
});