musomap.zone.login = function(args){
    musomap.log('musomap.zone.login');

    this.init();
    this.bind();
};

musomap.zone.login.prototype.init = function() {
    musomap.log('musomap.zone.login.init');
    this.method = new musomap.zone.login.method();
    this.regular = new musomap.zone.login.regular();
    this.twitter = new musomap.zone.login.twitter();
    this.facebook = new musomap.zone.login.facebook();
    this.commit = new musomap.zone.login.commit();
    
};

musomap.zone.login.prototype.bind = function() {
    musomap.log('musomap.zone.login.init');
};

musomap.zone.login.prototype.show = function() {
    var hash = window.location.hash;
    if (hash == '#/login/method') {
        musomap.client.zone.login.method.show();
    }
    else if (hash == '#/login/regular') {
        musomap.client.zone.login.regular.show();
    }
    else if (hash == '#/login/facebook') {
        musomap.client.zone.login.facebook.show();
    }
    else if (hash == '#/login/twitter') {
        musomap.client.zone.login.twitter.show();
    }
    else if (hash == '#/login/commit') {
        musomap.client.zone.login.commit.show();
    }
};