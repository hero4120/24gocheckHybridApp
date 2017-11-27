﻿'use strict';

/**
* @ngdoc controller
* @name info.module.controller:InfoCtrl
* @requires $scope
* @requires $rootScope
* @requires $state
* @requires $stateParams
* @requires $localStorage
* @requires notificationService
* @requires LANGUAGES
*
* @description
* Shows the home page of info module. Contains user language switch which invokes a method
* defined in `rootScope`. Need to change `$scope.lanuages` variable if new languages are added or
* existing are removed.
*/
angular
    .module('info.module')
    .controller('InfoCtrl', function ($scope, $rootScope, $state, $stateParams, $localStorage, notificationService, LANGUAGES) {
        var vm = this;

        $scope.$on('$ionicView.enter', function () {

            $rootScope.$broadcast('i2csmobile.more');

            if ($stateParams.redirect) {
                $state.go("app.menu.info." + $stateParams.redirect);
                $stateParams.redirect = "";
            }
        });

        $scope.info = {};
        $localStorage.silent = $localStorage.silent || false;
        $scope.info.notifications = !$localStorage.silent;

        $scope.toggleNotifications = function () {
            if ($scope.info.notifications) {
                $localStorage.silent = false;
                notificationService.subscribeForPush();
            } else {
                $localStorage.silent = true;
                notificationService.unsubscribeFromPush();
            }
        };

        $scope.info.open_close_shop = "Mở";
        $scope.user.user_group_id = $localStorage.user.customer_group_id;
        $scope.user.customer_id = $localStorage.user.customer_id;


    });

/**
* @ngdoc controller
* @name info.module.controller:InfoOrdersCtrl
* @requires $scope
* @requires $ionicLoading
* @requires InfoService
* @description
* Shows the list of past orders of a logged in customer.
*/
angular
    .module('info.module')
    .controller('InfoOrdersCtrl', function ($scope, $ionicLoading, InfoService) {
        var vm = this;

        $ionicLoading.show();
        InfoService.GetOrders().then(function (data) {
            $scope.orders = data.orders;
            $ionicLoading.hide();
        }, function (data) {
            $ionicLoading.hide();
        });

    });

/**
* @ngdoc controller
* @name info.module.controller:InfoLoadOrderCtrl
* @requires $scope
* @requires $ionicLoading
* @requires $stateParams
* @requires InfoService
* @description
* Shows information and invoice of an order.
*/
angular
    .module('info.module')
    .controller('InfoLoadOrderCtrl', function ($scope, $ionicLoading, $stateParams, InfoService) {
        var vm = this;

        $ionicLoading.show();
        InfoService.GetOrder($stateParams.id).then(function (data) {
            $scope.products = data.products;
            $scope.totals = data.totals;

            $scope.invoice_no = data.invoice_no;
            $scope.order_id = data.order_id;
            $scope.date_added = data.date_added;
            $scope.shipping_address = data.shipping_address;
            $scope.shipping_method = data.shipping_method;

            $scope.histories = data.histories;

            $ionicLoading.hide();
        }, function (data) {
            $ionicLoading.hide();
        });
    });

/**
* @ngdoc controller
* @name shop.module.controller:InfoWishlistCtrl
* @requires $scope
* @requires $state
* @requires $ionicLoading
* @requires $ionicTabsDelegate
* @requires InfoService
* @description
* Display current wishlist.
*/
angular
    .module('info.module')
    .controller('InfoWishlistCtrl', function ($scope, $state, $ionicLoading, $ionicTabsDelegate, InfoService) {

        $scope.loadWishlist = function () {
            $ionicLoading.show();
            InfoService.GetWishlist().then(function (data) {
                $scope.items = data.products;
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            }, function (data) {
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
            })
        }

        $scope.refreshUI = function () {
            $scope.loadWishlist();
        }

        $scope.goToShop = function () {
            $ionicTabsDelegate.select(0);
        }

        $scope.removeItem = function (id) {
            $ionicLoading.show();
            InfoService.RemoveFromWishlist(id).then(function (data) {
                $scope.loadWishlist();
            }, function (data) {
                $scope.loadWishlist();
            });
        }

        $scope.$on('$ionicView.enter', function () {
            $scope.loadWishlist();
        });
    });



