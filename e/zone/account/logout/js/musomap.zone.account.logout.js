musomap.zone.account.logout = function(args){
    musomap.log('musomap.zone.account.logout');
    this.init();
    this.bind();
};

musomap.zone.account.logout.prototype.init = function() {
    musomap.log('musomap.zone.account.logout.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .logoutPage .view');
};

musomap.zone.account.logout.prototype.bind = function() {
    musomap.log('musomap.zone.account.logout.bind');
};

musomap.zone.account.logout.prototype.show = function() {
    musomap.log('musomap.zone.account.logout.show');
    this.$view.addClass('active');
    musomap.client.logout();
    musomap.client.zone.notify.clear();
    window.location.href = '#';
};
