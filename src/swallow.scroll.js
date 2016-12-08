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
    var MOUSEDOWN_EVENT_NAME = 'mousedown.swallow';
    var MOUDEUP_EVENT_NAME = 'mouseup.swallow';
    var MOUSEMOVE_EVENT_NAME = 'mousemove.swallow';

    var Scroll = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Scroll.DEFAULTS, options);

        this.$wrapContainer = null;
        this.$scrollX = null;
        this.$scrollY = null;

        this.createWrapContainer(this.options);
        $(document).on(MOUDEUP_EVENT_NAME, function () {
            $(document).off(MOUSEMOVE_EVENT_NAME);
        });
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
        var $wrapContainer = $('<div class="sw-scroll-wrap" style="position: relative;"><div class="sw-content" style="position: absolute"></div></div>');
        $wrapContainer.find('.sw-content').css({
            width: options.wrapWidth,
            height: options.wrapHeight,
            overflow: 'hidden'
        });

        $wrapContainer.css({
            width: options.wrapWidth,
            height: options.wrapHeight
        });

        this.$element.wrap($wrapContainer);
        this.$wrapContainer = this.$element.parent('.sw-content').parent('.sw-scroll-wrap');
    };

    Scroll.prototype.createScrollX = function (options) {
        var $element = this.$element;
        if (this.$wrapContainer === null) {
            this.createWrapContainer($element);
        }

        var $scrollX = $('<div class="sw-scroll-x" style="position: absolute;"><div class="sw-scroll-slider-x" style="position: absolute; display: inline-block;"></div></div>');
        this.$wrapContainer.append($scrollX);
        this.$scrollX = this.$wrapContainer.find('.sw-scroll-x');

        var $xSlider = $scrollX.find('.sw-scroll-slider-x');
        $xSlider.css({
            width: options.xSliderWidth,
            height: options.xSliderHeight,
            background: options.xSliderBg,
            "border-radius": options.xSliderRadius,
            cursor: 'pointer'
        });

        $scrollX.css({
            width: options.xWidth,
            height: options.xHeight,
            left: options.xLeft,
            bottom: options.xBottom,
            background: options.xBackground
        });

        var $content = this.$wrapContainer.find('.sw-content');
        $content.css({
            height: this.$wrapContainer.height() - $scrollX.height() + 'px'
        });

        var eleWidth = $element.width();
        var wrapWidth = this.$wrapContainer.width();
        var xScrollWidth = $scrollX.width();
        var xSliderWidth = $xSlider.width();
        var that = this;

        $scrollX.on(SCROLL_EVENT_NAME, '.sw-scroll-slider-x', function (event) {

        });

        $scrollX.on(MOUSEDOWN_EVENT_NAME, '.sw-scroll-slider-x', function (e0) {
            e0.preventDefault();

            $element.css({
                position: 'absolute'
            });

            var yScrollWidth = that.$scrollY === null ? 0 : that.$scrollY.width();
            var fullScroll = xScrollWidth - xSliderWidth - yScrollWidth;
            var xScale = -$element.position().left === $xSlider.position().left ? (eleWidth - wrapWidth + yScrollWidth + $element.position().left) / (fullScroll - $xSlider.position().left) : -($element.position().left / $xSlider.position().left );
            var lastX = e0.pageX;
            $(document).on(MOUSEMOVE_EVENT_NAME, function (e1) {
                var dis = e1.pageX - lastX;
                if (dis === 0) {
                    return false;
                } else if (dis > 0) {
                    if ($xSlider.position().left >= fullScroll) {
                        $xSlider.css('left', fullScroll + 'px');
                        $element.css('left', (-(eleWidth - wrapWidth + yScrollWidth)) + 'px');
                        return false;
                    }
                } else {
                    if ($xSlider.position().left <= 0) {
                        $xSlider.css('left', '0');
                        $element.css('left', '0');
                        return false;
                    }
                }
                $element.css('left', ($element.position().left - dis * xScale) + 'px');
                $xSlider.css('left', ($xSlider.position().left + dis) + 'px');
                lastX = e1.pageX;
            });
        });
    };

    Scroll.prototype.createScrollY = function (options) {
        var $element = this.$element;
        if (this.$wrapContainer === null) {
            this.createWrapContainer($element);
        }
        var $scrollY = $('<div class="sw-scroll-y" style="position: absolute;"><div class="sw-scroll-slider-y" style="position: absolute; display: inline-block;"></div></div>');

        this.$wrapContainer.append($scrollY);
        this.$scrollY = this.$wrapContainer.find('.sw-scroll-y');

        var $ySlider = $scrollY.find('.sw-scroll-slider-y');
        $ySlider.css({
            width: options.ySliderWidth,
            height: options.ySliderHeight,
            background: options.ySliderBg,
            "border-radius": options.ySliderRadius,
            cursor: 'pointer'
        });

        $scrollY.css({
            width: options.yWidth,
            height: options.yHeight,
            right: options.yRight,
            top: options.yTop,
            background: options.yBackground
        });

        var $content = this.$wrapContainer.find('.sw-content');
        $content.css({
            width: this.$wrapContainer.width() - $scrollY.width() + 'px'
        });

        var eleHeight = $element.height();
        var wrapHeight = this.$wrapContainer.height();
        var yScrollHeight = $scrollY.height();
        var ySliderHeight = $ySlider.height();
        var that = this;


        $scrollY.on(SCROLL_EVENT_NAME, '.sw-scroll-slider-y', function (event) {

        });

        $scrollY.on(MOUSEDOWN_EVENT_NAME, '.sw-scroll-slider-y', function (e0) {
            e0.preventDefault();

            $element.css({
                position: 'absolute'
            });

            var xScrollHeight = that.$scrollX === null ? 0 : that.$scrollX.height();
            var fullScroll = yScrollHeight - ySliderHeight - xScrollHeight;
            var yScale = -$element.position().top === $ySlider.position().top ? (eleHeight - wrapHeight + xScrollHeight + $element.position().top ) / (fullScroll - $element.position().top) : -($element.position().top / $ySlider.position().top );
            var lastY = e0.pageY;
            $(document).on(MOUSEMOVE_EVENT_NAME, function (e1) {
                var dis = e1.pageY - lastY;
                if (dis >= 0) {
                    if ($ySlider.position().top >= fullScroll) {
                        $ySlider.css('top', fullScroll + 'px');
                        $element.css('top', (-(eleHeight - wrapHeight + xScrollHeight)) + 'px');
                        return false;
                    }
                } else {
                    if ($ySlider.position().top <= 0) {
                        $ySlider.css('top', '0');
                        $element.css('top', '0');
                        return false;
                    }
                }

                $ySlider.css('top', ($ySlider.position().top + dis) + 'px');
                $element.css('top', ($element.position().top - dis * yScale) + 'px');
                lastY = e1.pageY;
            });
        });
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