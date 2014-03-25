musomap.zone.signup.locate = function(args){
    musomap.log('musomap.zone.signup.locate');
    this.init();
    this.bind();
};

musomap.zone.signup.locate.prototype.init = function() {
    musomap.log('musomap.zone.signup.locate.init');
    this.$view = $('#bodyFrame #zoneFrame #signupZone .locatePage .view');
};

musomap.zone.signup.locate.prototype.bind = function() {
    musomap.log('musomap.zone.signup.locate.init');
    $('.submit', this.$view).click(function(e){
        var valid = musomap.client.zone.signup.locate.validate();
        if (!valid){
            e.preventDefault();
        }
    });
};

musomap.zone.signup.locate.prototype.show = function() {
    musomap.log('musomap.zone.signup.locate.show');
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
        musomap.client.zone.signup.locate.setMarker(event.latLng);
    });
        
    
    // find current location
    this.lookup();

};

musomap.zone.signup.locate.prototype.lookup = function() {
    musomap.log('musomap.zone.signup.locate.lookup');

    var options = {
       enableHighAccuracy: true,
       timeout: 10000,
       maximumAge: 10000
    }
    this.circle = undefined;
    musomap.client.splash.loading.show();

    navigator.geolocation.getCurrentPosition(
        function(position) {
            musomap.client.splash.loading.hide();
            if (position.coords.latitude !== undefined && position.coords.longitude !== undefined){
                musomap.client.splash.loading.hide();
                musomap.client.zone.signup.locate.success(position);    
            }
            else{
                musomap.client.splash.loading.hide();
                musomap.log('Error getting location');
            }
        },
        function() {
            musomap.client.splash.loading.hide();
            musomap.log('Error getting location');
        },
        options);
};

musomap.zone.signup.locate.prototype.validate = function() {
    var valid = true;
    if (this.lat === undefined || this.lng === undefined){
        musomap.client.system.message('Zoom-in &amp; click on the map to pin your location.');
        valid = false;
    }
    
    return valid;
};

musomap.zone.signup.locate.prototype.success = function(position) {
    musomap.log('musomap.zone.signup.locate.success');
    // focus
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    // set position
    this.map.setCenter(latLng);
    this.map.setZoom(13);
    this.setMarker(latLng);
};

musomap.zone.signup.locate.prototype.setMarker = function(latLng) {
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
        
        
        this.circle.setMap(this.map);
        this.circle.setDraggable(true);
    } else {
        // move
        this.circle.setPosition(latLng);
    }
    this.lat = latLng.lat();
    this.lng = latLng.lng();
};

musomap.zone.signup.locate.prototype.error = function(error) {
    musomap.log('musomap.zone.signup.locate.error');
    window.location.href = '#/fail/Unable to locate you. ' + error;
};