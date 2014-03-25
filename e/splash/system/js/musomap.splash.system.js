musomap.splash.system = function(args){
    musomap.log('musomap.splash.system');

    this.init();
    this.bind();
};

musomap.splash.system.prototype.init = function() {
    musomap.log('musomap.splash.system.init');
    this.$view = $('#bodyFrame #splashFrame #systemSplash .systemPage .view');
};

musomap.splash.system.prototype.bind = function() {
    musomap.log('musomap.splash.system.init');
};

musomap.splash.system.prototype.show = function(message) {
    musomap.log('musomap.splash.system.show');
    $('.message', this.$view).html(message);
    this.$view.addClass('active');
    setTimeout(function(){
        musomap.client.splash.system.hide();
    }, 5000);
};

musomap.splash.system.prototype.hide = function(message) {
    musomap.log('musomap.splash.system.hide');
    this.$view.removeClass('active');
};