try {
    if ($(window).width() > 768) {
        $("<link>").attr({href: "/css/live2d/waifu.css", rel: "stylesheet", type: "text/css"}).appendTo('head');
        $('body').append(
            '<div class="waifu">' +
                '<div class="waifu-tips"></div>' +
                '<canvas id="live2d" class="live2d"></canvas>' +
                '<div class="waifu-tool">' +
                    '<span class="fui-home"></span> ' +
                    '<span class="fui-chat"></span>' +
                    '<span class="fui-gear"></span>' +
                    '<span class="fui-heart"></span> ' +
                    '<span class="fui-photo"></span>' +
                    '<span class="fui-info-circle"></span>' +
                    '<span class="fui-cross"></span>' +
                '</div>' +
            '</div>'
        );
        $.ajax({url: "/js/live2d/waifu-tips.js", dataType:"script", cache: true, success: function() {
            $.ajax({url: "/js/live2d/live2d.js", dataType:"script", cache: true, success: function() {
                // 后端接口
                live2d_settings['modelAPI'] = 'https://live2d.fghrsh.net/api/'; // 自建 API 修改这里
                live2d_settings['hitokotoAPI'] = 'hitokoto.cn'; // 一言 API，可选 'lwl12.com', 'hitokoto.cn', 'jinrishici.com'(古诗词)

                // 默认模型
                live2d_settings['modelId'] = 3; // 默认模型 ID，可在 F12 控制台找到
                live2d_settings['modelTexturesId'] = 0; // 默认材质 ID，可在 F12 控制台找到

                // 工具栏设置
                live2d_settings['canTurnToHomePage'] = false; // 显示 返回首页    按钮，可选 true(真), false(假)

                //看板娘样式设置
                live2d_settings['waifuSize'] = '280x260'; // 看板娘大小，例如 '280x250', '600x535'
                live2d_settings['waifuTipsSize'] = '230x75'; // 提示框大小，例如 '250x70', '570x150'
                live2d_settings['waifuFontSize'] = '16px'; // 提示框字体，例如 '12px', '30px'
                live2d_settings['waifuToolFont'] = '16px'; // 工具栏字体，例如 '14px', '36px'
                live2d_settings['waifuToolLine'] = '26px'; // 工具栏行高，例如 '20px', '36px'
                live2d_settings['waifuEdgeSide'] = 'right:10' // 看板娘贴边方向，例如 'left:0'(靠左 0px), 'right:30'(靠右 30px)

                // 其他杂项设置
                live2d_settings['homePageUrl'] = 'https://www.imaegoo.com'; // 主页地址，可选 'auto'(自动), '{URL 网址}'
                live2d_settings['aboutPageUrl'] = 'https://www.imaegoo.com/about/'; // 关于页地址, '{URL 网址}'
                initModel("/js/live2d/waifu-tips.json");
            }});
        }});
    }
} catch(err) { console.log("[Error] JQuery is not defined.") }
