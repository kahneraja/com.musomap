musomap.zone.map.clusteredMarker = function(args) {
    this.latLng = new google.maps.LatLng(args.Lat, args.Lng);
    this.maxLatLng = new google.maps.LatLng(args.MaxLat, args.MaxLng);
    this.minLatLng = new google.maps.LatLng(args.MinLat, args.MinLng);
    this.count = args.Count;
    this.recommendationCount = args.RecommendationCount;
    this.userReference = args.UserReference;
    this.init();
};

musomap.zone.map.clusteredMarker.prototype.init = function() {
    // musomap.log("musomap.zone.map.clusteredMarker.init");
    var markerIcon = {
        url: 'e/zone/map/image/orangeCircle.png',
        size: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(10, 10)
    };

    if (this.count > 1){
        // cluster
        var markerIcon = {
            url: 'e/zone/map/image/orangeCluster.png',
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(20, 20)
        };        
    }


    this.marker = new google.maps.Marker({
      position: this.latLng,
      map: musomap.client.zone.map.gMap,
      icon: markerIcon
    });

    // bind
    var This = this;
    google.maps.event.addListener(this.marker, 'click', function() {
        This.clusterClick();
    });
};

musomap.zone.map.clusteredMarker.prototype.drop = function() {
    this.marker.setMap(null);
};

musomap.zone.map.clusteredMarker.prototype.clusterClick = function() {
    musomap.log("musomap.zone.map.clusteredMarker.clusterClick");
    musomap.client.zone.map.cluster.showCluster(this);
};