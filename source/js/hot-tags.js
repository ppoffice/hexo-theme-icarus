$(document).ready(function () {
    $.getJSON("./json-data/hot-tags.json", function (data) {
        var hotTagsData = data;
        var hottags = $(".container .hot-tags");
        for(var i = 0; i < hotTagsData.length; i++){
            hottags.append('<a href="' + hotTagsData[i].url + '" target="_blank" class="tag ' + hotTagsData[i].class + '">' + hotTagsData[i].tag + '</a>')
        }
    })
})