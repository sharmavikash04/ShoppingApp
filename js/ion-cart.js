﻿(function (angular) {
    //Service Module for ionic-shop
    var app = angular.module('ionicShop.services', ['ionic']);
    //PRODUCT SERVICE HOLDING ALL ITEMS
    app.service('Products', ['$http', function ($http) {

        //this.departments = [];
        this.galleryProducts = [];
        this.cartProducts = [];
        this.warehousefiltereddepartment = [];
        this.warehousefilter = [];
        this.checkout = {};
        this.ItemCount = 0;
        //$scope.Stores = [];

        ////This is for SubCategory
        this.getDepartmentById = function (deptid, warehouseid) {
            console.log("getdertmentbyid is loading");
            console.log(deptid);
            //console.log(this.warehousefiltereddepartment);
            //this.warehousedepartments = this.warehousefiltereddepartment;
            //this.warehousedepartments = this.getDepartments(warehouseid);

            //console.log(this.warehousedepartments);
            //this.filterditems = _.filter(this.warehousedepartments, function (department) {
            //    console.log(department);
            //    return department.id == deptid;

            //});
            //return this.filterditems;
            

            return $http.get("http://103.231.44.202:808/api/CategoryJson").then(function (results) {
           //return $http.get("http://localhost:26264/api/CategoryJson").then(function (results) {
                this.departments = results.data;

                this.warehousefiltereddepartment = _.filter(this.departments, function (department) {

                    return department.Warehouseid == warehouseid;

                });
                this.filterditems = _.filter(this.warehousefiltereddepartment, function (department) {
                    console.log(department);
                    return department.Categoryid == deptid;

                });
                return this.filterditems;

            })
        }

        this.getSubcategoryNamefromId = function (id) {
            console.log("In getSubcategoryNamefromId" + id);
            this.warehousedepartments = this.getDepartments(6);
            //if (this.departments.length <= 0)
            //{
            //    this.getDepartments(6);
            //}
            this.aislename = '';
            this.filterditems = this.warehousedepartments.every(function (department) {


                console.log(department);

                this.Aisle = _.filter(department.aisles, function (aisle) {

                    return aisle.id == id;

                });

                console.log(this.Aisle);
                if (this.Aisle) {
                    this.aislename = this.Aisle;
                    return this.Aisle;

                }

            });
            console.log(this.aislename)
            return this.aislename;
            //this.filterditems = _.filter(this.warehousedepartments, function (department) {
            //    console.log(department);
            //    if (department.aisles) {
            //        this.Aisle = _.filter(department.aisles, function (aisle) {

            //            return aisle.id == id;

            //        });
            //    }
            //    console.log(this.Aisle);
            //    if (this.Aisle)
            //    {
            //        return this.Aisle;

            //    }
            //});
            //console.log(this.filterditems);
            //return this.filterditems.name;

        }
        this.getItemsBySubCategory = function (id) {
            console.log(this.galleryProducts);
            if (this.galleryProducts.length <= 0) {
                this.getProducts();
            }
            this.filterditems = _.filter(this.galleryProducts, function (product) {
                return product.aisle_id == id;
            });
            console.log("Get filtered Items");
            console.log(id);
            console.log(this.filterditems);
            return this.filterditems;
        }
        this.getItemsByCategory = function (id) {
            this.filterditems = _.filter(this.galleryProducts, function (product) {
                return product.department_id == id;
            });
            return this.filterditems;
        }

        //this.getdepartment_id = function(id) {

        //    this.filterditems = _.filter(this.departments, function (departments ) {

        //        return this.departments.department_id == id;

        //        this.getaisles = function (id) {
        //            this.filterditems = _.filter(this.department_id, function (departments ) {
        //                return this.aisles.name;
        //            });
        //            return this.filterditems;
        //        };
        //        return this.filterditems;
        //    });

        this.getaisles_name = function (id) {

            this.filterditems = _.filter(this.departments, function (departments) {
                return this.departments.department_id.aisles.name == id;
                console.log("didiiiii");
                console.log(department_id);
            });
            return this.filterditems;
        };


        //This scope is for DisplayCategory
        this.getDepartments = function (warehouseid) {
            return $http.get("http://103.231.44.202:808/api/CategoryJson").then(function (results) {
            //return $http.get("http://localhost:26264/api/CategoryJson").then(function (results) {
            
                this.departments = results.data;          
                this.warehousefiltereddepartment = _.filter(this.departments, function (department) {
                    return department.Warehouseid == warehouseid;
                });
                console.log(departments);
                console.log("warehousefiltereddepartment");
                console.log(this.warehousefiltereddepartment);
                return this.warehousefiltereddepartment;

            });

            //console.log("jsondata");
            //console.log(this.departments);

        }

        //this.getItems = function (SubsubCategoryid) {
        //    //return $http.get("https://parature.webfortis.com/shoppingcartapps/api/SubsubCategoriesJsonApi").then(function (results) {
        //    return $http.get("http://localhost:26264/api/SubsubCategoriesJsonApi").then(function (results) {
        //        this.Items = results.data;
        //        console.log("vik Sharma122");
        //        console.log(Items);
        //        this.warehousefilter = _.filter(this.Items, function (department) {
        //            return department.Warehouseid == SubsubCategoryid;
        //        });
        //        //console.log(Items);
        //        console.log("vik Sharma");
        //        //console.log("warehousefilter");
        //        console.log(this.warehousefilter);
        //        return this.warehousefilter;

        //    });

        //    //console.log("jsondata");
        //    //console.log(this.departments);

        //}



        this.addToCart = function (product) {
            var productInCart = false;
            this.cartProducts.forEach(function (prod, index, prods) {

                if (prod.ItemId === product.ItemId) {
                    productInCart = prod;
                    console.log(prod);
                    return;
                }
            });

            if (productInCart) {
                console.log("productInCart")
                this.addOneProduct(productInCart);
            } else {
                console.log("productInCartelse")
                product.purchaseQuantity = 0;
                this.addOneProduct(product);
                this.cartProducts.push(product);
            }
        };
        

        this.removeProduct = function (product) {
            console.log("remove called");
            this.cartProducts.forEach(function (prod, i, prods) {
                if (product.ItemId === prod.ItemId) {

                    this.cartProducts.splice(i, 1);
                    this.updateTotal();
                }
            }.bind(this));
        };

        this.addOneProduct = function (product) {
            console.log("Got Product");
            console.log(product.quantity);
            console.log(product.purchaseQuantity);
            this.ItemCount += 1;
            --product.quantity;
            ++product.purchaseQuantity;
            product.total = formatTotal(product.price * product.purchaseQuantity);
            this.updateTotal();
        };

        this.removeOneProduct = function (product) {
            if (product.purchaseQuantity > 0) {
                ++product.quantity;
                --product.purchaseQuantity;
                product.total = formatTotal(product.price * product.purchaseQuantity);
                this.ItemCount -= 1;
                this.updateTotal();
            }
        };

        this.cartTotal = function () {
            var total = 0;
            console.log("In Cart Total");
            console.log(this.cartProducts);
            this.cartProducts.forEach(function (prod, index, prods) {
                total += prod.price * prod.purchaseQuantity;

            });
            console.log(total);
            return formatTotal(total);
        };

        var formatTotal = function (total) {
            return total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        };

        this.updateTotal = function () {
            console.log("In Update Cart Total");
            this.total = this.cartTotal();
        }.bind(this);

        this.updateTotal();












        this.getProducts = function (callback) {

            var items =
                this.galleryProducts = items;
            if (callback) { callback(); }
            return this.galleryProducts;
            //$http.get('/admin/panel/products')
            //.success(function(products){

            //	//this.galleryProducts = products;
            //  if (callback) {callback();}
            //}.bind(this));
        };



  }]);
    app.factory('getsetService', function () {
        var tempdata = {};
        var data = {};
        //   var recentitem = $injector.get('recentitem');
        return data = {
            Getdata: function () {
                return tempdata;
            },
            Setdata: function (input) {
                console.log("input");
                console.log(input);
                tempdata.Mobile = input;
                return tempdata
            },
            //Setproject: function (input) {
            //    tempdata.project = input;
            //    recentitem.setrecentproject(input);
            //},
            //SetTasktype: function (input) {
            //    tempdata.tasktype = input;
            //    recentitem.setrecenttasktype(input);
            //},
            reset: function () {
                tempdata = {};
            }
        };
    })

  app.service('Customers', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {
      console.log("Customers service is start loading...")
      var geolocationData = {};
      var serviceBase = ngAuthSettings.apiServiceBaseUri;
      var CustomerDataServiceFactory = [];
      var _getgeo = function (geolocation) {
          console.log("getgeo service start loading");
                     //https://maps.googleapis.com/maps/api/geocode/json?address=indore&sensor=false
          var url = "https://maps.googleapis.com/maps/api/geocode/json?"+geolocation+"&sensor=false";
         //var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=37.383253,-122.078075&sensor=false";
          return $http.get(url).then(function (results) {
              console.log("results getgeo service");
              console.log(results);
              alert(results.data.results[0].formatted_address);
              geolocationData = results.data.results[0];
              console.log("geodata");
              console.log(geolocationData);
              return results.data.results[0];

          })
      }
      var _postCustomerData = function (data) {
          console.log("post customer data service is loding....");
          console.log(data);
          //console.log(geolocationData);
          //var filterdata = [];
          //var a = { x: 1 , x: 2 };
          //var b=_.map(a, function (num,key) {
          //    return num * 5;
          //})
          //console.log(b);
         
        
              //console.log("geolocationdata"+data);
            
             
          var url = "http://103.231.44.202:808/api/signup";
          //var url = "http://localhost:26264/api/signup";
          return $http.post(url, data).then(function (results) {
              return results;
          });
          
      };

      //var _putCustomerData = function () {

      //    return $http.put(serviceBase + 'api/customers').then(function (results) {
      //        return results;
      //    });
      //};

      //CustomerDataServiceFactory.putCustomerData = _putCustomerData;

      CustomerDataServiceFactory.postCustomerData = _postCustomerData;
      CustomerDataServiceFactory.getgeo = _getgeo;
      return CustomerDataServiceFactory;
  }])

    //CHECKOUT VALIDATION SERVICE
    app.service('CheckoutValidation', function () {

        this.validateCreditCardNumber = function (cc) {
            return Stripe.card.validateCardNumber(cc);
        };

        this.validateExpiry = function (month, year) {
            return Stripe.card.validateExpiry(month, year);
        };

        this.validateCVC = function (cvc) {
            return Stripe.card.validateCVC(cvc);
        };

        this.validateEmail = function (email) {
            var emailReg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return emailReg.test(email);
        };

        this.validateZipcode = function (zipcode) {
            var zipReg = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
            return zipReg.test(zipcode);
        };

        this.checkAll = function (checkoutDetails) {
            if (Object.keys(checkoutDetails).length === 0) { return false; }
            for (var input in checkoutDetails) {
                /* Check validation for credit card number */
                if (input === 'cc' && !this.validateCreditCardNumber(checkoutDetails[input])) {
                    return false;
                }
                /* Check validation for expiration date on credit card */
                if (input === 'exp' && !this.validateExpiry(checkoutDetails[input].slice(0, 2), checkoutDetails[input].slice(3))) {
                    return false;
                }
                /* Check validation for cvc number on credit card */
                if (input === 'cvc' && !this.validateCVC(checkoutDetails[input])) {
                    return false;
                }

                if (input === 'email' && !this.validateEmail(checkoutDetails[input])) {
                    return false;
                }

                if (input === 'zipcode' && !this.validateZipcode(checkoutDetails[input])) {
                    return false;
                }
            }
            return true;
        }.bind(this);
    });

    //STRIPE INTEGRATION SERVICE
    app.service('stripeCheckout', ['Products', 'CheckoutValidation', '$http', function (Products, CheckoutValidation, $http) {

        this.setStripeKey = function (key) {
            Stripe.setPublishableKey(key);
        };

        this.setStripeTokenCallback = function () {

        };

        this.processCheckout = function (checkoutDetails, callback) {
            var cc = checkoutDetails.cc;
            var month = checkoutDetails.exp.slice(0, 2);
            var year = checkoutDetails.exp.slice(3);
            var cvc = checkoutDetails.cvc;

            Stripe.card.createToken({
                number: cc,
                cvc: cvc,
                exp_month: month,
                exp_year: year
            }, callback);
        };

        this.stripeCallback = function (status, response) {
            this.setStripeTokenCallback(status, response);
        }.bind(this);

        var pay = function (response) {
            var token = response.id;
            url = '/stripe/pay';
            $http.post(url, { stripeToken: token });
        };

    }]);

})(angular);
(function (angular) {

    //IONIC CART DIRECTIVE
    var app = angular.module('ionicShop.directives', ['ionic', 'ionicShop.services']);

    app.directive('ionCart', ['Products', '$templateCache', function (Products, $templateCache) {
        var link = function (scope, element, attr) {
            scope.$watch('products.length', function (newVal, oldVal) {
                Products.updateTotal();
                scope.emptyProducts = newVal > 0 ? false : true;
            });

            //  scope.emptyProducts = scope.products.length ? false : true;

            scope.addProduct = function (product) {
                Products.addOneProduct(product);
            };

            scope.removeProduct = function (product) {
                product.purchaseQuantity <= 1 ? Products.removeProduct(product) : Products.removeOneProduct(product);
            };
        };

        return {
            restrict: 'AEC',
            templateUrl: 'cart-item.html',
            link: link,
            scope: {
                products: '='
            }
        };
    }]);

    app.directive('ionProductImage', ['$timeout', '$ionicModal', '$ionicSlideBoxDelegate', '$templateCache', function ($timeout, $ionicModal, $ionicSlideBoxDelegate, $templateCache) {
        var link = function (scope, element, attr) {

            scope.closeModal = function () {
                scope.modal.hide();
                scope.modal.remove();
            };

            element.on('click', function () {
                $ionicModal.fromTemplateUrl('partials/cart-image-modal.html', {
                    animation: 'slide-left-right',
                    scope: scope
                })
                .then(function (modal) {
                    scope.modal = modal;
                    scope.modal.show();
                    $timeout(function () {
                        $ionicSlideBoxDelegate.update();
                    });
                });

            });

        };

        return {
            restrict: 'A',
            link: link,
            scope: '='
        };
    }]);

    // IONIC CHECKOUT DIRECTIVE
    app.directive('ionCartFooter', ['$state', '$templateCache', function ($state, $templateCache) {
        var link = function (scope, element, attr) {

            element.addClass('bar bar-footer bar-calm');
            element.on('click', function (e) {
                if (scope.path) {
                    $state.go(scope.path);
                }
            });

            element.on('touchstart', function () {
                element.css({ opacity: 0.8 });
            });

            element.on('touchend', function () {
                element.css({ opacity: 1 });
            });
        };

        return {
            restrict: 'AEC',
            templateUrl: 'cart-footer.html',
            scope: {
                path: '=path'
            },
            link: link
        };
    }]);

    // IONIC PURCHASE DIRECTIVE
    app.directive('ionCheckout', ['Products', '$templateCache', function (Products, $templateCache) {
        var link = function (scope, element, attr) {
            scope.$watch(function () {
                return Products.total;
            }, function () {
                scope.total = Products.total;
            });

            scope.checkout = Products.checkout;
            //*** Total sum of products in usd by default ***\\
            scope.total = Products.total;

            //*** Add address input fields when has-address attribute is on ion-purchase element ***\\
            if (element[0].hasAttribute('has-address')) { scope.hasAddressDir = true; }

            //*** Add email input field when has-email attribute is on ion-purchase element ***\\
            if (element[0].hasAttribute('has-email')) { scope.hasEmailDir = true; }

            //*** Add name input fields when has-name attribute is on ion-purchase element ***\\
            if (element[0].hasAttribute('has-name')) { scope.hasNameDir = true; }
        };

        return {
            restrict: 'AEC',
            templateUrl: 'checkout.html',
            link: link
        };
    }]);

    app.directive('ionGallery', ['Products', '$templateCache', function (Products, $templateCache) {
        var link = function (scope, element, attr) {

            scope.addToCart = function (product) {
                Products.addToCart(product);
            };
        };

        return {
            restrict: 'AEC',
            templateUrl: 'gallery-item.html',
            link: link,
            scope: {
                products: '='
            }
        };

    }]);

    //IONIC PURCHASE FOOTER DIRECTIVE
    app.directive('ionCheckoutFooter', ['$compile', 'Products', 'stripeCheckout', 'CheckoutValidation', '$templateCache', function ($compile, Products, stripeCheckout, CheckoutValidation, $templateCache) {
        var link = function (scope, element, attr) {
            scope.checkout = Products.checkout;
            scope.processCheckout = stripeCheckout.processCheckout;
            scope.stripeCallback = stripeCheckout.stripeCallback;

            element.addClass('bar bar-footer bar-calm');

            element.on('click', function () {
                if (CheckoutValidation.checkAll(scope.checkout)) {
                    scope.processCheckout(scope.checkout, scope.stripeCallback);
                } else {
                    var ionPurchaseSpan = document.getElementsByTagName('ion-checkout')[0].children[0];
                    angular.element(ionPurchaseSpan).html('You have invalid fields:').css({ color: '#ED303C', opacity: 1 });
                }
            });

            element.on('touchstart', function () {
                element.css({ opacity: 0.8 });
            });

            element.on('touchend', function () {
                element.css({ opacity: 1 });
            });
        };

        return {
            restrict: 'AEC',
            templateUrl: 'checkout-footer.html',
            link: link
        };
    }]);


    //ADDITIONAL CONTENT DIRECTIVES

    //CHECKOUT CARD GROUP
    app.directive('checkoutCard', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/card-form.html'
        };

    }]);

    // CARD NUM INPUT
    app.directive('cardNumInput', ['$timeout', 'CheckoutValidation', '$templateCache', function ($timeout, CheckoutValidation, $templateCache) {
        var link = function (scope, element, attr) {
            var input = element.children()[0].children[0];
            var icon = element.children()[0].children[1];
            scope.onNumBlur = function () {
                if (!scope.checkout.cc) { return; }
                angular.element(icon).removeClass('ion-card');
                angular.element(icon).addClass('ion-loading-d');
                $timeout(function () {
                    if (!CheckoutValidation.validateCreditCardNumber(scope.checkout.cc)) {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-close-round').css({ color: '#ED303C' });
                        return;
                    } else {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                    }
                }, 300);
            };

            scope.onNumFocus = function () {
                angular.element(icon).removeClass('ion-checkmark-round ion-close-round');
                angular.element(icon).addClass('ion-card').css({ color: '#333' });
            };
        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/card-num-input.html'
        };
    }]);

    // CARD EXPIRATION INPUT
    app.directive('cardExpInput', ['$timeout', 'CheckoutValidation', '$templateCache', function ($timeout, CheckoutValidation, $templateCache) {
        var link = function (scope, element, attr) {
            var input = element.children()[0].children[0];
            var icon = element.children()[0].children[1];
            scope.onExpBlur = function () {
                if (!scope.checkout.exp) { return; }
                angular.element(icon).addClass('ion-loading-d');
                $timeout(function () {
                    if (!scope.checkout.exp || !CheckoutValidation.validateExpiry(scope.checkout.exp.slice(0, 2), scope.checkout.exp.slice(3))) {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-close-round').css({ color: '#ED303C' });
                        return;
                    } else {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                    }
                }, 300);
            };

            scope.onExpFocus = function () {
                angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
            };
        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/card-exp-input.html'
        };

    }]);

    //CARD CVC INPUT
    app.directive('cardCvcInput', ['$timeout', 'CheckoutValidation', '$templateCache', function ($timeout, CheckoutValidation, $templateCache) {
        var link = function (scope, element, attr) {
            var input = element.children()[0].children[0];
            var icon = element.children()[0].children[1];
            scope.onCvcBlur = function () {
                if (!scope.checkout.cvc) { return; }
                angular.element(icon).addClass('ion-loading-d');
                $timeout(function () {
                    if (!CheckoutValidation.validateCVC(scope.checkout.cvc)) {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-close-round').css({ color: '#ED303C' });
                        return;
                    } else {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                    }
                }, 300);
            };

            scope.onCvcFocus = function () {
                angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
            };

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/card-cvc-input.html'
        };
    }]);

    // ADDRESS GROUP

    app.directive('checkoutAddress', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/address.html'
        };

    }]);

    //ADDRESS LINE ONE INPUT
    app.directive('addressOneInput', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/address-line-one.html'
        };
    }]);

    // ADDRESS LINE TWO INPUT
    app.directive('addressTwoInput', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {

            scope.onAddrTwoBlur = function () {

            };

            scope.onAddrTwoFocus = function () {

            };

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/address-line-two.html'
        };
    }]);

    //CITY INPUT
    app.directive('cityInput', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {
            scope.onCityBlur = function () {

            };

            scope.onCityFocus = function () {

            };

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/city-input.html'
        };
    }]);

    // STATE INPUT
    app.directive('stateInput', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {
            scope.onStateBlur = function () {

            };

            scope.onStateFocus = function () {

            };

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/state-input.html'
        };
    }]);





    //ZIP INPUT
    app.directive('zipInput', ['$timeout', 'CheckoutValidation', '$templateCache', function ($timeout, CheckoutValidation, $templateCache) {
        var link = function (scope, element, attr) {
            var icon = element.children()[0].children[1];
            scope.onZipBlur = function () {
                if (!scope.checkout.zipcode) { return; }
                angular.element(icon).addClass('ion-loading-d');
                $timeout(function () {
                    if (!CheckoutValidation.validateZipcode(scope.checkout.zipcode)) {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-close-round').css({ color: '#ED303C' });
                        return;
                    } else {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                    }
                }, 300);
            };

            scope.onZipFocus = function () {
                angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
            };

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/zipcode-input.html'
        };
    }]);

    //NAME GROUP

    app.directive('checkoutName', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/name-input.html'
        };

    }]);


    //FIRST NAME
    app.directive('lastNameInput', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {

        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/first-name-input.html'
        };

    }]);

    //LAST NAME
    app.directive('firstNameInput', ['$templateCache', function ($templateCache) {
        var link = function (scope, element, attr) {

        };
        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/last-name-input.html'
        };
    }]);

    //EMAIL GROUP
    app.directive('checkoutEmail', ['$timeout', 'CheckoutValidation', '$templateCache', function ($timeout, CheckoutValidation, $templateCache) {
        var link = function (scope, element, attr) {
            var icon = element.children()[1].children[1];
            scope.onEmailBlur = function () {
                if (!scope.checkout.email) { return; }
                angular.element(icon).addClass('ion-loading-d');
                $timeout(function () {
                    if (!CheckoutValidation.validateEmail(scope.checkout.email)) {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-close-round').css({ color: '#ED303C' });
                        return;
                    } else {
                        angular.element(icon).removeClass('ion-loading-d');
                        angular.element(icon).addClass('ion-checkmark-round').css({ color: '#1fda9a' });
                    }
                }, 300);
            };

            scope.onEmailFocus = function () {
                angular.element(icon).removeClass('ion-checkmark-round ion-close-round').css({ color: '#333' });
            };
        };

        return {
            restrict: 'AE',
            link: link,
            templateUrl: 'partials/email-input.html'
        };
    }]);


    // CUSTOMIZATION DIRECTIVES

    app.directive('mouseDownUp', function () {
        var link = function (scope, element, attr) {

            element.on('touchstart', function () {
                element.css({ opacity: 0.5 });
            });

            element.on('touchend', function () {
                element.css({ opacity: 1 });
            });

        };

        return {
            restrict: 'AC',
            link: link
        };
    });

    app.directive('cartAdd', ['$timeout', function ($timeout) {
        var link = function (scope, element, attr) {

            scope.addText = 'Add To Cart';

            element.on('click', function () {
                scope.addText = 'Added';
                element.addClass('gallery-product-added');
                $timeout(function () {
                    scope.addText = 'Add To Cart';
                    element.removeClass('gallery-product-added');
                }, 500);
            });
        };

        return {
            restrict: 'AC',
            link: link,
            scope: true
        };
    }]);

})(angular);

