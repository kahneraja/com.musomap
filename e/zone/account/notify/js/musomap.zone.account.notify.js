musomap.zone.account.notify = function(args){
    musomap.log('musomap.zone.account.notify');
    this.init();
    this.bind();
};

musomap.zone.account.notify.prototype.init = function() {
    musomap.log('musomap.zone.account.notify.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .notifyPage .view');
};

musomap.zone.account.notify.prototype.bind = function() {
    musomap.log('musomap.zone.account.notify.init');
    $('.submit', this.$view).bind('tap', function(){
       musomap.client.zone.account.notify.save();
    });
};

musomap.zone.account.notify.prototype.show = function() {
    musomap.log('musomap.zone.account.notify.show');
    this.lookup();
    this.$view.addClass('active');
};

musomap.zone.account.notify.prototype.lookup = function(){
    musomap.log('musomap.zone.feed.getProfile');

    var url = musomap.client.webroot + "/json/account/profile/lookup.php";
    
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;
    
    musomap.client.splash.loading.show();
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(profile) {
            // success
            musomap.client.zone.account.notify.fill(profile);
        },
        error: function(Response) {
            // error
            window.location.href = '#/fail/' + Response.responseText;
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }        
    });    
};

musomap.zone.account.notify.prototype.fill = function(profile) {
    musomap.log('musomap.zone.account.notify.fill');
    $('input', this.$view).val(profile.notify);
    if(profile.Notify == "1"){
        $('.notify', this.$view).addClass('active');
    }
    
    if(profile.WeeklyDigest == "1"){
        $('.weeklyDigest', this.$view).addClass('active');
    }
};

musomap.zone.account.notify.prototype.save = function(){
    musomap.log('musomap.zone.account.notify.save');

    var url = musomap.client.webroot + "/json/account/notify/save.php";
    
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;
    data.notify = $('.notify', this.$view).hasClass('active');
    data.weeklyDigest = $('.weeklyDigest', this.$view).hasClass('active');

    musomap.client.splash.loading.show();
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(user) {
            // success
            window.location.href = '#/account/confirm';
        },
        error: function(Response) {
            // error
            window.location.href = '#/fail/' + Response.responseText;
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }        
    });    
};