musomap.header = function(args){
    musomap.log('musomap.header');

    this.init();
    this.bind();
};

musomap.header.prototype.init = function() {
    musomap.log('musomap.header.init');
    // load template
    this.$view = $('#headerFrame');
    this.show();
};

musomap.header.prototype.bind = function() {
    musomap.log('musomap.header.bind');
    
    $('#menu #local #button', this.$view).bind('tap', function(e){
        var active = $(this).hasClass('active');
        if (active){
            $(this).removeClass('active');
        }else{
            $(this).addClass('active');
        }
        musomap.client.zone.feed.setLocalOnly(!active);
    });
    
    $('#badge', this.$view).bind('tap', function(e){
        musomap.client.zone.feed.scrollTop();
    });

};

musomap.header.prototype.show = function() {
    musomap.log('musomap.header.show');
    this.$view.addClass('active');
};

musomap.header.prototype.showProfile = function() {
    musomap.log('musomap.header.showProfile');
    // update badge
    $('#badge [data-href]', this.$view).attr('data-href', '#/feed/');
    
    // update profile
    $('#profile #home', this.$view).attr('data-href', '#/profile/' + musomap.client.user.Label);
    var image = musomap.client.baseDomain + '/i/image/profile/dynamic/' + musomap.client.user.Reference + '_30x30.jpg';
    $('#profile #home img', this.$view).attr('src', image);
    $('#profile', this.$view).addClass('active');

    // show menu
    $('#menu', this.$view).addClass('active');
    musomap.client.zone.resizeFrame();
};

musomap.header.prototype.emptyProfile = function() {
    musomap.log('musomap.header.emptyProfile');
    // update badge
    $('#badge [data-href]', this.$view).attr('data-href', '#');
    
    // update profile
    $('#profile #home', this.$view).attr('data-href', '');
    var image = '';
    $('#profile #home img', this.$view).attr('src', image);
    $('#profile', this.$view).removeClass('active');

    // show menu
    $('#menu', this.$view).removeClass('active');
    musomap.client.zone.resizeFrame();
};

musomap.header.prototype.hide = function() {
    musomap.log('musomap.header.hide');
    this.$view.removeClass('active');
};

musomap.header.prototype.updateComposer = function() {
    var hash = window.location.hash;
    var label = '';
    if (hash.indexOf("#/profile/") > -1) {
        label = hash.replace("#/profile/", "");
    }
    
    $('#action #profile #composer #button', this.$view).attr('data-href', '#/composer/' + label);
};
