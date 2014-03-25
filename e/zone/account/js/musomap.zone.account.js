musomap.zone.account = function(args){
    musomap.log('musomap.zone.account');
    
    this.init();
    this.bind();
};

musomap.zone.account.prototype.init = function() {
    musomap.log('musomap.zone.account.init');
    this.menu = new musomap.zone.account.menu();
    this.logout = new musomap.zone.account.logout();
    this.bio = new musomap.zone.account.bio();
    this.confirm = new musomap.zone.account.confirm();
    this.locate = new musomap.zone.account.locate();
    this.email = new musomap.zone.account.email();
    this.password = new musomap.zone.account.password();
    this.notify = new musomap.zone.account.notify();
    this.destroy = new musomap.zone.account.destroy();
};

musomap.zone.account.prototype.bind = function() {
    musomap.log('musomap.zone.account.bind');
};

musomap.zone.account.prototype.show = function() {

    var hash = window.location.hash;
    if (hash == '#/account/menu') {
        musomap.client.zone.account.menu.show();
    }
    else if (hash == '#/account/logout') {
        musomap.client.zone.account.logout.show();
    }
    else if (hash == '#/account/bio') {
        musomap.client.zone.account.bio.show();
    } 
    else if (hash == '#/account/confirm') {
        musomap.client.zone.account.confirm.show();
    } 
    else if (hash == '#/account/locate') {
        musomap.client.zone.account.locate.show();
    } 
    else if (hash == '#/account/email') {
        musomap.client.zone.account.email.show();
    } 
    else if (hash == '#/account/password') {
        musomap.client.zone.account.password.show();
    } 
    else if (hash == '#/account/notify') {
        musomap.client.zone.account.notify.show();
    }
    else if (hash == '#/account/destroy') {
        musomap.client.zone.account.destroy.show();
    }

};