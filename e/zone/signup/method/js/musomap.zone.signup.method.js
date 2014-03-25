musomap.zone.signup.method = function(args){
    musomap.log('musomap.zone.signup.method');
    this.init();
    this.bind();
};

musomap.zone.signup.method.prototype.init = function() {
    musomap.log('musomap.zone.signup.method.init');
    this.$view = $('#bodyFrame #zoneFrame #signupZone .methodPage .view');
};

musomap.zone.signup.method.prototype.bind = function() {
    musomap.log('musomap.zone.signup.method.init');
};

musomap.zone.signup.method.prototype.show = function() {
    musomap.log('musomap.zone.signup.method.show');
    this.$view.addClass('active');
    
    // bind notifications
    musomap.client.notification.bind();        
};
