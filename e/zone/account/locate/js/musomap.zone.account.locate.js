musomap.zone.account.locate = function(args){
    musomap.log('musomap.zone.account.locate');
    this.init();
    this.bind();
};

musomap.zone.account.locate.prototype.init = function() {
    musomap.log('musomap.zone.account.locate.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .locatePage .view');
};

musomap.zone.account.locate.prototype.bind = function() {
    musomap.log('musomap.zone.account.locate.init');
    $('.submit', this.$view).click(function(e){
        var valid = musomap.client.zone.account.locate.validate();
        if (valid){
            musomap.client.zone.account.locate.save();
        }
    });
};

musomap.zone.account.locate.prototype.show = function() {
    musomap.log('musomap.zone.account.locate.show');
    this.$view.addClass('active');
    
    var options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: true,
        scaleControl: false,
        streetViewControl: false,
        mapTypeControl: false,      
    };
    
    var canvas = $('.map', this.$view);
    canvas.height($(window).height() / 2);
    this.map  = new google.maps.Map(canvas[0], options);  

    var lat = 35.69473694838486;
    var lng = -43.377708345012245;
    var zoom = 2; 
    var center = new google.maps.LatLng(lat, lng);
    
    this.map.setCenter(center);
    this.map.setZoom(zoom);

    // click
    google.maps.event.addListener(this.map, 'click', function(event) {
        musomap.client.zone.account.locate.setMarker(event.latLng);
    });

    // find current location
    this.lookup();

};

musomap.zone.account.locate.prototype.lookup = function() {
    musomap.log('musomap.zone.account.locate.lookup');
    
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
            musomap.client.zone.account.locate.fill(profile);
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


musomap.zone.account.locate.prototype.fill = function(profile) {
    var latLng = new google.maps.LatLng(profile.Lat, profile.Lng);
    this.map.setCenter(latLng);
    this.map.setZoom(19);
    this.setMarker(latLng);
};

musomap.zone.account.locate.prototype.validate = function() {
    var valid = true;
    if (this.lat === undefined || this.lng === undefined){
        musomap.client.system.message('Zoom-in &amp; click on the map to pin your location.');
        valid = false;
    }
    
    return valid;
};

musomap.zone.account.locate.prototype.setMarker = function(latLng) {
    musomap.log('musomap.zone.account.locate.setMarker');
    if (this.circle === undefined){
        // create
        this.circle = new google.maps.Marker({
            position: latLng,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillOpacity: 1,
                fillColor: '#2DB9C2',
                strokeWeight: 3,
                strokeColor: '#c2812d',
                strokeOpacity: 0.5,
                scale: 10
            },
            zIndex: 2
        });

        this.circle.setDraggable(true);
    }
    
    this.circle.setMap(this.map);
    this.circle.setPosition(latLng);
    
    this.lat = latLng.lat();
    this.lng = latLng.lng();
};

musomap.zone.account.locate.prototype.error = function(error) {
    musomap.log('musomap.zone.account.locate.error');
    window.location.href = '#/fail/Unable to locate you. ' + error;
};

musomap.zone.account.locate.prototype.save = function(){
    musomap.log('musomap.zone.feed.save');

    var url = musomap.client.webroot + "/json/account/locate/save.php";
    
    var $name = $('#name', this.$view);
    var $info = $('#info', this.$view);
    
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;
    data.lat = this.lat;
    data.lng = this.lng;
    
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