angular
  .module('info.module')
  .controller('InfoAccInfo', function ($scope, $rootScope, $http, locale, $state, $stateParams, $ionicPopup, $localStorage, notificationService,InfoService, LANGUAGES) {
    $scope.edit = $localStorage.user || {};

    $scope.edit.address_1 = $localStorage.user.user_address.address_1;
    $scope.edit.address_2 = $localStorage.user.user_address.address_2;
    // $scope.edit.email = $localStorage.user.email;
    // $scope.edit.firstname = $localStorage.user.firstname;
    // $scope.edit.telephone = $localStorage.user.telephone;
    // $scope.edit.address_1 = $localStorage.user.address_1;
    // $scope.edit.city = $localStorage.user.city;
    // $scope.edit.postal_code = $localStorage.user.postal_code;
    // $scope.edit.country_id = $localStorage.user.country_id;
    // $scope.edit.zone_id = $localStorage.user.zone_id;

    // var str = JSON.stringify($localStorage.user);
    // str = JSON.stringify($localStorage.user, null, 4); // (Optional) beautiful indented output.
    // console.log(str); // Logs output to dev tools console.
    // alert(str); // Displays output using window.alert()

    $scope.postEditData = function () {
      InfoService.EditCustomer($scope.edit).then(function (data) {
        // $scope.idea = data.cus_id;

        // alert("Done editing");
        $scope.validations = [];
        $scope.validations.editErrors = [];
        ["error_firstname","error_telephone","error_lastname","error_address_1","error_address_2"].forEach(function (e) {
          var msg = data[e];
          if (msg) {
            $scope.validations.editErrors.push(msg);
          }
        })

        if ($scope.validations.editErrors.length > 0) {
          $ionicPopup.alert({
            title: locale.getString('modals.registration_validations_title'),
            cssClass: 'desc-popup',
            scope: $scope,
            templateUrl: 'templates/popups/edit-validations.html'
          });
        } else {
          // if (data.customer_info) {
          //   $localStorage.user = data.customer_info;
          //   $rootScope.closeRegisterModal();
          //
          //   $ionicPopup.alert({
          //     title: locale.getString('modals.registered_title'),
          //     cssClass: 'desc-popup',
          //     scope: $scope,
          //     templateUrl: 'templates/popups/registered.html'
          //   });
          // }


          // alert('Done editing');

          // $state.reload();

          cordova.plugins.notification.local.schedule({
            title: 'Edit profile successfull',
            text: 'You profile has been edited at '+Date.now(),
            foreground: true
          });




        }
      });

    }


  });




