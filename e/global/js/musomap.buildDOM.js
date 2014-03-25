musomap.buildDOM = function(args) {
    musomap.log('musomap.buildDOM');

    this.init();
    this.bind();
};

musomap.buildDOM.prototype.init = function() {
    musomap.log('musomap.buildDOM.init');
    // init object
};

musomap.buildDOM.prototype.bind = function() {
    musomap.log('musomap.buildDOM.bind');

};

musomap.buildDOM.prototype.renderTemplates = function() {
    musomap.log('musomap.buildDOM.renderTemplates');
    this.activeElement = $("[data-template]").first();
    if (this.activeElement.length){
        var childTemplate = this.activeElement.attr('data-template');
        
        // append timestamp;
        var time = new Date().getTime();
        childTemplate += '?' + time;
        
        // clear attribute
        this.activeElement.removeAttr('data-template');
        
        // render template
        $.get(childTemplate, function(template) {
            var time = new Date().getTime();
            template = template.replace(/{timestamp}/g, time);
            musomap.buildDOM.activeElement.append(template);
            musomap.buildDOM.renderTemplates();
        }); 
    }else{
        // finish
        $(this).trigger('complete');
    }
};
