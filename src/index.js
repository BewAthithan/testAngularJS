'use strict';

var app = angular.module('myApp', ['ui.router', 'ngAria', 'ngTouch', 'chart.js', 'LocalStorageModule', 'ngAnimate', 'ngLocale', 'ui.calendar', 'ui.bootstrap', 'angularMoment', 'ngFileUpload', 'ui.sortable', 'pascalprecht.translate', 'angularjs-dropdown-multiselect']);


app.run(['ngAuthSettings', '$window',
    function (ngAuthSettings, $window) {
        ngAuthSettings.WebClient = $window.location.origin;
        ngAuthSettings.ClientDirective = ngAuthSettings.WebClient + '/app/';

        // directory
        ngAuthSettings.directory.directive = ngAuthSettings.ClientDirective + 'widgets/';
        ngAuthSettings.directory.modules = ngAuthSettings.ClientDirective + 'modules/';
        ngAuthSettings.directory.assets = ngAuthSettings.ClientDirective + 'assets/';
        ngAuthSettings.directory.widgets = ngAuthSettings.ClientDirective + 'widgets/';
        ngAuthSettings.directory.theme = ngAuthSettings.ClientDirective + 'contents/ace-master/';

    }
]);

app.config(['$httpProvider', function ($httpProvider) {
    // Custome $http interceptors
    $httpProvider.interceptors.push('customHttpInterceptor');
}]);

app.controller('AppCtrl', ['$rootScope', '$scope', '$http', '$document', 'ngAuthSettings','pageLoading', 'userFactory', 'ownerFactory', 'warehouseFactory', 'localStorageService',
    function ($rootScope, $scope, $http, $document, $ngAuthSettings, pageLoading, userFactory, ownerFactory, warehouseFactory, localStorageService) {
        $rootScope.onProgress = false;

        pageLoading.show();

        var user;
        if(!localStorageService.get('ownerVariableName') && !localStorageService.get('ownerVariableId') && !localStorageService.get('ownerVariableIndex')
        && !localStorageService.get('warehouseVariableName') && !localStorageService.get('warehouseVariableId') && !localStorageService.get('warehouseVariableIndex')
        && localStorageService.get('userTokenStorage')) {
            userFactory.getDefaultUser().then(function success(res) {
                console.log("user deault", res.data.result);
                user = res.data.result;
                ownerFactory.getDefaultOwner().then(function success(res) {
                    console.log("owner deault", res.data);
                    for(var i = 0; i < res.data.length; i++) {
                        if(user.userClientID == res.data[i].ownerId) {
                            localStorageService.set('ownerVariableName', res.data[i].ownerName);
                            localStorageService.set('ownerVariableId', res.data[i].ownerId);
                            localStorageService.set('ownerVariableIndex', res.data[i].ownerIndex);
                            break;
                        }
                    }
                }, function error(response) {});
                warehouseFactory.getDefaultwarehouse().then(function success(res) {
                    console.log("warehouse default", res.data);
                    for(var i = 0; i < res.data.length; i++) {
                        if(user.userWarehouseID == res.data[i].warehouseId) {
                            localStorageService.set('warehouseVariableName', res.data[i].warehouseName);
                            localStorageService.set('warehouseVariableId', res.data[i].warehouseId);
                            localStorageService.set('warehouseVariableIndex', res.data[i].warehouseIndex);
                            break;
                        }
                    }
                }, function error(response) {});
                pageLoading.hide();
            }, function error(response) {});
        }
    }
]);

app.filter('html', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
})

app.directive('blurOnEnter', function () {
    return function (scope, elem, attrs) {
        elem.bind('keydown keypress', function (e) {
            if (e.which === 13) {
                e.preventDefault();
                elem.blur();
            }
        });
    }
});

app.directive('focusMe', function($timeout) {
    return {
        scope: { trigger: '@focusMe' },
        link: function(scope, element) {
        scope.$watch('trigger', function(value) {
            if(value === "true") { 
            $timeout(function() {
                element[0].focus(); 
            });
            }
        });
        }
    };
});


// app.provider('helloWorld', function () {
     
//     this.name = "";
//     this.$get = function () {
//         var name = this.name;
//         return {
//             sayHello: function () {
//                 return "Hello, " + name + " From provider()";
//             }
//         };
//     };
//     this.setName = function (name) {
//         this.name = name;
//     };
// })
// .config(function (helloWorldProvider) {
//     helloWorldProvider.setName("World");
// })
// .controller('someController', function (helloWorld) {
//     alert(helloWorld.sayHello());
// });

