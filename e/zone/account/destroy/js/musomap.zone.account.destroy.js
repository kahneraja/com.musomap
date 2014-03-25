musomap.zone.account.destroy = function(args){
    musomap.log('musomap.zone.account.destroy');
    this.init();
    this.bind();
};

musomap.zone.account.destroy.prototype.init = function() {
    musomap.log('musomap.zone.account.destroy.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .destroyPage .view');
};

musomap.zone.account.destroy.prototype.bind = function() {
    musomap.log('musomap.zone.account.destroy.init');
    $('.submit', this.$view).bind('tap', function(){
       musomap.client.zone.account.destroy.commit(); 
    });
};

musomap.zone.account.destroy.prototype.show = function() {
    musomap.log('musomap.zone.account.destroy.show');
    this.$view.addClass('active');
};

musomap.zone.account.destroy.prototype.commit = function(){
    musomap.log('musomap.zone.account.destroy.commit');

    var url = musomap.client.webroot + "/json/account/profile/destroy.php";
    
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
        success: function(user) {
            // success
            window.location.href = '#/account/logout';
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