(function (angular) {
    angular.module("ionicShop.templates", []).run(["$templateCache", function ($templateCache) {
        $templateCache.put("cart-footer.html", "<div class=\'title cart-footer\'>Checkout</div>");
        //$templateCache.put("cart-item.html", "<div ng-if=\'!emptyProducts\'>\n  <div class=\'card product-card\' ng-repeat=\'product in products track by $index\'>\n    <div class=\'item item-thumbnail-left product-item\'>\n      <img ng-src=\'{{product.primary_image_url}}\' class=\'product-image\' ion-product-image=\'product\'>\n      <h3 class=\'product-title\'>{{product.display_name}}</h3>\n      <p class=\'product-description\'>{{product.description}}</p>\n\n      <i class=\'icon ion-plus-round icon-plus-round\' mouse-down-up ng-click=\'addProduct(product)\'></i>\n         <span class=\'product-quantity\'>{{product.purchaseQuantity}}</span>\n      <i class=\'icon ion-minus-round icon-minus-round\' mouse-down-up ng-click=\'removeProduct(product)\'></i>\n\n      <span class=\'product-price\'>₹ {{product.total}}</span>\n    <span class=\'product-price\'>₹ {{product.price}}</span>\n</div>\n  </div>\n  <div>\n    <br><br><br><br>\n  </div>\n</div>\n\n<div class=\'empty-cart-div\' ng-if=\'emptyProducts\'>\n  <h3 class=\'empty-cart-header\'>Your bag is empty!</h3>\n  <i class=\'icon ion-bag empty-cart-icon\'></i>\n</div>");
        $templateCache.put("cart-item.html", "<div ng-if=\'!emptyProducts\'>\n  <ion-item class=\'card product-card\' ng-repeat=\'product in products track by $index\'>   <div class=\'item-avatar-left products\'>      <img ng-src=\'{{product.primary_image_url}}\' >    <div class='row'>   <div class='col'>{{product.itemname }}</div>      <div class='col'></div>     <div class='col'></div>       <div class='col'>₹ {{product.total}}</div>  </div>   <div class='row'>                   <div class='col'>                       <h3 class='product-unit'>MRP {{product.price}}  ₹  {{product.unit}}</h3>                       <h3 class='price_quantity '>  ₹ {{product.price}} |10 {{product.Discount}} %      </h3>  </div><div class='col'> <ul class='list-inline btn-click'> <li class='circle-btn' ng-click='removeProduct(product)'> - </li><li class='show_quantity ng-binding'>{{product.purchaseQuantity}}</li>  <li class='circle-btn' ng-click='addProduct(product)'>    +    </li> </ul>  </div>   </div></ion-item> </div>  </div>\n\n<div class=\'empty-cart-div\' ng-if=\'emptyProducts\'>\n  <h3 class=\'empty-cart-header\'>Your bag is empty!</h3>\n  <i class=\'icon ion-bag empty-cart-icon\'></i>\n</div>");
        $templateCache.put("checkout-footer.html", "<div class=\'title purchase-footer\'>Pay</div>");
        $templateCache.put("checkout.html", "\n<span class=\'checkout-form-description\'>Please enter your credit card details:</span>\n\n<div class=\'list checkout-form\'>\n  <checkout-name ng-if=\'hasNameDir\'></checkout-name>\n  <checkout-card></checkout-card>\n  <checkout-address ng-if=\'hasAddressDir\'></checkout-address>\n  <checkout-email ng-if=\'hasEmailDir\'></checkout-email>\n</div>\n\n<h2 class=\'checkout-total\'>Total: ₹{{total}}</h2>\n");
        $templateCache.put("gallery-item.html", "<div class=\'ion-gallery-content\'>\n  <div class=\'card gallery-card\' ng-repeat=\'product in products track by $index\'>\n    <div class=\'item gallery-item\'>\n      <div class=\'gallery-image-div\'>\n        <img ng-src=\'{{product.primary_image_url}}\' class=\'gallery-product-image\'>\n      </div>\n      <h3 class=\'gallery-product-title\'>{{product.itemname}}</h3>\n      <h3 class=\'gallery-product-price\'>₹{{product.price}} - {{product.size}}</h3>\n     <i class=\'icon ion-plus-round icon-plus-round\' mouse-down-up ng-click=\'addToCart(product)\'></i>\n         <span class=\'product-quantity\'>{{product.purchaseQuantity}}</span>\n      <i class=\'icon ion-minus-round icon-minus-round\' mouse-down-up ng-click=\'removeProduct(product)\'></i>\n\n           </div>\n    </div>\n  </div>\n</div>");
        $templateCache.put("partials/address-line-one.html", "<label class=\'item item-input address-line-one\'>\n  <input type=\'text\' ng-model=\'checkout.addressLineOne\' placeholder=\'Address Line 1\'>\n</label>");
        $templateCache.put("partials/address-line-two.html", "<label class=\'item item-input address-line-two\'>\n  <input type=\'text\' ng-model=\'checkout.addressLineTwo\' placeholder=\'Address Line 2\'>\n</label>");
        $templateCache.put("partials/address.html", "<div class=\'item item-divider\'>Address: </div>\n<address-one-input></address-one-input>\n<address-two-input></address-two-input>\n<city-input></city-input>\n<state-input></state-input>\n<zip-input></zip-input>\n");
        $templateCache.put("partials/card-cvc-input.html", "<label class=\'item item-input card-cvc-input\'>\n  <input type=\'tel\' ng-model=\'checkout.cvc\' ng-focus=\'onCvcFocus()\' ng-blur=\'onCvcBlur()\' placeholder=\'CVC\'>\n  <i class=\"icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>");
        $templateCache.put("partials/card-exp-input.html", "<label class=\'item item-input card-exp-input\'>\n  <input type=\'tel\' ng-model=\'checkout.exp\' ng-focus=\'onExpFocus()\' ng-blur=\'onExpBlur()\' placeholder=\'MM/YYYY\'>\n  <i  class=\"icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>");
        $templateCache.put("partials/card-form.html", "<div class=\'item item-divider\'>Card Info: </div>\n<card-num-input></card-num-input>\n<card-exp-input></card-exp-input>\n<card-cvc-input></card-cvc-input>");
        $templateCache.put("partials/card-num-input.html", "<label class=\'item item-input card-num-input\'>\n  <input type=\'tel\' ng-model=\'checkout.cc\' ng-focus=\'onNumFocus()\' ng-blur=\'onNumBlur()\' placeholder=\'Credit Card Number\'>\n  <i  class=\"icon ion-card\" style=\'width: 40px; text-align: center;\'></i>\n</label>");
        $templateCache.put("partials/cart-image-modal.html", "<div class=\"modal image-slider-modal\">\n\n  <ion-header-bar>\n    <button class=\"button button-light icon ion-ios7-undo-outline\" ng-click=\'closeModal()\'></button>\n    <h1 class=\"title\">More Images</h1>\n    \n  </ion-header-bar>\n\n    <ion-slide-box class=\'image-slider-box\' does-continue=\'true\'>\n      <ion-slide ng-repeat=\'image in product.images\' class=\'image-ion-slide\'>\n        <ion-content>\n          <div class=\'image-slide-div\'>\n            <h3 class=\'image-slide-description\'>{{product.description}}</h3>\n            <img src=\'{{image}}\' class=\'image-slide\'>\n          </div>\n        </ion-content>\n      </ion-slide>\n    </ion-slide-box>\n\n</div>");
        $templateCache.put("partials/city-input.html", "<label class=\'item item-input city-input\'>\n  <input type=\'text\' ng-model=\'checkout.city\' placeholder=\'City\'>\n</label>");
        $templateCache.put("partials/email-input.html", "<div class=\"item item-divider\">E-mail: </div>\n<label class=\"item item-input email-input\">\n  <input type=\"text\" ng-model=\"checkout.email\" ng-focus=\'onEmailFocus()\' ng-blur=\'onEmailBlur()\' placeholder=\"E-Mail\">\n  <i class=\"icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>\n\n");
        $templateCache.put("partials/first-name-input.html", "  <label class=\'item item-input first-name-input\'>\n    <input type=\'text\' ng-model=\'checkout.lastName\' placeholder=\'Last Name\'>\n  </label>");
        $templateCache.put("partials/last-name-input.html", "  <label class=\'item item-input last-name-input\'>\n    <input type=\'text\' ng-model=\'checkout.firstName\' placeholder=\'First Name\'>\n  </label>");
        $templateCache.put("partials/name-input.html", "<div class=\'item item-divider\'>Name: </div>\n<first-name-input></first-name-input>\n<last-name-input></last-name-input>");
        $templateCache.put("partials/state-input.html", "<label class=\'item item-input state-input\'>\n  <input type=\'text\' ng-model=\'checkout.state\' placeholder=\'State\'>\n</label>");
        $templateCache.put("partials/zipcode-input.html", "<label class=\'item item-input zip-code-input\'>\n  <input type=\'text\' ng-model=\'checkout.zipcode\' ng-focus=\'onZipFocus()\' ng-blur=\'onZipBlur()\' placeholder=\'Zipcode\'>\n  <i class=\"icon zip-code-input-icon\" style=\'width: 40px; text-align: center;\'></i>\n</label>");
    }]);
})(angular);
(function (angular) {

    var app = angular.module('ionicShop', ['ionic', 'ionicShop.services', 'ionicShop.directives', 'ionicShop.templates']);

})(angular);