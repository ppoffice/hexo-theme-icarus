(function() {
    function $() {
        return Array.prototype.slice.call(document.querySelectorAll.apply(document, arguments));
    }

    // copy widgets in the right column, when exist, to the bottom of the left column
    if ($('.columns .column-right').length && $('.columns .column-right-shadow').length && !$('.columns .column-right-shadow')[0].children.length) {
        for (const child of $('.columns .column-right')[0].children) {
            $('.columns .column-right-shadow')[0].append(child.cloneNode(true));
        }
    }
}());
