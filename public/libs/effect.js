jQuery(function($){
    var jcrop_api,
        boundx,
        boundy,
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),
        xsize = $pcnt.width(),
        ysize = $pcnt.height();
    //小图框大小
    //console.log('init', [xsize, ysize]);
    $('#target').Jcrop({
        onChange: updatePreview,
        onSelect: updatePreview,
        aspectRatio: xsize / ysize
    }, function() {
        var bounds = this.getBounds();
        //大图框大小
        boundx = bounds[0];
        boundy = bounds[1];
        //console.log(boundx,boundy);
        jcrop_api = this;
        $preview.appendTo(jcrop_api.ui.holder);
    });
    function updatePreview(c) {
        if (parseInt(c.w) > 0) {
            var rx = xsize / c.w;
            var ry = ysize / c.h;
            //等比缩放值
            //console.log(rx,ry);
            $pimg.css({
                width: Math.round(rx * boundx) + 'px',
                height: Math.round(ry * boundy) + 'px',
                marginLeft: '-' + Math.round(rx * c.x) + 'px',
                marginTop: '-' + Math.round(ry * c.y) + 'px'
            });
        }
    }
});