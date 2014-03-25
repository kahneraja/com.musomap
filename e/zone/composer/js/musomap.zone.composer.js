musomap.zone.composer = function(args){
    musomap.log('musomap.zone.composer');

    this.init();
    this.bind();
};

musomap.zone.composer.prototype.init = function() {
    musomap.log('musomap.zone.composer.init');
};

musomap.zone.composer.prototype.bind = function() {
    musomap.log('musomap.zone.composer.init');
};

musomap.zone.composer.prototype.show = function(label) {
    musomap.log('musomap.zone.composer.show');
    musomap.client.splash.composer.show(label);
};