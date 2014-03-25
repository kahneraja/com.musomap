musomap.zone.login.method = function(args){
    musomap.log('musomap.zone.login.method');
    this.init();
    this.bind();
};

musomap.zone.login.method.prototype.init = function() {
    musomap.log('musomap.zone.login.method.init');
    this.$view = $('#bodyFrame #zoneFrame #loginZone .methodPage .view');
};

musomap.zone.login.method.prototype.bind = function() {
    musomap.log('musomap.zone.login.method.init');
};

musomap.zone.login.method.prototype.show = function() {
    musomap.log('musomap.zone.login.method.show');
    this.$view.addClass('active');
    
    // bind notifications
    musomap.client.notification.bind();
};
