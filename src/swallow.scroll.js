/**
 * 滚动条插件v1.0.0 (https://github.com/fireswallow/swallow-scroll)
 * Copyright 2016-2016 fireswallow
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
    throw new Error('滚动条插件需要jQuery');
}

+(function ($) {
    'use strict';

    var SCROLL_EVENT_NAME = 'scroll.swallow';

    var Scroll = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Scroll.DEFAULTS, options);

        this.$wrapContainer = null;
        this.$scrollX = null;
        this.$scrollY = null;

        this.createWrapContainer(this.options);
        this.createScrollX(this.options);
        this.createScrollY(this.options);
    };

    /**
     * 插件默认属性
     * @type {{}}
     */
    Scroll.DEFAULTS = {
        wrapWidth: '100%',
        wrapHeight: '100%',
        xWidth: '100%',
        xHeight: '10px',
        yWidth: '10px',
        yHeight: '100%',
        xLeft: '0',
        xBottom: '0',
        yRight: '0',
        yTop: '0',
        xBackground: '#dddddd',
        yBackground: '#dddddd',
        xSliderBg: '#33AA88',
        ySliderBg: '#33AA88',
        xSliderWidth: '50px',
        xSliderHeight: '100%',
        ySliderWidth: '100%',
        ySliderHeight: '50px',
        xSliderRadius: "15px",
        ySliderRadius: "15px"
    };


    Scroll.prototype.createWrapContainer = function (options) {
        var $wrapContainer = $('<div class="sw-scroll-wrap" style="position: relative;"></div>');
        this.$wrapContainer = $wrapContainer;
        $wrapContainer.css({
            width: options.wrapWidth,
            height: options.wrapHeight
        });
        this.$element.wrap($wrapContainer);
    };

    Scroll.prototype.createScrollX = function (options) {
        if (this.$wrapContainer === null) {
            this.createWrapContainer(this.$element);
        }

        var $scrollX = $('<div class="sw-scroll-x" style="position: absolute;"><span class="sw-scroll-slider-x" style="position: absolute; display: inline-block;"></span></div>');
        this.$scrollX = $scrollX;

        this.$element.after($scrollX);
        $scrollX.css({
            width: options.xWidth,
            height: options.xHeight,
            left: options.xLeft,
            bottom: options.xBottom,
            background: options.xBackground
        });
        $scrollX.find('span.sw-scroll-slider-x').css({
            width: options.xSliderWidth,
            height: options.xSliderHeight,
            background: options.xSliderBg,
            "-moz-border-radius": options.xSliderRadius,
            "-webkit-border-radius": options.xSliderRadius,
            "-o-border-radius": options.xSliderRadius,
            "border-radius": options.xSliderRadius
        });

        $scrollX.on(SCROLL_EVENT_NAME, "span.sw-scroll-slider-x", function (event) {

        });
    };

    Scroll.prototype.createScrollY = function (options) {
        if (this.$wrapContainer === null) {
            this.createWrapContainer(this.$element);
        }
        var $scrollY = $('<div class="sw-scroll-y" style="position: absolute;"><span class="sw-scroll-slider-y" style="position: absolute; display: inline-block;"></span></div>');
        this.$scrollY = $scrollY;

        (this.$scrollX || this.$element).after($scrollY);
        $scrollY.css({
            width: options.yWidth,
            height: options.yHeight,
            right: options.yRight,
            top: options.yTop,
            background: options.yBackground
        });
        $scrollY.find('span.sw-scroll-slider-y').css({
            width: options.ySliderWidth,
            height: options.ySliderHeight,
            background: options.ySliderBg,
            "-moz-border-radius": options.ySliderRadius,
            "-webkit-border-radius": options.ySliderRadius,
            "-o-border-radius": options.ySliderRadius,
            "border-radius": options.ySliderRadius

        });
    };

    Scroll.prototype.calculateXScale = function () {
        return {
            wrapScale: this.$element.width() / this.$wrapContainer.width(),
            sliderScale: this.$scrollX.width() / this.$scrollX.find('span.sw-scroll-slider-x').width()
        };
    };

    Scroll.prototype.calculateYScale = function (options) {
        return {
            wrapScale: this.$element.height() / this.$wrapContainer.height(),
            sliderScale: this.$scrollY.height() / this.$scrollY.find('span.sw-scroll-slider-y').height()
        };
    };

    var old = $.fn.swScroll;
    $.fn.swScroll = function (options) {
        return this.each(function () {
            new Scroll($(this), options);
        });
    };

    $.fn.swScroll.Constructor = Scroll;

    $.fn.swScroll.noConflict = function () {
        $.fn.swScroll = old;
        return this;
    }
})(jQuery);