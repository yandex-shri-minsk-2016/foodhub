var _ = require('lodash');

var moment = require('moment/min/moment-with-locales.js');
moment.locale('ru');

angular.module('Foodhub')
  .controller('SessionListPageController', ['$scope', 'Sessions', '$rootScope', '$filter', function($scope, Sessions, $rootScope, $filter) {

    $scope.timeFromNow = function(date) {
      var timeLeft = moment(date);
      if (date > new Date()) {
        return timeLeft.fromNow(true);
      } else {
        return 0;
      }
    };

    $scope.getSessions = function() {
      return _.map($scope.sessions, function(session) {
        var shop = _.find($scope.shops, { id: session.shopId });
        return {
          id: session.id,
          image: shop.logoUrl,
          deliveryUrl: shop.siteUrl,
          deliveryTimetable: shop.deliveryTime,
          minimalDeliveryPrice: shop.minOrderPrice,
          authorName: session.owner.firstName + ' ' + session.owner.lastName,
          orderTime: moment(new Date(session.orderTime)).format('LT'),
          deliveryTime: session.deliveryTime ? moment(new Date(session.deliveryTime)).format('LT') : null,
          orderTimeLeft: session.deliveryTime ? $scope.timeFromNow(new Date(session.orderTime)) : $scope.timeFromNow(new Date(session.orderTime)),
          totalPrice: session.price,
          priceLeft: session.price < shop.minOrderPrice ? shop.minOrderPrice - session.price : 0
        };
      });
    };

    $scope.init = function() {
      $rootScope.getShops().then(function(shops) {
        $scope.shops = shops;
        return Sessions.getSessions();
      }).then(function(response) {
        $scope.sessions = response.sessions;
        $scope.mappedSessions = $scope.getSessions();
      });
    };

    $scope.init();
  }]);
