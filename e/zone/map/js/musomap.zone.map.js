musomap.zone.map = function(args){
    musomap.log('musomap.zone.map');

    this.init();
    this.bind();
};

musomap.zone.map.prototype.init = function() {
    musomap.log('musomap.zone.map.init');
    this.$view = $('#bodyFrame #zoneFrame #mapZone .mapPage .view');
    this.$canvas = $('#bodyFrame #zoneFrame #mapZone .mapPage .view .map .canvas');
    this.$clusterScroll = $('#bodyFrame #zoneFrame #mapZone .mapPage .view #clusterScroll');
    this.scroller = new iScroll(this.$clusterScroll.attr('id'), { checkDOMChanges: true, useTransition: true });

    this.cluster = new musomap.zone.map.cluster();
    this.clusteredMarkers = new Array();
    
    this.searchCount = 0;
};

musomap.zone.map.prototype.initMap = function() {
    musomap.log('musomap.zone.map.initMap');
    
    // canvas height
    this.$canvas.height(this.$view.height() / 1.65 - 1);

    // list height
    var height = this.$view.height() - this.$canvas.height() - 1;
    this.$clusterScroll.height(height);

    var options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        maxZoom: 15,
        disableDoubleClickZoom: true
    };
    
    this.gMap  = new google.maps.Map(this.$canvas[0], options);  
    this.bindMap();
};

musomap.zone.map.prototype.bind = function() {
    musomap.log('musomap.zone.map.bind');
    
};

musomap.zone.map.prototype.bindMap = function() {
    musomap.log('musomap.zone.map.bindMap');
    
    // idle
    google.maps.event.addListener(this.gMap, 'idle', function(event) {
        musomap.client.zone.map.idlePause = setTimeout(function(){
            clearTimeout(musomap.client.zone.map.idlePause);
            musomap.client.zone.map.idle();
        }, 500);
    }); 
};

musomap.zone.map.prototype.show = function(lat, lng) {
    musomap.log('musomap.zone.map.show');

    this.searchCount = 0;

    this.clearClusteredMarkers();
    this.cluster.clearCluster();    
    this.$view.addClass('active');
    
    
    if (this.gMap == undefined){
        this.initMap();
    }
    
    var zoom = 14; 
    var center = new google.maps.LatLng(lat, lng);
    
    musomap.client.splash.loading.show();
    this.gMap.setCenter(center);
    this.gMap.setZoom(zoom);
};

musomap.zone.map.prototype.idle = function() {
    musomap.log('musomap.zone.map.idle');
    musomap.client.splash.loading.hide();
    this.updateClusteredMarkers();
};

musomap.zone.map.prototype.updateClusteredMarkers = function() {
    // Clear clustered markers
    this.clearClusteredMarkers();
    this.getClusteredMarkers();
};

musomap.zone.map.prototype.getClusteredMarkers = function() {
    musomap.log('musomap.zone.map.getClusteredMarkers');
    var ne = this.gMap.getBounds().getNorthEast();
    var sw = this.gMap.getBounds().getSouthWest();
    var center = this.gMap.getCenter();

    var url = musomap.client.webroot + "/json/user/cluster.php";
    var data = {};
    data.zoom = this.gMap.getZoom();
    data.query = this.query;
    data.neLat = ne.lat();
    data.neLng = ne.lng();
    data.swLat = sw.lat();
    data.swLng = sw.lng();
    data.centerLat = center.lat();
    data.centerLng = center.lng();

    musomap.client.splash.loading.show();
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        'cache' : false,
        success: function(clusteredMarkers) {
            // success
            musomap.client.zone.map.initialiseClusteredMarkers(clusteredMarkers);
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

musomap.zone.map.prototype.initialiseClusteredMarkers = function(clusteredMarkers) {
    musomap.log("musomap.zone.map.initialiseClusteredMarkers");
    // Append new clustered markers
    for (var i = 0; i < clusteredMarkers.length; i++) {
        var clusteredMarker = new musomap.zone.map.clusteredMarker(clusteredMarkers[i]);
        this.clusteredMarkers.push(clusteredMarker);
    }
    
    if (this.clusteredMarkers.length && this.searchCount == 0){
        this.clusteredMarkers[0].clusterClick();
    }
    
    this.searchCount++;
};

musomap.zone.map.prototype.clearClusteredMarkers = function() {
    musomap.log("musomap.zone.map.clearClusteredMarkers");
    for (var i = 0; i < this.clusteredMarkers.length; i++ ) {
        this.clusteredMarkers[i].drop();
    }
    this.clusteredMarkers = [];
};
