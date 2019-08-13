var Carousel = function () {
};
Carousel.prototype = {
    //容器选择器
    container:"",
    //图片地址数组
    datas:null,
    autoplaySpeed:null,
    autoplay:false,
    // 初始化
    init:function(options){
        this.container = options.container;
        this.datas = options.datas;
        this.autoplaySpeed = options.autoplaySpeed;
        this.autoplay = options.autoplay;
        $(this.container).html("");
        this.createCarousel(options);
        this.arrowHover();
        this.tabImg();
        this.setZindex();
        //判断是否需要自动播放
        if(options.autoplay || this.autoplay == true){
            this.autoPlay(this.autoplaySpeed);
        }else{
            return;
        }
    },
    createCarousel:function(options){
        this.createDOM(this.container,options);
    },
    // 生成DOM
    createDOM:function(container,options){
        var html = "";
        html = "<div class='carousel-box clearfix'>"+
                    "<div class='transverse-box pull-left'>"+
                    "</div>"+
                    "<div class='vertical-box pull-right'>"+
                        "<ul>"+
                        "</ul>"+
                    "</div>"+
                    "<span class='left-arrow'>‹</span>"+
                    "<span class='right-arrow'>›</span>"+         
                "</div>";
        $(container).html(html);
        var imgLength = options.datas.length;
        for(var i = 0;i<imgLength;i++){
            $(".transverse-box").append("<div class='img-item'><a href='" + options.datas[i].url + "' target='_blank'><img src='" 
                + options.datas[i].img +"' url='" + options.datas[i].url + "' alt='" + options.datas[i].alt + "'></a></div>");
        };
        $(".vertical-box ul").append("<li><a href='" + options.datas[1].url + "' target='_blank'><img src='"+options.datas[1].img +"' alt='" + options.datas[1].alt + "'></a></li>");
        $(".vertical-box ul").append("<li><a href='" + options.datas[2].url + "' target='_blank'><img src='"+options.datas[2].img +"' alt='" + options.datas[2].alt + "'></a></li>");
    },
    arrowHover:function(){
        $(".carousel-box").hover(function(){
            $(".left-arrow,.right-arrow").css("display","flex");
        },function(){
            $(".left-arrow,.right-arrow").css("display","none");
        })
    },
    // 点击左右箭头触发翻页
    tabImg:function(){
        var obj = this;
        $(".left-arrow").on("click",function(){
           obj.changeZindex_add();
        })
        $(".right-arrow").on("click",function(){
            obj.changeZindex_sub();
         })
    },
    // 设置初始zindex
    setZindex:function(){
        //左侧横向TAB
        var imgNum = $(".transverse-box").find(".img-item").length;
        
        for(var i = 10000;i<imgNum;i++){
            $(".img-item").eq(i).css({
                "zIndex":i
            });
            $(".img-item").eq(i).attr("Zindex",i);
        }
    },
    //前翻
    changeZindex_add:function(){
        var imgNum = $(".transverse-box").find(".img-item").length;
        var lastZindex =   $(".transverse-box").find(".img-item").eq(length-1).attr("zindex");
        var firstImg = $(".transverse-box").find(".img-item").eq(0).find("img");
        var firstImgSrc =  firstImg.attr("src");
        var firstImgAlt =  firstImg.attr("alt");
        var firstImgUrl =  firstImg.attr("url");
        var l1Img = $(".transverse-box").find(".img-item").eq(length-1).find("img");
        var lastImgSrc =  l1Img.attr("src");
        var lastImgUrl = l1Img.attr("url");
        var l2Img = $(".transverse-box").find(".img-item").eq(length-2).find("img");
        var last2ImgSrc = l2Img.attr("src");
        var last2ImgUrl = l2Img.attr("url");
        $(".transverse-box").find(".img-item").eq(0).remove();
        $(".transverse-box").append("<div class='img-item' zindex='"+(parseInt(lastZindex)+1)+"'><a href='" + firstImgUrl 
            + "' target='_blank'><img src='"+firstImgSrc+"' alt='" + firstImgAlt + "' url='" + firstImgUrl + "'></a><div>");
        $(".vertical-box ul").find("li").eq(0).find("img").attr("src",lastImgSrc);
        $(".vertical-box ul").find("li").eq(0).find("a").attr("href",lastImgUrl);
        $(".vertical-box ul").find("li").eq(1).find("img").attr("src",last2ImgSrc);
        $(".vertical-box ul").find("li").eq(1).find("a").attr("href",last2ImgUrl);
        $(".transverse-box").find(".img-item").eq(length-1).css({
            "zIndex":parseInt(lastZindex)+1,
            "opacity":0
        },500);    
        $(".transverse-box").find(".img-item").eq(length-1).animate({
            "opacity":1
        },500);

    },
    // 后翻
    changeZindex_sub:function(){
        var imgNum = $(".transverse-box").find(".img-item").length;
        var lastZindex = $(".transverse-box").find(".img-item").eq(length-1).attr("zindex");
        var firstZindex = $(".transverse-box").find(".img-item").eq(0).attr("zindex");
        var lastImg = $(".transverse-box").find(".img-item").eq(length-1).find("img");
        var lastImgSrc = lastImg.attr("src");
        var lastImgAlt = lastImg.attr("alt");
        var lastImgUrl = lastImg.attr("url");
        var f1Img = $(".transverse-box").find(".img-item").eq(0).find("img");
        var firstImgSrc = f1Img.attr("src");
        var firstImgUrl = f1Img.attr("url");
        var f2Img = $(".transverse-box").find(".img-item").eq(1).find("img");
        var first2ImgSrc = f2Img.attr("src");
        var first2ImgUrl = f2Img.attr("url");
        $(".transverse-box").find(".img-item").eq(length-1).remove();
        $(".transverse-box").prepend("<div class='img-item' zindex='"+(parseInt(firstZindex)-1)+"'><a href='" + lastImgUrl 
            + "' target='_blank'><img src='"+lastImgSrc+"' alt='" + lastImgAlt + "' url='" + lastImgUrl + "'></a><div>");
        $(".vertical-box ul").find("li").eq(0).find("img").attr("src",firstImgSrc);
        $(".vertical-box ul").find("li").eq(0).find("a").attr("href",firstImgUrl);
        $(".vertical-box ul").find("li").eq(1).find("img").attr("src",first2ImgSrc);
        $(".vertical-box ul").find("li").eq(1).find("a").attr("href",first2ImgUrl);
        $(".transverse-box").find(".img-item").eq(0).css({
            "zIndex":parseInt(firstZindex)-1
        }).siblings().css("opacity","0");
        $(".transverse-box").find(".img-item").eq(length-1).animate({
            "opacity":1
        }); 

        
    },
    // 自动播放
    autoPlay:function(x){
        var obj = this;
        this.changeZindex_add();
        setTimeout(function(){obj.autoPlay(x)},x);
    }
}

$(document).ready(function () {
    $.getJSON("./json-data/main-banner.json", function (data) {
        var banner = new Carousel();
        //图片地址数组。不要少于三张
        var imgSrcDate = data;
        banner.init({
            container:"#banner",
            datas:imgSrcDate,
            autoplaySpeed:8000,
            autoplay: true
        });
    })
})