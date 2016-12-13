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

    var Scroll = function ($element, options) {
        this.$element = $element;
        this.options = options;
        this.$wrapContainer = null;
        this.$scrollX = null;
        this.$scrollY = null;

        this.createWrapContainer();
    };

    Scroll.swEventNameSpace = {
        MOUSEDOWN_EVENT_NAME: 'mousedown.swallow',
        MOUSEUP_EVENT_NAME: 'mouseup.swallow',
        MOUSEMOVE_EVENT_NAME: 'mousemove.swallow',
        MOUSEENTER_ENVENT_NAME: 'mouseenter.swallow',
        MOUSELEAVE_ENVENT_NAME: 'mouseleave.swallow'
    };

    /**
     * 插件默认属性
     * @type {{}}
     */
    Scroll.X_DEFAULTS = {
        wrapWidth: '100%',
        wrapHeight: '100%',
        xWidth: '100%',
        xHeight: '10px',
        xAutoHide: true,
        xLeft: '0',
        xBottom: '0',
        xBackground: '#dddddd',
        xSliderBg: '#33AA88',
        xSliderWidth: '50px',
        xSliderHeight: '10px',
        xSliderRadius: "15px",
        xScrollCSS: {},
        xSliderCSS: {}
    };

    Scroll.Y_DEFAULTS = {
        wrapWidth: '100%',
        wrapHeight: '100%',
        yWidth: '10px',
        yHeight: '100%',
        yAutoHide: true,
        yRight: '0',
        yTop: '0',
        yBackground: '#dddddd',
        ySliderBg: '#33AA88',
        ySliderWidth: '10px',
        ySliderHeight: '50px',
        ySliderRadius: "15px",
        yScrollCSS: {},
        ySliderCSS: {}
    };

    Scroll.prototype.createWrapContainer = function () {
        if (this.$wrapContainer != null) {
            return false;
        }
        var options = this.options;
        var $wrapContainer = $('<div class="sw-scroll-wrap" style="position: relative;"><div class="sw-content" style="position: relative;"></div></div>');
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
        this.$wrapContainer = this.$element.parent().parent();

        return this;
    };

    Scroll.prototype.createScrollX = function () {
        if (this.$scrollX != null) {
            return false;
        }
        var options = this.options;
        var $element = this.$element;
        if (this.$wrapContainer === null) {
            this.createWrapContainer($element);
        }

        var $scrollX = $('<div class="sw-scroll-x" style="position: absolute;"><div class="sw-scroll-slider-x" style="position: absolute; display: inline;"></div></div>');
        this.$wrapContainer.append($scrollX);
        this.$scrollX = this.$wrapContainer.find('.sw-scroll-x');

        var $xSlider = $scrollX.find('.sw-scroll-slider-x');
        $xSlider.css({
            width: options.xSliderWidth,
            height: options.xSliderHeight,
            background: options.xSliderBg,
            "border-radius": options.xSliderRadius,
            cursor: 'pointer',
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
            margin: 'auto 0'
        }).css(options.xSliderCSS);
        $scrollX.css({
            width: options.xWidth,
            height: options.xHeight,
            left: options.xLeft,
            bottom: options.xBottom,
            background: options.xBackground,
            display: options.xAutoHide ? 'none' : 'block'
        }).css(options.xScrollCSS).css({
            bottom: $xSlider.height() <= $scrollX.height() ? $scrollX.css('bottom') : ($xSlider.height() - $scrollX.height()) / 2 + parseFloat($scrollX.css('bottom')) + 'px'
        });

        var $content = this.$wrapContainer.find('.sw-content');

        var eleWidth = $element.width();
        var wrapWidth = this.$wrapContainer.width();
        var xScrollWidth = $scrollX.width();
        var xSliderWidth = $xSlider.width();
        var that = this;

        $scrollX.on(Scroll.swEventNameSpace.MOUSEDOWN_EVENT_NAME, '.sw-scroll-slider-x', function (e0) {
            e0.preventDefault();
            e0.stopPropagation();

            that.$wrapContainer.addClass('sw-scrolling');
            $element.css({
                position: 'absolute'
            });

            if (that.$scrollY !== null && options.xAutoHide) {
                that.$scrollY.fadeOut(40);
            }

            var yScrollWidth = that.$scrollY === null || options.xAutoHide ? 0 : Math.max(that.$scrollY.width(), that.$scrollY.find('.sw-scroll-slider-y').width());
            var fullScroll = xScrollWidth - xSliderWidth - yScrollWidth;
            var xScale = -$element.position().left === $xSlider.position().left ? (eleWidth - wrapWidth + yScrollWidth + $element.position().left) / (fullScroll - $xSlider.position().left) : -($element.position().left / $xSlider.position().left );
            var lastX = e0.pageX;
            $(document).on(Scroll.swEventNameSpace.MOUSEMOVE_EVENT_NAME, function (e1) {
                e1.preventDefault();
                e1.stopPropagation();
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
                $xSlider.css('left', ($xSlider.position().left + dis ) + 'px');
                lastX = e1.pageX;
            });
        });

        return this;
    };

    Scroll.prototype.createScrollY = function () {
        if (this.$scrollY != null) {
            return false;
        }

        var options = this.options;
        var $element = this.$element;
        if (this.$wrapContainer === null) {
            this.createWrapContainer($element);
        }
        var $scrollY = $('<div class="sw-scroll-y" style="position: absolute;"><div class="sw-scroll-slider-y" style="position: absolute; display: inline;"></div></div>');

        this.$wrapContainer.append($scrollY);
        this.$scrollY = this.$wrapContainer.find('.sw-scroll-y');

        var $ySlider = $scrollY.find('.sw-scroll-slider-y');
        $ySlider.css({
            width: options.ySliderWidth,
            height: options.ySliderHeight,
            background: options.ySliderBg,
            "border-radius": options.ySliderRadius,
            cursor: 'pointer'
        }).css(options.ySliderCSS);

        $scrollY.css({
            width: options.yWidth,
            height: options.yHeight,
            right: options.yRight,
            top: options.yTop,
            background: options.yBackground,
            display: options.yAutoHide ? 'none' : 'block'
        }).css(options.yScrollCSS).css({
            right: $ySlider.width() <= $scrollY.width() ? $scrollY.css('right') : ($ySlider.width() - $scrollY.width()) / 2 + parseFloat($scrollY.css('right')) + 'px'
        });

        var $content = this.$wrapContainer.find('.sw-content');

        var eleHeight = $element.height();
        var wrapHeight = this.$wrapContainer.height();
        var yScrollHeight = $scrollY.height();
        var ySliderHeight = $ySlider.height();
        var that = this;

        $scrollY.on(Scroll.swEventNameSpace.MOUSEDOWN_EVENT_NAME, '.sw-scroll-slider-y', function (e0) {
            e0.preventDefault();
            e0.stopPropagation();

            that.$wrapContainer.addClass('sw-scrolling');

            $element.css({
                position: 'absolute'
            });
            if (that.$scrollX !== null && options.yAutoHide) {
                that.$scrollX.fadeOut(40);
            }

            var xScrollHeight = that.$scrollX === null || options.yAutoHide ? 0 : that.$scrollX.height();
            var fullScroll = yScrollHeight - ySliderHeight - xScrollHeight;
            var yScale = -$element.position().top === $ySlider.position().top ? (eleHeight - wrapHeight + xScrollHeight + $element.position().top ) / (fullScroll - $element.position().top) : -($element.position().top / $ySlider.position().top );
            var lastY = e0.pageY;
            $(document).on(Scroll.swEventNameSpace.MOUSEMOVE_EVENT_NAME, function (e1) {
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

        return this;
    };

    Scroll.prototype.init = function () {
        var $wrapContainer = this.$wrapContainer;
        var that = this;

        $(document).on(Scroll.swEventNameSpace.MOUSEUP_EVENT_NAME, function (e) {
            $(document).off(Scroll.swEventNameSpace.MOUSEMOVE_EVENT_NAME);
            $('.sw-scrolling').removeClass('sw-scrolling');
            if (!$wrapContainer.is('.sw-over-wrap')) {
                $wrapContainer.trigger(Scroll.swEventNameSpace.MOUSELEAVE_ENVENT_NAME);
            } else {
                if (that.options.xAutoHide) {
                    if (that.$scrollX !== null) {
                        that.$scrollX.fadeIn(30);
                    }
                }
                if (that.options.yAutoHide) {
                    if (that.$scrollY !== null) {
                        that.$scrollY.fadeIn(30);
                    }
                }
            }
        });

        if (this.options.xAutoHide) {
            var $scrollX = this.$scrollX;
            var $scrollY = this.$scrollY;
            var xHeight = $scrollX.height();
            var yWidth = $scrollY.width();
            $wrapContainer.on(Scroll.swEventNameSpace.MOUSEENTER_ENVENT_NAME, function (e) {
                $wrapContainer.addClass("sw-over-wrap");
                if ($wrapContainer.is('.sw-scrolling')) {
                    return false;
                }

                if ($scrollX !== null) {
                    $scrollX.stop(true, true);
                }
                if ($scrollY !== null) {
                    $scrollY.stop(true, true);
                }

                if ($scrollX !== null) {
                    $scrollX.fadeIn(40);
                }
                if ($scrollY !== null) {
                    $scrollY.fadeIn(40);
                }
            });

            $wrapContainer.on(Scroll.swEventNameSpace.MOUSELEAVE_ENVENT_NAME, function (e) {
                $wrapContainer.removeClass("sw-over-wrap");
                if ($wrapContainer.is('.sw-scrolling')) {
                    return false;
                }
                if ($scrollX !== null) {
                    $scrollX.delay(300).fadeOut(200);
                }
                if ($scrollY !== null) {
                    $scrollY.delay(300).fadeOut(200);
                }
            });
        }
    };

    var swOld = $.fn.swScroll;
    var xOld = $.fn.swScrollX;
    var yOld = $.fn.swScrollY;

    $.fn.swScroll = function (options) {
        return this.each(function () {
            new Scroll($(this), $.extend({}, Scroll.X_DEFAULTS, Scroll.Y_DEFAULTS, options))
                .createScrollX()
                .createScrollY()
                .init();
        });
    };

    $.fn.swScrollX = function (options) {
        return this.each(function () {
            new Scroll($(this), $.extend({}, Scroll.X_DEFAULTS, options))
                .createScrollX()
                .init();
        });
    };

    $.fn.swScrollY = function (options) {
        return this.each(function () {
            new Scroll($(this), $.extend({}, Scroll.Y_DEFAULTS, options))
                .createScrollY()
                .init();
        });
    };


    $.fn.swScroll.Constructor = $.fn.swScrollX.Constructor = $.fn.swScrollX.Constructor = Scroll;

    $.fn.swScroll.noConflict = function () {
        $.fn.swScroll = swOld;
        return this;
    };

    $.fn.swScrollX.noConflict = function () {
        $.fn.swScrollX = xOld;
        return this;
    };

    $.fn.swScrollY.noConflict = function () {
        $.fn.swScrollY = yOld;
        return this;
    }
})(jQuery);