(function (angular) {
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


            return $http.get("http://localhost:26264/api/CategoryJson").then(function (results) {

                this.departments = results.data;

                this.warehousefiltereddepartment = _.filter(this.departments, function (department) {

                    return department.warehouse_id == warehouseid;

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
            return $http.get("http://localhost:26264/api/CategoryJson").then(function (results) {
                this.departments = results.data;          
                this.warehousefiltereddepartment = _.filter(this.departments, function (department) {
                    return department.warehouse_id == warehouseid;
                });
                console.log(departments);
                console.log("warehousefiltereddepartment");
                console.log(this.warehousefiltereddepartment);
                return this.warehousefiltereddepartment;

            });

            //console.log("jsondata");
            //console.log(this.departments);

        }

        this.getItems = function (SubsubCategoryid) {
            return $http.get("http://localhost:26264/api/ItemMasters").then(function (results) {
                this.Items = results.data;
                console.log("vik Sharma122");
                console.log(Items);
                this.warehousefilter = _.filter(this.Items, function (department) {
                    return department.warehouse_id == SubsubCategoryid;
                });
                //console.log(Items);
                console.log("vik Sharma");
                //console.log("warehousefilter");
                console.log(this.warehousefilter);
                return this.warehousefilter;

            });

            //console.log("jsondata");
            //console.log(this.departments);

        }


        this.addToCart = function (product) {
            var productInCart = false;
            this.cartProducts.forEach(function (prod, index, prods) {

                if (prod.id === product.id) {
                    productInCart = prod;
                    console.log(prod);
                    return;
                }
            });

            if (productInCart) {

                this.addOneProduct(productInCart);
            } else {
                product.purchaseQuantity = 0;
                this.addOneProduct(product);
                this.cartProducts.push(product);
            }
        };


        this.removeProduct = function (product) {
            console.log("remove called");
            this.cartProducts.forEach(function (prod, i, prods) {
                if (product.id === prod.id) {

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
            ++product.quantity;
            --product.purchaseQuantity;
            product.total = formatTotal(product.price * product.purchaseQuantity);
            this.ItemCount -= 1;
            this.updateTotal();
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
            var items = [{
                "qty": 0, "total": 0, "purchaseQuantity": 0, "brand": "Driscoll's", "id": "107011", "display_name": "Banana", "price": "0.29", "size": "each", "display_size": "each", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/da7119f012cf0c4133bdf31268f451fd.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/da7119f012cf0c4133bdf31268f451fd.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "781", "rack_id": "3", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [107042], "wine_rating": ""
            }, { "qty": 0, "total": 0, "purchaseQuantity": 0, "brand": "Driscoll's", "id": "106706", "display_name": "Cilantro Bunch", "price": "0.49", "size": "each", "display_size": "each", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_3c729f03-24b8-48bf-bbcd-d4f56be62f6f.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_3c729f03-24b8-48bf-bbcd-d4f56be62f6f.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "782", "rack_id": "1", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106648, 106645], "wine_rating": "" }, { "qty": 0, "total": 0, "purchaseQuantity": 0, "brand": "Naturipe", "id": "107154", "display_name": "Yellow Bell Pepper", "price": "0.99", "size": "each", "display_size": "each", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/33a78ff25279c7432a4a7a333af32f9c.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/33a78ff25279c7432a4a7a333af32f9c.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "783", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [107011, 107019, 106762, 106968, 106784, 347580, 99675, 107161, 106912], "wine_rating": "" }, { "qty": 0, "total": 0, "purchaseQuantity": 0, "brand": "Naturipe", "id": "106762", "display_name": "Rosemary", "price": "1.39", "size": "1 bunch", "display_size": "1 bunch", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/68a7b9e087379951c0d2d6caf20a614c.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/68a7b9e087379951c0d2d6caf20a614c.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "782", "rack_id": "1", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106721, 106706, 106664, 106784, 110887, 106929, 106731, 106648, 106645, 106827, 106819, 106679], "wine_rating": "" }, { "qty": 0, "total": 0, "purchaseQuantity": 0, "brand": "Halos", "id": "106782", "display_name": "Gold Bosc Pears Small", "price": "0.39", "size": "each", "display_size": "each", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/a65a55247d466999592b7b8dc78b9109.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/a65a55247d466999592b7b8dc78b9109.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "781", "rack_id": "3", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106938, 107062, 107042, 347679, 347648, 106870, 347650, 106871, 402400, 106910, 106967, 357259, 106954, 106901, 106763, 347603], "wine_rating": "" }, { "qty": 0, "total": 0, "purchaseQuantity": 0, "brand": "Halos", "id": "106664", "display_name": "Mint", "price": "1.39", "size": "1 bunch", "display_size": "1 bunch", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/17bcff16da30ee17f00eb1db8425cf8b.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/17bcff16da30ee17f00eb1db8425cf8b.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "782", "rack_id": "2", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106721, 106706, 106784, 110887, 106929, 106731, 106762, 106648, 106645, 106827, 106819, 106679], "wine_rating": "" }, { "qty": 0, "total": 0, "purchaseQuantity": 0, "brand": "Halos", "id": "107019", "display_name": "Christopher Ranch California Garlic Bag", "price": "3.99", "size": "3 lb", "display_size": "3 lb", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/-5a9f27a3e079cd9920a1109756225b0c.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/-5a9f27a3e079cd9920a1109756225b0c.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "783", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [107071, 347580], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Halos", "id": "106784", "display_name": "Epazote", "price": "1.39", "size": "1 bunch", "display_size": "1 bunch", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/b9f49018e0dd764a8b427151f49de167.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/b9f49018e0dd764a8b427151f49de167.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "782", "rack_id": "2", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106721, 106706, 106664, 110887, 106929, 106731, 106762, 106648, 106645, 106827, 106819, 106679], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "SunBelle", "id": "106901", "display_name": "Driscoll's Fresh Raspberries", "price": "2.99", "size": "6 oz", "display_size": "6 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_b072f63b-78ce-4a7a-9f25-580383baaa2a.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_b072f63b-78ce-4a7a-9f25-580383baaa2a.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "781", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [219576, 106938, 107062, 107042, 347679, 347648, 106870, 347650, 106871, 402400, 106910, 106967, 357259, 106954, 106763, 347603], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "SunBelle", "id": "106968", "display_name": "Yellow Peaches", "price": "0.39", "size": "each", "display_size": "each", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/aaa020b79de099514711a06ff129dbbc.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/aaa020b79de099514711a06ff129dbbc.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "128", "aisle_id": "781", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106938, 107062, 107042, 347679, 347648, 106870, 347650, 106871, 402400, 106910, 106967, 357259, 106954, 106901, 106763, 347603], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "SunBelle", "id": "108071", "display_name": "Kroger Vitamin A \u0026 D Skim Milk", "price": "3.29", "size": "gallon", "display_size": "gallon", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/987bdfcaf7cd5f1af7dd5f6f042b4927.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/987bdfcaf7cd5f1af7dd5f6f042b4927.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "921", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [347601, 109265, 347597, 109263, 108076, 108074, 108081, 106486, 108069, 108079, 108067], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "SunBelle", "id": "108074", "display_name": "Kroger Vitamin D Whole Milk", "price": "3.69", "size": "gallon", "display_size": "gallon", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/698aa374bf7b6b6bed66e9a859762e98.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/698aa374bf7b6b6bed66e9a859762e98.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "921", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [108079, 108067, 108069, 108071, 108081, 106486, 108076], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Pure Heart", "id": "108067", "display_name": "Kroger Vitamin A \u0026 D Skim Milk", "price": "1.79", "size": "half gal", "display_size": "half gal", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_2cadfb77-b0c7-4c8c-b3da-a27a775b0c5d.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_2cadfb77-b0c7-4c8c-b3da-a27a775b0c5d.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "921", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [347601, 347597, 109265, 109263, 106486, 108076, 108074, 108081, 108069, 108071, 108079], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Pure Heart", "id": "107917", "display_name": "Barnstar Family Farms Large Brown Grade AA Eggs", "price": "2.99", "size": "12 ct", "display_size": "12 ct", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/2a7f67e67748d7de291227bec476d2ad.png", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/2a7f67e67748d7de291227bec476d2ad.png", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "920", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [107920, 106505, 107904], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Pure Heart", "id": "107904", "display_name": "Kroger Large Grade AA Eggs", "price": "2.49", "size": "12 ct", "display_size": "12 ct", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_ce6066b8-5947-4ea1-9a3d-d762828eaccc.jpeg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_ce6066b8-5947-4ea1-9a3d-d762828eaccc.jpeg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "920", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [107920, 106505, 107917], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Pure Heart", "id": "107920", "display_name": "Kroger Large Grade AA Eggs", "price": "3.49", "size": "18 ct", "display_size": "18 ct", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_53012165-f64f-4c47-bbe6-2e710e345749.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_53012165-f64f-4c47-bbe6-2e710e345749.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "920", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106505, 107917, 107904], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "108069", "display_name": "Kroger Vitamin A \u0026 D Reduced Fat 2% Milk", "price": "1.99", "size": "half gallon", "display_size": "half gallon", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/0d9e2e3fb2ac65a80d15c1b78c7ee6b0.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/0d9e2e3fb2ac65a80d15c1b78c7ee6b0.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "921", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [106488, 219654, 108074, 108081, 106449, 106486, 347601, 108076, 108078, 108075, 108082, 347583, 108071, 108079, 108067], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "106458", "display_name": "Kroger Butter Unsalted", "price": "2.99", "size": "16 oz", "display_size": "16 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_5e17a633-5a1b-4bdf-8c44-91ce1978ffd9.jpeg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_5e17a633-5a1b-4bdf-8c44-91ce1978ffd9.jpeg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "926", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [110087, 106513, 106294, 106364, 106303, 106332, 106504, 106604, 106523, 106446, 106356, 106344, 106563], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "103814", "display_name": "Chobani Nonfat Peach Greek Yogurt", "price": "1.29", "size": "5.3 oz", "display_size": "5.3 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_5d2bdb05-35ef-4e28-b2da-af309f1f5726.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_5d2bdb05-35ef-4e28-b2da-af309f1f5726.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "143", "aisle_id": "924", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [103896, 103867, 104001, 103891, 347599, 103892, 98397, 103745, 98828, 103910, 219582, 103785, 347631, 103749, 103736, 98845], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "103781", "display_name": "Thomas' Sourdough English Muffins 6 Pk", "price": "4.39", "size": "12 oz", "display_size": "6 x 12 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_517b2bdb-6906-4c2d-9eb7-ebf991e40d4e.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_517b2bdb-6906-4c2d-9eb7-ebf991e40d4e.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "896", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [219609, 103779, 103879, 103872, 103862, 103780], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "99517", "display_name": "Sara Lee Soft \u0026 Smooth 100% Whole Wheat Bakery Bread", "price": "4.29", "size": "24 oz", "display_size": "24 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_00b62c65-5d69-4d25-9227-4378dce55aa4.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_00b62c65-5d69-4d25-9227-4378dce55aa4.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "904", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [110077, 98270, 99687, 99685, 103666, 99750, 347654, 99528, 99627, 99606], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "103656", "display_name": "Oroweat Schwarzwalder Dark Rye Bread", "price": "4.49", "size": "16 oz", "display_size": "16 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_07bff947-4c52-4acd-8eea-73dcd086b898.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_07bff947-4c52-4acd-8eea-73dcd086b898.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "904", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [99751, 99847], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "99750", "display_name": "Oroweat Bread 100% Whole Wheat", "price": "3.99", "size": "24 oz", "display_size": "24 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/f19df394d895a687478822a02c07d1e4.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/f19df394d895a687478822a02c07d1e4.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "904", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [98270, 99705, 99601, 99687, 99755, 97920, 99746, 99538, 99703, 110077, 347654, 99627, 99685, 99517, 99606, 99528], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "103780", "display_name": "Thomas' Original English Muffins 6 Pk", "price": "4.39", "size": "12 oz", "display_size": "6 x 12 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_9c1c4d8a-4f07-4178-b592-add4655ba331.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_9c1c4d8a-4f07-4178-b592-add4655ba331.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "896", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [103879, 219601, 103779, 103872, 219609, 103862, 103781], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "99756", "display_name": "Oroweat Country Buttermilk Bread", "price": "3.99", "size": "24 oz", "display_size": "24 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_3761fd96-a312-4aad-b142-aeffd5998695.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_3761fd96-a312-4aad-b142-aeffd5998695.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "904", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [99705, 107318, 99687, 99686, 97920, 99805, 103709, 219396, 99627, 103945, 103769, 99750, 99847, 99891, 99804, 197282], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "103709", "display_name": "Van de Kamp's Enriched White Sandwich Bread", "price": "1.99", "size": "24 oz", "display_size": "24 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_723dc231-aef5-466b-9568-ad86f8117270.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_723dc231-aef5-466b-9568-ad86f8117270.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "904", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [99891, 107318, 103714, 99538, 103666, 103723], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "99805", "display_name": "Oroweat Double Fiber Bread", "price": "3.99", "size": "24 oz", "display_size": "24 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/8e116aeaeda149941359615c13295b6b.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/8e116aeaeda149941359615c13295b6b.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "904", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [98270, 99705, 107318, 99687, 99686, 97920, 103709, 99891, 99627, 103945, 103769, 99750, 219620, 219396, 99756, 99702], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "97920", "display_name": "Van de Kamp's Wheat Bread", "price": "1.99", "size": "24 oz", "display_size": "24 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_148eca36-2696-4a51-be6e-00c37b03273e.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_148eca36-2696-4a51-be6e-00c37b03273e.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "904", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [98270, 99705, 110077, 99687, 99606, 99517, 99685, 347654, 99627, 103945, 99538, 99750, 99746, 99703, 99601, 99528], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "103770", "display_name": "Sara Lee Deluxe Pre Sliced Plain Bagels", "price": "4.99", "size": "20 oz", "display_size": "6 x 20 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_8959e082-0374-409f-a91a-f878899439b4.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_8959e082-0374-409f-a91a-f878899439b4.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "140", "aisle_id": "896", "user_description": "", "featured": "false", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [103913, 197273, 219616, 106761, 103970, 103955, 103996, 103900, 103816], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "99113", "display_name": "Arrowhead Water Mountain Spring", "price": "3.99", "size": "16.9 oz", "display_size": "24 x 16.9 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_118f69ce-5273-4a20-b9a9-9f5ecc60e584.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_118f69ce-5273-4a20-b9a9-9f5ecc60e584.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "915", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [98971, 98412, 98303, 99398, 98343, 99312, 98304, 106143, 107386, 99269, 107166, 106169, 98418, 106201, 99283, 106132], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "98414", "display_name": "Coca Cola Classic", "price": "6.99", "size": "12 fl oz", "display_size": "20 x 12 fl oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_58bd645d-be54-4360-b14b-05cc8595f199.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_58bd645d-be54-4360-b14b-05cc8595f199.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "916", "user_description": "", "featured": "true", "taxable": "true", "is_alcoholic?": "false", "related_item_ids": [98479, 98518, 98472, 98501, 98417, 98419], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "99351", "display_name": "Coca Cola Diet Coke", "price": "1.69", "size": "2 L", "display_size": "2 L", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_9241b5be-991a-4bf7-833e-8232c56ba40c.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_9241b5be-991a-4bf7-833e-8232c56ba40c.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "916", "user_description": "", "featured": "true", "taxable": "true", "is_alcoholic?": "false", "related_item_ids": [106023, 105971, 105985, 98035, 106006, 219629, 105963, 98419, 98456, 98346, 98031, 99336, 106065, 98563, 98458, 98473], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "98263", "display_name": "Red Bull Sugarfree Energy Drink", "price": "5.99", "size": "4-8.4 oz", "display_size": "4 x 4-8.4 oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_8b9739e5-ddc4-44f4-8ab8-cb997cdbf94e.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_8b9739e5-ddc4-44f4-8ab8-cb997cdbf94e.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "951", "user_description": "", "featured": "true", "taxable": "true", "is_alcoholic?": "false", "related_item_ids": [99328, 98258, 106217, 106236, 98516, 98260, 106253, 98171, 98206, 98215, 98514, 98244, 98207, 98225, 98349, 98210], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "98032", "display_name": "Coca Cola Diet Cola", "price": "2.99", "size": "8-7.5 fl oz", "display_size": "8-7.5 fl oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_e8a47546-645a-42ec-964c-42ec70d67e72.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_e8a47546-645a-42ec-964c-42ec70d67e72.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "916", "user_description": "", "featured": "true", "taxable": "true", "is_alcoholic?": "false", "related_item_ids": [105971, 106006, 98035, 219629, 105963, 105987, 98101, 98563, 100485, 99351, 105922, 106065, 105928, 99336, 98474, 105889], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "98819", "display_name": "Snapple Diet Peach Iced Tea", "price": "5.99", "size": "96 fl oz", "display_size": "6 x 96 fl oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_0ec9b288-d5b5-489d-90ad-f0229ab753dc.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_0ec9b288-d5b5-489d-90ad-f0229ab753dc.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "914", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [105954, 99316, 106197, 105882, 106195, 357258, 106194, 105562, 98878, 99027, 99314, 99131, 107155, 98510, 98267, 98820], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "106024", "display_name": "Dr. Pepper Diet Dr Pepper", "price": "4.49", "size": "12 fl oz", "display_size": "12 x 12 fl oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_2b96711e-dd69-4ab5-8cb2-bda132488243.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_2b96711e-dd69-4ab5-8cb2-bda132488243.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "916", "user_description": "", "featured": "true", "taxable": "true", "is_alcoholic?": "false", "related_item_ids": [105971, 106018, 98035, 98473, 99336, 105951, 106085, 98563, 105985, 99351, 106006, 106065, 106072, 106023, 106026, 107370], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "102380", "display_name": "Arizona Green Tea with Ginseng and Honey", "price": "2.99", "size": "128 fl oz", "display_size": "128 fl oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_7f064b19-711b-4019-956c-cd245cecd6a7.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_7f064b19-711b-4019-956c-cd245cecd6a7.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "914", "user_description": "", "featured": "true", "taxable": "false", "is_alcoholic?": "false", "related_item_ids": [99132, 98925, 98896, 98164, 98510, 98830, 107171, 98157, 98511, 98987, 99150, 98789, 98782, 102247, 106199, 98991], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "98970", "display_name": "Gatorade All Stars Thirst Quencher Frost Glacier Freeze Sports Drink", "price": "4.99", "size": "12 fl oz", "display_size": "12 x 12 fl oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_b145e84d-4b64-40c2-9724-29488011eeea.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_b145e84d-4b64-40c2-9724-29488011eeea.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "951", "user_description": "", "featured": "true", "taxable": "true", "is_alcoholic?": "false", "related_item_ids": [98299, 98298, 98287, 98300, 99389], "wine_rating": "" }, { "purchaseQuantity": 0, "brand": "Driscoll's", "id": "98843", "display_name": "Glaceau Vitaminwater Zero Squeezed Lemonade", "price": "1.49", "size": "20 fl oz", "display_size": "20 fl oz", "warehouse_id": "6", "visible": "true", "primary_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/primary_8da3c78b-4fe9-486c-acce-b48bee6eeea3.jpg", "large_image_url": "https://d2lnr5mha7bycj.cloudfront.net/itemimage/image/large_8da3c78b-4fe9-486c-acce-b48bee6eeea3.jpg", "product_type": "normal", "unit": "each", "unlisted": "false", "sale_percent": "", "often_out_of_stock": "false", "department_id": "142", "aisle_id": "951", "user_description": "", "featured": "true", "taxable": "true", "is_alcoholic?": "false", "related_item_ids": [107407, 98995], "wine_rating": "" }];
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
        $templateCache.put("cart-item.html", "<div ng-if=\'!emptyProducts\'>\n  <ion-item class=\'card product-card\' ng-repeat=\'product in products track by $index\'>   <div class=\'item-avatar-left products\'>      <img ng-src=\'{{product.primary_image_url}}\' >    <div class='row'>   <div class='col'>{{product.display_name }}</div>      <div class='col'></div>     <div class='col'></div>       <div class='col'>₹ {{product.total}}</div>  </div>   <div class='row'>                   <div class='col'>                       <h3 class='product-unit'>MRP {{product.price}}  ₹  {{product.unit}}</h3>                       <h3 class='price_quantity '>  ₹ {{product.price}} |10 {{product.Discount}} %      </h3>  </div><div class='col'> <ul class='list-inline btn-click'> <li class='circle-btn' ng-click='removeProduct(product)'> - </li><li class='show_quantity ng-binding'>{{product.purchaseQuantity}}</li>  <li class='circle-btn' ng-click='addProduct(product)'>    +    </li> </ul>  </div>   </div></ion-item> </div>  </div>\n\n<div class=\'empty-cart-div\' ng-if=\'emptyProducts\'>\n  <h3 class=\'empty-cart-header\'>Your bag is empty!</h3>\n  <i class=\'icon ion-bag empty-cart-icon\'></i>\n</div>");
        $templateCache.put("checkout-footer.html", "<div class=\'title purchase-footer\'>Pay</div>");
        $templateCache.put("checkout.html", "\n<span class=\'checkout-form-description\'>Please enter your credit card details:</span>\n\n<div class=\'list checkout-form\'>\n  <checkout-name ng-if=\'hasNameDir\'></checkout-name>\n  <checkout-card></checkout-card>\n  <checkout-address ng-if=\'hasAddressDir\'></checkout-address>\n  <checkout-email ng-if=\'hasEmailDir\'></checkout-email>\n</div>\n\n<h2 class=\'checkout-total\'>Total: ₹{{total}}</h2>\n");
        $templateCache.put("gallery-item.html", "<div class=\'ion-gallery-content\'>\n  <div class=\'card gallery-card\' ng-repeat=\'product in products track by $index\'>\n    <div class=\'item gallery-item\'>\n      <div class=\'gallery-image-div\'>\n        <img ng-src=\'{{product.primary_image_url}}\' class=\'gallery-product-image\'>\n      </div>\n      <h3 class=\'gallery-product-title\'>{{product.display_name}}</h3>\n      <h3 class=\'gallery-product-price\'>₹{{product.price}} - {{product.size}}</h3>\n     <i class=\'icon ion-plus-round icon-plus-round\' mouse-down-up ng-click=\'addToCart(product)\'></i>\n         <span class=\'product-quantity\'>{{product.purchaseQuantity}}</span>\n      <i class=\'icon ion-minus-round icon-minus-round\' mouse-down-up ng-click=\'removeProduct(product)\'></i>\n\n           </div>\n    </div>\n  </div>\n</div>");
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