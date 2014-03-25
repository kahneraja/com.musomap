musomap.zone.signup = function(args){
    musomap.log('musomap.zone.signup');
    this.init();
    this.bind();
};

musomap.zone.signup.prototype.init = function() {
    musomap.log('musomap.zone.signup.init');
    
    this.method = new musomap.zone.signup.method();
    this.regular = new musomap.zone.signup.regular();
    this.twitter = new musomap.zone.signup.twitter();
    this.facebook = new musomap.zone.signup.facebook();
    this.locate = new musomap.zone.signup.locate();
    this.confirm = new musomap.zone.signup.confirm();
    this.commit = new musomap.zone.signup.commit();
};

musomap.zone.signup.prototype.bind = function() {
    musomap.log('musomap.zone.signup.init');
};

musomap.zone.signup.prototype.show = function() {
    var hash = window.location.hash;
    if (hash == '#/signup/method') {
        musomap.client.zone.signup.method.show();
    }
    else if (hash == '#/signup/regular') {
        musomap.client.zone.signup.regular.show();
    }
    else if (hash == '#/signup/locate') {
        musomap.client.zone.signup.locate.show();
    }
    else if (hash == '#/signup/commit') {
        musomap.client.zone.signup.commit.show();
    }
    else if (hash == '#/signup/confirm') {
        musomap.client.zone.signup.confirm.show();
    }
    else if (hash == '#/signup/facebook') {
        musomap.client.zone.signup.facebook.show();
    }
    else if (hash == '#/signup/twitter') {
        musomap.client.zone.signup.twitter.show();
    }
};