musomap.splash.settings = function(args){
    musomap.log('musomap.splash.settings');

    this.init();
    this.bind();
};

musomap.splash.settings.prototype.init = function() {
    musomap.log('musomap.splash.settings.init');
    this.$view = $('#bodyFrame #splashFrame #settingsSplash .settingsPage .view');
};

musomap.splash.settings.prototype.bind = function() {
    musomap.log('musomap.splash.settings.init');
};

musomap.splash.settings.prototype.show = function(error) {
    musomap.log('musomap.splash.settings.show');
    this.$view.addClass('active');
};