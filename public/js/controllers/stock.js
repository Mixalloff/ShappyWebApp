$('#target-editor-twitter').markdown({
    hiddenButtons:'cmdPreview',
    footer:'<div id="twitter-footer" class="well" style="display:none;"></div>' +
    '<small id="twitter-counter" class="text-success">140 character left</small>',
    onChange:function(e){

        var content = e.parseContent(),
            content_length = (content.match(/\n/g)||[]).length + content.length

        if (content == '') {
            $('#twitter-footer').hide()
        } else {
            $('#twitter-footer').show().html(content)
        }

        if (content_length > 140) {
            $('#twitter-counter').removeClass('text-success').addClass('text-danger').html(content_length-140+' character surplus.')
        } else {
            $('#twitter-counter').removeClass('text-danger').addClass('text-success').html(140-content_length+' character left.')
        }
    }
});
