﻿'use strict';
angular.module('starter.services', [])

.factory('authService', ['$http', '$q', 'localStorageService', 'ngAuthSettings', '$window', function ($http, $q, localStorageService, ngAuthSettings, $window) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;
    var authServiceFactory = {};

    var _authentication = {
        isAuth: false,
        userName: "",
        userId: "",
        useRefreshTokens: false,
        isCustomer: false,
    };

    var _login = function (loginData) {
        console.log(loginData);
        _logOut();
        var deferred = $q.defer();
        $http.post(serviceBase + 'api/audience', loginData).success(function (response) {
            //console.log(response);
            if (loginData.useRefreshTokens) {
                localStorageService.set('AudienceData', { ClientId: response.ClientId, userName: loginData.Username, password: loginData.Password, refreshToken: response.refresh_token, useRefreshTokens: true });
            }
            else {
                localStorageService.set('AudienceData', { ClientId: response.ClientId, userName: loginData.Username, password: loginData.Password, useRefreshTokens: false });
            }
            if (loginData.loginType == "Customer") {
                _authentication.isCustomer = true;
            }
            _authentication.isAuth = true;
            _authentication.userName = loginData.Username;
            _authentication.useRefreshTokens = false;
            _authentication.userId = response.Userid;
            localStorageService.set('LoggedUser', _authentication);
            deferred.resolve(response);

        }).error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };
    var _gettoken = function () {
        var authData = localStorageService.get('AudienceData');
        var admin = { userName: "akothari@webfortis.com", password: "wfp@ssw0rd" };
        //var admin = { userName: "akothari@crmlrn1.onmicrosoft.com", password: "am@n4192" };
        if (authData) {
            if (authData.ClientId) {
                var deferred = $q.defer();
                var data = "grant_type=password&username=" + admin.userName + "&password=" + admin.password + "&client_id=" + authData.ClientId;
                localStorageService.remove('Token');
                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                    localStorageService.set('Token', { access_token: response.access_token, username: response.username, useRefreshTokens: true });
                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    $window.location.reload();
                    deferred.reject(err);

                });
            }
        }
        return deferred.promise;

    }
    var _logOut = function () {
        localStorageService.clearAll();
        _authentication.isAuth = false;
        _authentication.isCustomer = false;
        _authentication.userName = "";
        _authentication.useRefreshTokens = false;
        localStorageService.set('LoggedUser', _authentication);
    };

    var _fillAuthData = function () {

        var authData = localStorageService.get('AudienceData');
        if (authData) {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
            _authentication.useRefreshTokens = authData.useRefreshTokens;
        }

    };

    var _refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('AudienceData');
        console.log('AudienceData');
        console.log(authData);
        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + authData.ClientId;

                localStorageService.remove('AudienceData');

                $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('AudienceData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });

                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };



    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
    authServiceFactory.refreshToken = _refreshToken;
    authServiceFactory.gettoken = _gettoken;
    return authServiceFactory;
}])

.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', '$window', function ($q, $injector, $location, localStorageService, $window) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};

        var authData = localStorageService.get('Token');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.access_token;
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('authService');
            var authData = localStorageService.get('AudienceData');
            if (authData) {
                if (authData.useRefreshTokens) {
                    authService.gettoken().then(function (tokenresponse) {
                        $window.location.href = ('#/app/home');
                    })

                    return $q.reject(rejection);
                }
            }
            else {
                authService.logOut();
                $location.path('#/app/signin');
            }

        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}])

