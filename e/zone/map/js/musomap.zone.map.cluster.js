musomap.zone.map.cluster = function() {
    musomap.log('musomap.zone.map.cluster');
        
    this.bind();
    this.init();
};

musomap.zone.map.cluster.prototype.bind = function() {
    musomap.log('musomap.zone.map.cluster.bind');
    
};

musomap.zone.map.cluster.prototype.init = function() {
    musomap.log('musomap.zone.map.cluster.init');
    this.$view = $('#bodyFrame #zoneFrame #mapZone .mapPage .view');
    this.$clusterScroller = $('#clusterScroll', this.$view);
};

musomap.zone.map.cluster.prototype.showCluster = function(cluster) {
    musomap.log('musomap.zone.map.cluster.showCluster');
    var cluster = cluster;
    this.initCluster(cluster.latLng, cluster.count);
};

musomap.zone.map.cluster.prototype.initCluster = function(latLng, count) {
    musomap.log('musomap.zone.map.cluster.initCluster');
    this.count = count;
    this.clearCluster();
    this.getCluster(latLng); 
};

musomap.zone.map.cluster.prototype.getCluster = function(latLng) {
    musomap.log('musomap.zone.map.cluster.getCluster');


    var url = musomap.client.webroot + "/json/user/list.php";
    var data = {};
    data.lat = latLng.lat();
    data.lng = latLng.lng();
    
    musomap.client.splash.loading.show();
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        'cache' : false,
        success: function(cluster) {
            // success
            musomap.client.zone.map.cluster.renderCluster(cluster);
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

musomap.zone.map.cluster.prototype.renderCluster = function(cluster) {
    musomap.log('musomap.zone.map.cluster.renderCluster');
    
    this.clearCluster();
    
    for (var i = 0; i < cluster.length && i < this.count; i++) {
        this.renderClusterProfile(cluster[i]);
    }

    this.$clusterScroller.scrollTop(0);
    musomap.rebindTap(this.$view.selector + ' div[data-href]');
};

musomap.zone.map.cluster.prototype.renderClusterProfile = function(profile) {
    musomap.log('musomap.zone.map.cluster.renderClusterProfile');
    var template = $('.profileTemplate', this.$clusterScroller).clone();
    
    // data
    $('.name', template).html(profile.Name);
    $('.icon img', template).attr('src', musomap.client.baseDomain + '/i/image/profile/dynamic/' + profile.Reference + '_30x30.jpg');
    var shortAddress = musomap.shorten(profile.Address, 40);
    $('.address', template).html(shortAddress);
    var shortInfo = musomap.shorten(profile.Info, 40);
    $('.info', template).html(shortInfo);
    $(template).attr('class', 'profile');
    
    // link
    var url = '#/profile/' + profile.Label;
    $('.icon', template).attr('data-href', url);
    $('.name', template).attr('data-href', url);
    
    $('.list', this.$clusterScroller).append(template[0].outerHTML);
};

musomap.zone.map.cluster.prototype.clearCluster = function(cluster) {
    musomap.log('musomap.zone.map.cluster.clearCluster');
    $('.profile', this.$clusterScroller).remove();
};