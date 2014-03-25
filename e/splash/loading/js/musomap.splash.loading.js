musomap.splash.loading = function(args){
    musomap.log('musomap.splash.loading');

    this.init();
    this.bind();
};

musomap.splash.loading.prototype.init = function() {
    musomap.log('musomap.splash.loading.init');
    this.$view = $('#bodyFrame #splashFrame #loadingSplash .loadingPage .view');
    this.stackIndex = 0;
};

musomap.splash.loading.prototype.bind = function() {
    musomap.log('musomap.splash.loading.init');
};

musomap.splash.loading.prototype.show = function(error) {
    musomap.log('musomap.splash.loading.show');
    this.stackIndex++;
    this.$view.addClass('active');
};

musomap.splash.loading.prototype.hide = function(error) {
    musomap.log('musomap.splash.loading.show');
    this.stackIndex--;
    if (this.stackIndex <= 0){
        this.stackIndex = 0;
        this.$view.removeClass('active');
    }
};