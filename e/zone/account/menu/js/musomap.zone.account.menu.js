musomap.zone.account.menu = function(args){
    musomap.log('musomap.zone.account.menu');
    this.init();
    this.bind();
};

musomap.zone.account.menu.prototype.init = function() {
    musomap.log('musomap.zone.account.menu.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .menuPage .view');
};

musomap.zone.account.menu.prototype.bind = function() {
    musomap.log('musomap.zone.account.menu.init');
    $('.environment', this.$view).bind('tap', function(){
        var active = $(this).hasClass('active');
        if (!active){
            musomap.client.environment('test');
        }else{
            musomap.client.environment('prod');
        }
    });
};

musomap.zone.account.menu.prototype.show = function() {
    musomap.log('musomap.zone.account.menu.show');
    this.$view.addClass('active');
    
    if(musomap.client.user === undefined || musomap.client.user.Collaborator == "1"){
        $('.collaborator').addClass('active');
    }else{
        $('.collaborator').removeClass('active');
    }
};
