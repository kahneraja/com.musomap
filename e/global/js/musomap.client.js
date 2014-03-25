musomap.client = function(args) {
    musomap.log('musomap.client');

    this.init();
    this.bind();
};

musomap.client.prototype.init = function() {
    musomap.log('musomap.client.init');

    // iScroll
    musomap.iScrollCollection = new Array();
    $('.iScroll').each(function(i){
        var newID = 'iScroll' + i;
        $(this).attr('id', newID);
        var height = $('#pullDown', this).height();
        var scroller = new iScroll(newID, { topOffset: height, checkDOMChanges: true, useTransition: true });
        musomap.iScrollCollection.push(scroller);
    });  
    
    this.viewport = {
        width  : $(window).width(),
        height : $(window).height()
    };    

    // init object
    this.header = new musomap.header();
    this.zone = new musomap.zone();
    this.splash = new musomap.splash();
    this.notification = new musomap.notification();
    
    this.environment();

    this.debug = true;
    this.desktop = false;
    if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
        this.desktop = true;
    }
    
};

musomap.client.prototype.bind = function() {
    musomap.log('musomap.client.bind');

    // window hash location
    $(window).on('hashchange', function() {
        musomap.client.show();
    });
    
    // back
    document.addEventListener("backbutton", function(e){
        musomap.client.back();
    }, false);
    document.addEventListener("menubutton", function(e){
        if (musomap.client.user !== undefined){
            window.location.href = '#/account/menu';
        }
    }, false);

    // textarea height
    $('textarea').bind('keypress change', function() {
        var height = $(this).outerHeight();
        var scrollHeight = $(this)[0].scrollHeight;
        if (scrollHeight > height && scrollHeight > 0) {
            $(this).height(scrollHeight + 20);
        }  
    });  
    
    // option buttons
    $('.optionButton').bind('tap', function(){
        var active = $(this).hasClass('active');
        if (active){
            $(this).removeClass('active');
        }else{
            $(this).addClass('active');
        }
    });
    
    musomap.rebindTap('div[data-href]');
};

musomap.client.prototype.back = function() {
    musomap.log('musomap.client.back');
    if (window.location.hash == '' || window.location.hash == '#/feed/'){
        // exit
        navigator.app.exitApp();
    }else{
        if (musomap.client.user === undefined){
            // home
            window.location.href = '#';
        }else{
            // back
            if (typeof (navigator.app) !== "undefined") {
                navigator.app.backHistory();
            } else {
                window.history.back();
            }            
        }
    }
};

musomap.client.prototype.hideAllViews = function() {
    $(".view").removeClass('active');
   
};


musomap.client.prototype.start = function() {
    musomap.log('musomap.client.start');
    
    // init user
    this.restoreUser();

    // start
    this.show();
    
    // load 3rd party scripts.
    $.getScript('https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=musomap.client.googleCallback');
};

musomap.client.prototype.googleCallback = function() {
    musomap.log('musomap.client.googleCallback');
};

musomap.client.prototype.show = function() {
    musomap.log('musomap.client.show: ' + window.location.hash);

    var hash = window.location.hash;
    
    this.hideAllViews();
    $(window).scrollTop(0);
    musomap.client.header.updateComposer();         
    
    if (hash === '' && this.user === undefined){
        musomap.client.splash.intro.show();
    }else{
        musomap.client.zone.show();
    }
};

musomap.client.prototype.restoreUser = function() {
    musomap.log('musomap.client.restoreUser');
    var user = window.localStorage.getItem('user');
    if (user !== null){
        this.user = JSON.parse(user);
        this.header.showProfile();        
    }
};

musomap.client.prototype.login = function(user) {
    window.localStorage.setItem('user', JSON.stringify(user));
    this.restoreUser();
    this.zone.notify.refresh();    
};

musomap.client.prototype.logout = function(user) {
    this.user = undefined;
    window.localStorage.clear();  
    musomap.client.header.emptyProfile();
};

musomap.client.prototype.environment = function(type) {
    musomap.log('musomap.client.environment');
    
    this.baseDomain = 'http://www.musomap.com';
    this.webroot = 'http://phonegap.musomap.com';
        
    if (type === undefined && location.hostname == 'testphonegap.musomap.com'){
        this.baseDomain = 'http://test.musomap.com';
        this.webroot = 'http://testphonegap.musomap.com';    
    } else if (type == 'test'){
        this.baseDomain = 'http://test.musomap.com';
        this.webroot = 'http://testphonegap.musomap.com';     
    }
};
