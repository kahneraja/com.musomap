musomap.zone.search = function(args){
    musomap.log('musomap.zone.search');

    this.init();
    this.bind();
};

musomap.zone.search.prototype.init = function() {
    musomap.log('musomap.zone.search.init');
    this.$view = $('#bodyFrame #zoneFrame #searchZone #searchPage #searchView');
};

musomap.zone.search.prototype.bind = function() {
    musomap.log('musomap.zone.search.init');
    $('#submit', this.$view).click(function(e){
        e.preventDefault();
        var valid = musomap.client.zone.search.validate();
        if (valid){
            var query = $('#query', musomap.client.zone.search.$view).val();
            window.location.href = '#/feed/' + query;
        }
    });
};

musomap.zone.search.prototype.show = function(error) {
    musomap.log('musomap.zone.search.show');
    this.$view.addClass('active');
};

musomap.zone.search.prototype.validate = function() {
    musomap.log('musomap.zone.composer.validate');
    var valid = true;

    return valid;
};