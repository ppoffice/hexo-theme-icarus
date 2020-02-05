$(document).ready(function () {
    var observerTopMargin;
    var scrollObserver;
    var headerElems = $(".headerlink");
    var activeTocItem;

    function initIntersectionObserver(docHeight) {
        observerTopMargin = docHeight;
        scrollObserver = new IntersectionObserver(scrollCallBack,
            {
                root: null,  // viewpoint
                rootMargin: docHeight + "px 0px -80% 0px"  // cover top 30% of viewport to the top of document
            })
    }
    
    function scrollCallBack(entries, observer) {
        if ($(window).scrollTop() > observerTopMargin * 0.7) { 
            // User somehow scroll to 70% of observerTopMargin (which is inited as 200% document height)
            // Observer top margin need to extend to cover all the space to the top of the document
            initIntersectionObserver(observerTopMargin * 2)
            observer.disconnect();
            return;
        }
        let toActive;
        if (entries[0].intersectionRatio == 1) {  // enter viewed area
            let entry = entries.reduce((u, v) => (u.target.toc_id > v.target.toc_id ? u : v));  // get the lowest item
            toActive = $("#toc-item-" + $(entry.target).attr("href").substr(1));
        } else {
            let entry = entries.reduce((u, v) => (u.target.toc_id < v.target.toc_id ? u : v));  // get the highest item
            let idx = Math.max(entry.target.toc_id - 1, 0);
            toActive = $("#toc-item-" + $(headerElems[idx]).attr("href").substr(1));
        }
        if (activeTocItem) activeTocItem.removeClass("is-current");
        activeTocItem = toActive
        activeTocItem.addClass("is-current");
    }

    initIntersectionObserver($(document).height() * 2);
    headerElems.each(function (index, obj) {
        obj.toc_id = index;
        scrollObserver.observe(obj);
    })
});