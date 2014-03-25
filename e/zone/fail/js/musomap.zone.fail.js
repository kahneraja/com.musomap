musomap.zone.fail = function(args){
    musomap.log('musomap.zone.fail');

    this.init();
    this.bind();
};

musomap.zone.fail.prototype.init = function() {
    musomap.log('musomap.zone.fail.init');
    this.$view = $('#bodyFrame #zoneFrame #failZone .failPage .view');
};

musomap.zone.fail.prototype.bind = function() {
    musomap.log('musomap.zone.fail.init');
};

musomap.zone.fail.prototype.show = function(error) {
    musomap.log('musomap.zone.fail.show');
    var error = decodeURIComponent(error);
    error = JSON.parse(error);
    $('.error', this.$view).html(error);
    this.$view.addClass('active');
};