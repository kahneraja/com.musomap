musomap.zone.account.confirm = function(args){
    musomap.log('musomap.zone.account.confirm');
    this.init();
    this.bind();
};

musomap.zone.account.confirm.prototype.init = function() {
    musomap.log('musomap.zone.account.confirm.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .confirmPage .view');
};

musomap.zone.account.confirm.prototype.bind = function() {
    musomap.log('musomap.zone.account.confirm.init');
};

musomap.zone.account.confirm.prototype.fill = function(reference) {
    musomap.log('musomap.zone.account.confirm.fill');
    this.reference = reference;
};

musomap.zone.account.confirm.prototype.show = function() {
    musomap.log('musomap.zone.account.confirm.show');
    this.$view.addClass('active');
    if (this.reference !== undefined)
    {
        $('#reference', this.$view).html(this.reference);
    }
};
