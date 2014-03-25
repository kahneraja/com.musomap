musomap.zone.log = function(args){
    musomap.log('musomap.zone.log');

    this.init();
    this.bind();
};

musomap.zone.log.prototype.init = function() {
    musomap.log('musomap.zone.log.init');
    this.$view = $('#bodyFrame #zoneFrame #logZone #logPage #logView');
};

musomap.zone.log.prototype.bind = function() {
    musomap.log('musomap.zone.log.bind');
};

musomap.zone.log.prototype.show = function() {
    this.$view.addClass('active');
};

musomap.zone.log.prototype.write = function(message) {
    var html = '<div>'+message+'</div>';
    $('#list', this.$view).prepend(html);
};