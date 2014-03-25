musomap.splash = function(args){
    musomap.log('musomap.splash');

    this.init();
    this.bind();
};

musomap.splash.prototype.init = function() {
    musomap.log('musomap.splash.init');
    this.intro = new musomap.splash.intro();
    this.composer = new musomap.splash.composer();
    this.loading = new musomap.splash.loading();
    this.settings = new musomap.splash.settings();
    this.system = new musomap.splash.system();
}; 

musomap.splash.prototype.bind = function() {
    musomap.log('musomap.splash.init');
};
