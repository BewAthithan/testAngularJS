app.directive("dirHeader", function (ngAuthSettings, $translate, ngLangauge) {
    return {
        restrict: 'E',
        scope: { toolbar: '=', user: '@' },
        controller: function ($scope, $timeout, $state/*, authService*/, dpMessageBox, commonService, pageLoading, localStorageService, userFactory, $window) {
            $scope.langSelected = {};
            $scope.langItems = ngLangauge;
            $scope.langSelected[0] = true;
            var loading = pageLoading;
            var messageBox = dpMessageBox;

            $scope.client = localStorageService.get('ownerVariableName');
            $scope.warehouse = localStorageService.get('warehouseVariableName');

            $scope.$watch(function(){
                return localStorageService.get('ownerVariableName');
            }, function(newCodes, oldCodes){
                $scope.client = localStorageService.get('ownerVariableName');
            });
            $scope.$watch(function(){
                return localStorageService.get('warehouseVariableName');
            }, function(newCodes, oldCodes){
                $scope.warehouse = localStorageService.get('warehouseVariableName');
            });

            var viewModel = userFactory;
            let Username = viewModel.getParam();
            if (Username != undefined) {
                $scope.data = Username;
                $scope.userGroupName = $window.localStorage['userGroupName'];
            }
            // var userInfo = authService.token();
            // if (userInfo == null) {
            //     authService.logOut();
            //     $state.go('login');
            //     userInfo = {};
            //     userInfo.name = '-';
            // }
            // else if (xString.IsNullOrEmpty(userInfo.token)) {
            //     authService.logOut();
            //     $state.go('login');
            //     userInfo = {};
            //     userInfo.name = '-';
            // }
            // else {
            //     // authService.profile().then(function (profile) {
            //     // }, function error(erg) {
            //     // });
            // };

            // $scope.name = userInfo.name;


            $scope.toggleHtml = function () {


                // if ($window.localStorage['isReload'] == 1) {

                //     $window.localStorage['isReload'] = 0;
                //     // $window.location.reload();
                //     $state.reload();
                // }

                $('html').toggleClass('sidebar-left-opened');
                //$('html').toggleClass('sidebar-left-opened');
            };


            $scope.logOut = function () {
                messageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: "Infomation !!!",
                    message: 'Do you want to Logout ?'
                }).then(function ok() {
                    loading.show();
                    viewModel.reset();
                    $timeout(function () {
                        // authService.logOut();
                        loading.hide();
                        $state.go('login');
                        // windows.reload();
                    }, 1000);
                });
            };

            $scope.changLang = function (index) {

                var lang = $scope.langItems[index].lang;
                for (var prop in $scope.langItems) {
                    $scope.langSelected[prop] = false;
                }
                $scope.langSelected[index] = true;
                $translate.use(lang);
            }

        },
        controllerAs: 'headerCtrl',
        templateUrl: "modules/widgets/dirHeader/dirHeader.html",
    }
});