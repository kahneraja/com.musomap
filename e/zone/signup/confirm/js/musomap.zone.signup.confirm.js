musomap.zone.signup.confirm = function(args){
    musomap.log('musomap.zone.signup.confirm');
    this.init();
    this.bind();
};

musomap.zone.signup.confirm.prototype.init = function() {
    musomap.log('musomap.zone.signup.confirm.init');
    this.$view = $('#bodyFrame #zoneFrame #signupZone .confirmPage .view');
};

musomap.zone.signup.confirm.prototype.bind = function() {
    musomap.log('musomap.zone.signup.confirm.init');
};

musomap.zone.signup.confirm.prototype.fill = function(reference) {
    musomap.log('musomap.zone.signup.confirm.fill');
    this.reference = reference;
};

musomap.zone.signup.confirm.prototype.show = function() {
    musomap.log('musomap.zone.signup.confirm.show');
    this.$view.addClass('active');
    if (this.reference !== undefined)
    {
        $('.reference', this.$view).html(this.reference);
    }
};