.factory('TimesheetService', function ($q, $http, ngAuthSettings) {
    var TimesheetServiceFactory = {};
    var url = ngAuthSettings.apiServiceBaseUri;
    var _GetProject = function (type) {
        //console.log('Service calling');
        var deferred = $q.defer();
        $http.get(url + 'api/project').success(function (results) {
            //console.log('Successfully Get Timesheet Project Data');
            deferred.resolve(results);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var _GetTaskType = function () {
        //console.log('Service calling');
        var deferred = $q.defer();
        $http.get(url + 'api/tasktype').success(function (results) {
            //console.log('Successfully Get Timesheet TaskType Data');
            deferred.resolve(results);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    }


    var _Savetimesheet = function (input) {

        //console.log('Service calling');
        var deferred = $q.defer();
        $http.post(url + 'api/timesheet', input).success(function (results) {
            //console.log('Successfully save data');
            deferred.resolve(results);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var _GettaskforSpecificDate = function (input) {
        //console.log('Service calling');
        var deferred = $q.defer();
        $http.get(url + 'api/timesheet?systemuserid=' + input.userid + '&date=' + input.date).success(function (results) {
            //console.log('Successfully Get task for Specific Date');
            deferred.resolve(results);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    TimesheetServiceFactory.GetProject = _GetProject;
    TimesheetServiceFactory.GetTaskType = _GetTaskType;
    TimesheetServiceFactory.Savetimesheet = _Savetimesheet;
    TimesheetServiceFactory.GettaskforSpecificDatemesheet = _GettaskforSpecificDate;
    return TimesheetServiceFactory;
})



.factory('notification', function ($rootScope, $ionicLoading, $window) {
    $rootScope.show = function (text) {
        $rootScope.loading = $ionicLoading.show({
            template: text ? text : "Loading..",
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
    };

    $rootScope.hide = function () {
        $ionicLoading.hide();
    };


    $rootScope.notify = function (text) {
        $rootScope.show(text);
        $window.setTimeout(function () {
            $rootScope.hide();
        }, 1999);
    };

    return {

    }

})

.factory('TravelrequestService', function ($q, $http, ngAuthSettings) {
    var TravelrequestServiceFactory = {};
    var url = ngAuthSettings.apiServiceBaseUri;
    //get cities using adgeo free service
    var _getcities = function (change) {
        var deferred = $q.defer();
        var url = 'http://gd.geobytes.com/AutoCompleteCity?callback&q=';
        $http.get(url + change).success(function (result) {
            //console.log('get cities');
            deferred.resolve(result);
        }).error(function (data, status, headers, config) {
            // this isn't happening:
            console.log("saved comment", data);
            return data;
        });
        return deferred.promise;
    }


    var _Alltravelrequest = function (input) {
        var deferred = $q.defer();
        $http.get(url + 'api/travel?systemuserid=' + input.userid).success(function (out) {
            //console.log('call api/requestooo api');
            deferred.resolve(out);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var _Posttravelrequest = function (data) {
        var deferred = $q.defer();
        $http.post(url + 'api/travel', data).success(function (out) {
            //console.log('post travel request');
            //console.log(out);
            deferred.resolve(out);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    }
    TravelrequestServiceFactory.getcities = _getcities;
    TravelrequestServiceFactory.AlltravelRequest = _Alltravelrequest;
    TravelrequestServiceFactory.Posttravelrequest = _Posttravelrequest;
    return TravelrequestServiceFactory;
})

.factory('LeaveService', function ($q, $http, ngAuthSettings) {
    var LeaveServiceFactory = {};
    var url = ngAuthSettings.apiServiceBaseUri;

    var _Allleaverequest = function (input) {
        var deferred = $q.defer();
        $http.get(url + 'api/requestooo?systemuserid=' + input.userid).success(function (out) {
            //console.log('call api/travelrequest api');
            deferred.resolve(out);
        }).error(function (err, status) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    var _Postleave = function (data) {
        var deffred = $q.defer();
        $http.post(url + 'api/requestooo', data).success(function (out) {
            //console.log('post travel request');
            //console.log(out);
            deffred.resolve(out);
        }).error(function (err, status) {
            deffred.reject(err);
        });
        return deffred.promise;
    }
    LeaveServiceFactory.Allleaverequest = _Allleaverequest;
    LeaveServiceFactory.Postleave = _Postleave;
    return LeaveServiceFactory;
})




.factory('getsetServiceForExpense', function ($rootScope) {
    var tempdata = {};
    var data = {};
    return data = {
        GetExpensedata: function () {
            return tempdata;
        },
        SetExpensedate: function (input) {
            tempdata.Date = input;
        },
        SetExpenseproject: function (input) {
            tempdata.ProjectName = input;
        },
        SetExpenseCategory: function (input) {
            tempdata.CategoryName = input;
        },
        reset: function () {
            tempdata = {};
        }
    };

})

.factory('CategoryService', function ($q, $http, ngAuthSettings) {
    var CategoryServiceFactory = {};
    var url = ngAuthSettings.apiServiceBaseUri;
    var _Getcategory = function () {
        //console.log('Service calling');
        var deferred = $q.defer();
        $http.get(url + 'api/Categorys').success(function (results) {
            //console.log('Successfully Get Expense Categorys Data');
            deferred.resolve(results);
        }).error(function (data, status, headers, config) {
            // this isn't happening:
            console.log("saved comment", data);
            return data;
        });
        return deferred.promise;
    }

    var _ExpensePost = function (input) {
        //console.log('_ExpensePost calling');
        var deferred = $q.defer();
        $http.post(url + 'api/Expenses', input).success(function (results) {
            //console.log('Successfully post Expense Data');
            deferred.resolve(results);
        }).error(function (data, status, headers, config) {
            // this isn't happening:
            console.log("saved comment", data);
            return data;
        });
        return deferred.promise;
    }

    var _GetExpense = function (input) {
        //console.log('_ExpensePost calling');
        var deferred = $q.defer();
        $http.get(url + 'api/Expenses').success(function (results) {
            //console.log('Successfully Get Expense Data');
            deferred.resolve(results);
        }).error(function (data, status, headers, config) {
            // this isn't happening:
            //console.log("saved comment", data);
            return data;
        });
        return deferred.promise;
    }
    CategoryServiceFactory.Getcategory = _Getcategory;
    CategoryServiceFactory.ExpensePost = _ExpensePost;
    CategoryServiceFactory.GetExpense = _GetExpense;
    return CategoryServiceFactory;
})

.factory('FindanEmployeeService', function ($q, $http, ngAuthSettings) {
    var FindanEmployeeFactory = {};
    var url = ngAuthSettings.apiServiceBaseUri;

    var _Allemployee = function () {
        var deferred = $q.defer();
        $http.get(url + 'api/findemployee').success(function (out) {
            //console.log('call api/travelrequest api');
            deferred.resolve(out);
        }).error(function (data, status, headers, config) {
            // this isn't happening:
            console.log("saved comment", data);
            return data;
        });
        return deferred.promise;
    }

    var _singleemployee = function (data) {
        var deffred = $q.defer();
        $http.get(url + 'api/findemployee?SystemUserid=' + data).success(function (out) {
            //console.log('post travel request');
            //console.log(out);
            deffred.resolve(out);
        }).error(function (data, status, headers, config) {
            // this isn't happening:
            console.log("saved comment", data);
            return data;
        });
        return deffred.promise;
    }
    FindanEmployeeFactory.Allemployee = _Allemployee;
    FindanEmployeeFactory.Singleemployee = _singleemployee;
    return FindanEmployeeFactory;
})