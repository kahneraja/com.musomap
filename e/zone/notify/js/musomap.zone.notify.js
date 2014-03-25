musomap.zone.notify = function(args){
    musomap.log('musomap.zone.notify');

    this.init();
    this.bind();
};

musomap.zone.notify.prototype.init = function() {
    musomap.log('musomap.zone.notify.init');
    this.$view = $('#bodyFrame #zoneFrame #notifyZone #notifyPage #notifyView');
    this.active = false;
};

musomap.zone.notify.prototype.bind = function() {
    musomap.log('musomap.zone.notify.init');
    // scroller
    var scrollerID = $('.iScroll', this.$view).attr('id');
    for(var i = 0; i < musomap.iScrollCollection.length; i++){
        var scroller = musomap.iScrollCollection[i];
        if (scroller.wrapper.id == scrollerID){
            this.scroller = scroller;
        }
    }
    if (this.scroller !== undefined){
        this.scroller.options.onScrollMove = function(){
            if (musomap.client.zone !== undefined){
                musomap.client.zone.notify.scrollMove();
            }
        };
        this.scroller.options.onScrollEnd = function(){
            if (musomap.client.zone !== undefined){
                musomap.client.zone.notify.scrollEnd();
            }
        };
        var pullDownOffset = $('#pullDown', this.$view).height();
        this.scroller.topOffset = -pullDownOffset;
    }
};

musomap.zone.notify.prototype.show = function(error) {
    musomap.log('musomap.zone.notify.show');
    this.$view.addClass('active');
};

musomap.zone.notify.prototype.refresh = function(){
    musomap.log('musomap.zone.notify.refresh');
    musomap.client.splash.loading.show();
    this.active = true;
    var url = musomap.client.webroot + "/json/notification/pending.php";
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;

    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(notifications) {
            // success
            musomap.client.zone.notify.renderNotifications(notifications);
        },
        error: function(Response) {
            // error
            musomap.client.splash.system.show(Response.responseText);
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }        
    });    
};

musomap.zone.notify.prototype.renderNotifications = function(notifications) {
    musomap.log('musomap.news.notify.renderNotifications');

    this.clear();

    var pending = false;
    for (var i = 0; i < notifications.length; i++) {
        this.renderNotification(notifications[i]);
        if (notifications[i].Pending == '1'){
            pending = true;
        }
    }

    // nothing found!?
    if (notifications.length == 0){
        var notification = {};
        notification.Message = "Stay tuned. We'll be sharing local here soon.";
        notification.DateCreated = '';
        this.renderNotification(notification);
    }
    
    if (pending){
        window.location.href = '#/notify';
    }

    // exit
    musomap.rebindTap(this.$view.selector + ' div[data-href]');
    this.rebind();
    $('.timeago', this.$view).timeago();
};

musomap.zone.notify.prototype.clear = function(message) {
    $('#list .notification', this.$view).remove();
};

musomap.zone.notify.prototype.renderNotification = function(notification) {
    var template = $('#template', this.$view).clone();
    
    var html = musomap.renderLinks(notification.Message);
    $('.message .body', template).html(html);
    $('.message .timeago', template).attr('data-datetime', notification.DateCreated);
    $('#list', this.$view).prepend($('.notification', template));    

    // append
    $('#stream #list', this.$view).append(template.html());
};

musomap.zone.notify.prototype.scrollEnd = function(){
    musomap.log('musomap.zone.notify.scrollEnd');
    var active = $('#pullDown', this.$view).hasClass('active'); 
    // refresh
    if (active){
        musomap.client.zone.notify.refresh();
        $('#pullDown', this.$view).attr('class', '');
        $('#pullDown #label', this.$view).html('Pull down to refresh...');        
    }
};

musomap.zone.notify.prototype.scrollMove = function(){
    var loading = $('#pullDown', this.$view).hasClass('loading'); 
    if (this.scroller.y > 5){
        $('#pullDown #label', this.$view).html('Release to refresh...');
        $('#pullDown', this.$view).addClass('active');
        this.scroller.minScrollY = 0;
    }else if (!loading){
        $('#pullDown #label', this.$view).html('Pull down to refresh...');
        $('#pullDown', this.$view).removeClass('active');
        this.scroller.minScrollY = this.scroller.topOffset;
    }
};

musomap.zone.notify.prototype.rebind = function(notification) {
    $('#list .notification', this.$view).bind('tap', function(){
        var $label = $('.label', this).first();
        window.location.href = $label.attr('data-href');
        
    });
};