angular
  .module('info.module')
  .controller('InfoFavCtrl', function ($scope, $localStorage, $rootScope, $stateParams, $ionicSlideBoxDelegate, ShopService) {
    var vm = this;
    $scope.endOfRLatestItems = false;
    $scope.loadingLatest = false;

    // sync form input to localstorage
    $localStorage.home = $localStorage.home || {};
    $scope.data = $localStorage.home;
    $scope.data.latestPage = 1;

    if (!$scope.data.slides)
      $scope.data.slides = [{ image: "app/shop/images/introcompany.png" }];

    $scope.refreshUI = function () {
      $scope.data.latestPage = 1;
      $scope.endOfRLatestItems = false;
      $scope.loadLatest(true);
      $scope.loadFeatured();
      //$scope.loadCategories();
      $scope.loadBanners();
    }

    $scope.loadBanners = function () {
      ShopService.GetBanners().then(function (data) {
        $scope.data.slides = data.main_banners;
        $scope.data.offers = data.offer_banner;
        $ionicSlideBoxDelegate.update();
      });
    }

    $scope.loadFeatured = function () {
      ShopService.GetFeaturedProducts().then(function (data) {
        $scope.data.featuredItems = data.products;
        $ionicSlideBoxDelegate.update();
      });
    }

    $scope.loadLatest = function (refresh) {
      if ($scope.loadingLatest) {
        return;
      }

      $scope.loadingLatest = true;
      $scope.data.latestItems = $scope.data.latestItems || [];

      ShopService.GetLatestProducts($scope.data.latestPage).then(function (data) {
        if (refresh) {
          $scope.data.latestItems = data.products;
          $scope.data.latestPage = 1;
        } else {
          if ($scope.data.latestPage == 1) {
            $scope.data.latestItems = [];
          }

          $scope.data.latestItems = $scope.data.latestItems.concat(data.products);
          $scope.data.latestPage++;
        }
        if (data.products && data.products.length < 1)
          $scope.endOfRLatestItems = true;
        $scope.loadingLatest = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      }, function (data) {
        $scope.loadingLatest = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

    $scope.loadNextRecentPage = function () {
      if (!$scope.endOfRLatestItems) {
        $scope.loadLatest();
      } else {
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    }

    $scope.$on('$ionicView.enter', function () {
      $ionicSlideBoxDelegate.update();
    });

    $scope.$on('i2csmobile.shop.refresh', function () {
      $scope.refreshUI();
    });

    $scope.loadFeatured();
    $scope.loadBanners();


  })

angular
  .module('info.module')
  .controller('InfoTutorialCtrl', function ($scope) {
  });

angular
  .module('info.module')
  .controller('InfoShopManageCtrl', function ($scope) {
  });
//
angular
  .module('info.module')
  .controller('InfoEditShopInfoCtrl', function ($scope) {
  });

angular
  .module('info.module')
  .controller('InfoViewProductCtrl', function ($scope, $localStorage, $rootScope, $stateParams, $ionicSlideBoxDelegate, ShopService) {

    $scope.page = 1;
    $scope.endOfItems = true;
    $scope.loadingItems = false;

    $scope.items = [];

    // $scope.badges = [];

    $scope.loadItems = function () {
      if ($scope.loadingItems) {
        return;
      }

      $scope.loadingItems = true;
      $scope.items = $scope.items || [];


      ShopService.GetProductsByUserId($rootScope.userId(), $scope.page).then(function (data) {
        $scope.items = $scope.items.concat(data.products);
        // if($scope.user_info == undefined){
        //   $scope.user_info = data.user_info;
        //
        //   $scope.badges.push(data.user_info.badge1);
        //   $scope.badges.push(data.user_info.badge2);
        //   $scope.badges.push(data.user_info.badge3);
        //   $scope.badges.push(data.user_info.badge4);
        //   $scope.badges.push(data.user_info.badge5);
        //
        // }
        $scope.text_empty = data.text_empty;
        // $ionicScrollDelegate.resize();
        $scope.page++;
        console.log("From page: "+$scope.page);
        if (data.products.length < 1)
          $scope.endOfItems = true;
        else
          $scope.endOfItems = false;
        $scope.loadingItems = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }, function (data) {
        $scope.loadingItems = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
      });

    }
    $scope.loadItems();

    $scope.loadNextPage = function () {
      if (!$scope.endOfItems) {
        $scope.loadItems();
      } else {
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.$broadcast('scroll.refreshComplete');
      }
    }

  });

angular
  .module('info.module')
  .controller('InfoAddProductCtrl', function ($scope, $cordovaCamera, $localStorage, $ionicPopup, locale, CartService, InfoService, ShopService) {

    $scope.cates = [];
    ShopService.GetCategories().then(function (data) {

      $scope.cates = data.categories;


      // $ionicLoading.hide();
    }, function (data) {
      // $ionicLoading.hide();
    });

    $scope.takeImage = function() {
      var options = {
        quality: 80,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 250,
        targetHeight: 250,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: false
      };

      $cordovaCamera.getPicture(options).then(function(imageData) {
        $scope.srcImage = "data:image/jpeg;base64," + imageData;
      }, function(err) {
        // error
      });
    }

    // $scope.shika = function () {
    //   alert('Source image '+ $scope.srcImage);
    // }

    $scope.countryChanged = function () {
      // $ionicLoading.show();

      // save payment methods
      CartService.LoadZones($scope.register['country_id']).then(function (data) {
        // $ionicLoading.hide();
        $scope.zones = data.zones;

      }, function (data) {
        alert(locale.getString('modals.error_loading_zones'));
        // $ionicLoading.hide();
      });
    }




    $scope.add ={};
    $scope.add.user_id = $localStorage.user.user_id;
    $scope.add.product_location = $localStorage.user.user_address.address_1;
    $scope.postProductData = function () {

      $scope.validations =[];
      // sync user data to localstorage

      if ($scope.forms.addProductForm.$invalid) {
        $ionicPopup.alert({
          title: locale.getString('modals.registration_validations_title'),
          cssClass: 'desc-popup',
          scope: $scope,
          templateUrl: 'templates/popups/add-product-validation.html'
        });
      } else {

        InfoService.AddProductByUser($scope.add).then(function (data) {
          $scope.validations.createErrors = [];
          ["error_product_name", "error_product_price", "error_product_quantity", "error_product_description", "error_product_weight", "error_product_meta_title", "error_product_model"].forEach(function (e) {
            var msg = data[e];
            if (msg) {
              $scope.validations.createErrors.push(msg);
            }
          })

          if ($scope.validations.createErrors.length > 0) {
            $ionicPopup.alert({
              title: locale.getString('modals.registration_validations_title'),
              cssClass: 'desc-popup',
              scope: $scope,
              templateUrl: 'templates/popups/add-product-validation.html'
            });

            // alert('Length'+ $scope.validations.createErrors.length);
          } else {
            // var str = JSON.stringify($scope.add);
            // str = JSON.stringify($scope.add, null, 4); // (Optional) beautiful indented output.
            // console.log(str); // Logs output to dev tools console.
            // alert(str); // Displays output using window.alert()
            alert('Well done');

          }


        }, function (data) {
          alert('Cant do shit');
        });
      }
    }








  })

  .run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  });

angular
  .module('info.module')
  .controller('InfoOrderManageCtrl', function ($scope) {
  });
