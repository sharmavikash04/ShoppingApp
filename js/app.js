// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ionicShop.services', 'LocalStorageModule', 'ngMessages', 'ngAutocomplete'])

.run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})
.config(function ($httpProvider) {
    console.log('call provider');
    $httpProvider.interceptors.push('authInterceptorService');
})

.run(['authService', function (authService) {
    authService.fillAuthData();
}])

.constant('ngAuthSettings', {
    apiServiceBaseUri: 'http://localhost:57934/',
    // apiServiceBaseUri: 'https://parature.webfortis.com/WebMobile/',
    clientId: 'ngAuthApp'
})
.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl'
    })
  .state('app.signin', {
      url: "/signin",
      views: {
          'menuContent': {
              templateUrl: "templates/signin.html",
              controller: 'AppCtrl'
          }
      }
  })
         .state('app.gallery', {
             url: "/gallery",
             views: {
                 'menuContent': {
                     templateUrl: "templates/gallery.html",
                     controller: 'GalleryController'
                 }
             }
         })
          .state('app.orders', {
              url: "/orders",
              views: {
                  'ordersContent': {
                      templateUrl: "templates/orders.html",
                      controller: 'OrdersController'
                  }
              }
          })
          .state('app.cart', {
              url: "/cart",
              views: {
                  'menuContent': {
                      templateUrl: "templates/cart.html",
                      controller: 'CartController'
                  }
              }
          })
          .state('app.checkout', {
              url: "/checkout",
              views: {
                  'menuContent': {
                      templateUrl: "templates/checkout.html",
                      controller: 'CheckoutController'
                  }
              }
          })
   .state('app.category', {
       url: "/category/:type/:subtype",
       views: {
           'menuContent': {
               templateUrl: "templates/category.html",
               controller: 'CategoryController'
           }
       }
   })
   .state('app.timesheet', {
       url: "/timesheet",
       views: {
           'menuContent': {
               templateUrl: "templates/timesheet.html",
               controller: 'timeCntrl'
           }
       }
   })
          .state('app.timesheetforspecificdate', {
              url: "/timesheetforspecificdate",
              views: {
                  'menuContent': {
                      templateUrl: "templates/timesheetforspecificdate.html",
                      controller: 'timeforspecificCntrl'
                  }
              }
          })
          .state('app.getproject', {
              url: "/getproject/:type",
              views: {
                  'menuContent': {
                      templateUrl: "templates/getproject.html",
                      controller: 'timeforspecificCntrl'
                  }
              }
          })
          .state('app.tasktype', {
              url: "/tasktype",
              views: {
                  'menuContent': {
                      templateUrl: "templates/tasktype.html",
                      controller: 'timeforspecificCntrl'
                  }
              }
          })
           .state('app.expenses', {
               url: "/expenses",
               views: {
                   'menuContent': {
                       templateUrl: "templates/expenses.html",
                       controller: 'expensesCntrl'

                   }
               }
           })
           .state('app.expenseform', {
               url: "/expenseform",
               views: {
                   'menuContent': {
                       templateUrl: "templates/expenseform.html",
                       controller: 'expensesCntrl'

                   }
               }
           })
      .state('app.expensecategory', {
          url: "/expensecategory",
          views: {
              'menuContent': {
                  templateUrl: "templates/expensecategory.html",
                  controller: 'expensesCntrl'

              }
          }
      })
        .state('app.travelrequest', {
            url: "/travelrequest",
            views: {
                'menuContent': {
                    templateUrl: "templates/travelrequest.html",
                    controller: 'requestCntrl'
                }
            }
        })
       .state('app.travelrequestform', {
           url: "/travelrequestform",
           views: {
               'menuContent': {
                   templateUrl: "templates/travelrequestform.html",
                   controller: 'requestCntrl'
               }
           }
       })

      .state('app.invoice', {
          url: "/invoice",
          views: {
              'menuContent': {
                  templateUrl: "templates/invoice.html"
              }
          }
      })
  .state('app.teamstatus', {
      url: "/teamstatus",
      views: {
          'menuContent': {
              templateUrl: "templates/teamstatus.html"
          }
      }
  })
      .state('app.leave', {
          url: "/leave",
          views: {
              'menuContent': {
                  templateUrl: "templates/leave.html", controller: 'leaveCntrl'
              }
          }
      })
        .state('app.leavepage', {
            url: "/leavepage",
            views: {
                'menuContent': {
                    templateUrl: "templates/leavepage.html",
                    controller: 'leaveCntrl'
                }
            }
        })
          .state('app.findanemployee', {
              url: "/findanemployee",
              views: {
                  'menuContent': {
                      templateUrl: "templates/findanemployee.html",
                      controller: 'FindanEmployee'
                  }
              }
          })
         .state('app.home', {
             url: "/home",
             views: {
                 'menuContent': {
                     templateUrl: "templates/home.html",
                     controller: 'AppCtrl'
                 }
             }
         })
    //Page for Customer
     .state('app.myproject', {
         url: "/myproject",
         views: {
             'menuContent': {
                 templateUrl: "templates/myproject.html",
                 //controller: 'leaveCntrl'
             }
         }
     })
     .state('app.myprojectpreferences', {
         url: "/myprojectpreferences",
         views: {
             'menuContent': {
                 templateUrl: "templates/myprojectpreferences.html",
                 //controller: 'leaveCntrl'
             }
         }
     })
     .state('app.mypreferences', {
         url: "/mypreferences",
         views: {
             'menuContent': {
                 templateUrl: "templates/mypreferences.html",
                 //controller: 'leaveCntrl'
             }
         }
     })
     .state('app.profile', {
         url: "/profile",
         views: {
             'menuContent': {
                 templateUrl: "templates/profile.html",
                 //controller: 'leaveCntrl'
             }
         }
     })
    .state('app.upcomingevent', {
        url: "/upcomingevent",
        views: {
            'menuContent': {
                templateUrl: "templates/upcomingevent.html",
                //controller: 'leaveCntrl'
            }
        }
    })
    .state('app.ourpromise', {
        url: "/ourpromise",
        views: {
            'menuContent': {
                templateUrl: "templates/ourpromise.html",
                //controller: 'leaveCntrl'
            }
        }
    })
        .state('app.signup', {
            url: "/signup",
            views: {
                'menuContent': {
                    templateUrl: "templates/signup.html",
                    controller: 'CustomerRegistration'
                }
            }
        })
    .state('app.location', {
        url: "/location",
        views: {
            'menuContent': {
                templateUrl: "templates/PicLocation.html",
                controller: 'CustomerRegistration'
            }
        }
    })
    
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/signup');
});
