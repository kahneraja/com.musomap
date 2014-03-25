musomap.splash.intro = function(args){
    musomap.log('musomap.splash.intro');

    this.init();
    this.bind();
};

musomap.splash.intro.prototype.init = function() {
    musomap.log('musomap.splash.intro.init');
    this.$view = $('#bodyFrame #splashFrame #introSplash .introPage .view');
};

musomap.splash.intro.prototype.bind = function() {
    musomap.log('musomap.splash.intro.init');
};

musomap.splash.intro.prototype.show = function(error) {
    musomap.log('musomap.splash.intro.show');
    this.$view.addClass('active');
};

musomap.splash.intro.prototype.hide = function(error) {
    musomap.log('musomap.splash.intro.show');
    this.$view.removeClass('active');
};