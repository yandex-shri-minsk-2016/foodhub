var _ = require('lodash');

angular.module('Foodhub').component('sessionInfo', {
  bindings: {
    'title': '<',
    'shops': '<',
    'session': '=',
    'readonly': '<'
  },
  template: require('./session_info.html'),

  controller: function($scope, $attrs, $timeout) {
    this.selectUniqID = Math.random().toString(36).substring(10);

    this.validateTime = function(time) {
      var regexp = /^(\d{1,2}):(\d{1,2})$/,
        timeParts = regexp.exec(time);
      if (timeParts) {
        var hours = parseInt(timeParts[1]),
          minutes = parseInt(timeParts[2]);
        return 0 <= hours && hours <= 23 && 0 <= minutes && minutes <= 59;
      } else {
        return false;
      }
    };

    this.getTotalPrice = function() {
      if (!this.session) return;
      this.session.price = _.sumBy(this.session.orders, 'price');
      return this.session.price;
    };

    this.onShopChanged = function() {
      if (!this.selectedShop || !this.session) return;
      this.session.shopId = this.selectedShop.id;
    };

    this.getTimeLabel = function() {
      if (!this.session) return;
      return this.session.deliveryTime ? 'Время прибытия заказа:' : 'Время оформления заказа:';
    };

    this.getRemainAmount = function() {
      if (!this.selectedShop || !this.session) return;
      return this.session.price < this.selectedShop.minOrderPrice ? this.selectedShop.minOrderPrice - this.session.price : 0;
    };

    this.init = function() {
      if (!this.shops || !this.session) return;

      this.sessionTime = this.session.deliveryTime ? this.session.deliveryTime : this.session.orderTime;

      var index = this.shops.map(function(shop) { return shop.id; }).indexOf(this.session.shopId);
      if (index !== -1) {
        this.selectedShop = this.shops[index];
      } else {
        this.selectedShop = this.shops[0];
        this.session.shopId = this.selectedShop.Id;
      }
      this.session.valid = true;
      this.session.invalidTime = false;
    };

    this.onSessionTimeChanged = function() {
      if (!this.session) return;
      if (this.validateTime(this.sessionTime)) {
        if (this.session.deliveryTime) {
          this.session.deliveryTime = this.sessionTime;
        } else {
          this.session.orderTime = this.sessionTime;
        }
        this.session.valid = true;
        this.session.invalidTime = false;
      } else {
        this.session.valid = false;
        this.session.invalidTime = true;
      }
    };

    $scope.$on('initSessionInfo', function() {
      $timeout(function() { this.init() }.bind(this));      
    }.bind(this));
  }
});
