/// <reference path="Slider.d.ts" />
var CoveoSliderMethods = {
    Destroy: 'destroy',
    Disable: 'disable',
    Enable: 'enable',
    Update: 'update',
};
var Slider = /** @class */ (function () {
    function Slider(options) {
        var _this = this;
        if (options.slider && _.isUndefined(options.min) && options.slider.attr('min')) {
            options.min = parseFloat(options.slider.attr('min'));
        }
        if (options.slider && _.isUndefined(options.max) && options.slider.attr('max')) {
            options.max = parseFloat(options.slider.attr('max'));
        }
        this.options = _.defaults(options, this.defaults(options.colors));
        this.$el = options.slider;
        this._uid = ++Slider._uid;
        this.$el.attr({
            'data-uid': this._uid,
            max: this.options.max,
            min: this.options.min,
            step: this.options.step,
        });
        this.$el.on('input', function () { return _this.onInput(); });
        this.$el.on('change', function () { return _this.onChange(); });
        if (this.$el.prop('disabled')) {
            this.disable();
        }
        this.options.onInit(this);
    }
    Slider.prototype.onInput = function () {
        this.update();
        this.options.onSlide(this);
    };
    Slider.prototype.onChange = function () {
        this.update();
        this.options.onChange(this);
    };
    Slider.prototype.defaults = function (colors) {
        return {
            colors: _.defaults(colors || {}, { lower: Slider.LowerDefaultColor, upper: Slider.UpperDefaultColor }),
            min: 0,
            max: 100,
            step: 1,
            labels: [],
            ticks: [],
            value: Slider.DefaultValue,
            thumbWidth: 20,
            onInit: _.noop,
            onSlide: _.noop,
            onChange: _.noop,
            onDestroy: _.noop,
        };
    };
    Slider.prototype.update = function () {
        var value = ((this.value - this.min) / (this.max - this.min)) * 100;
        this.updateSliderColors(value);
        this.positionElements();
    };
    Slider.prototype.positionElements = function () {
        var _this = this;
        if (this.options.labels && this.options.labels.length) {
            var $container_1 = this.$el.nextAll('.' + Slider.LabelContainerClass);
            if ($container_1 && $container_1.length) {
                var numberOfTicks_1 = (this.max - this.min) / this.options.step;
                _.each(this.options.labels, function (label) {
                    var $el = $container_1.find("." + Slider.LabelClass + "[data-index=\"" + label.index + "\"]");
                    if ($el && $el.length) {
                        var offsetForMiddle = $el.width() / $container_1.width() * 100 / 2;
                        var offset = (label.index - _this.options.min) / _this.options.step / numberOfTicks_1;
                        $el.css({
                            'left': (offset * 100 - offsetForMiddle) + '%',
                            'margin-left': (offset * -1 * _this.options.thumbWidth + (_this.options.thumbWidth / 2)) + 'px',
                        });
                    }
                });
            }
        }
        if (this.options.ticks && this.options.ticks.length) {
            var $container_2 = this.$el.nextAll('.' + Slider.TickContainerClass);
            if ($container_2 && $container_2.length) {
                var numberOfTicks_2 = (this.max - this.min) / this.options.step;
                _.each(this.options.ticks, function (tick) {
                    var $el = $container_2.find("." + Slider.TickClass + "[data-index=\"" + tick + "\"]");
                    if ($el && $el.length) {
                        var index = (tick - _this.min) / _this.options.step;
                        var offset = index / numberOfTicks_2;
                        $el.css({
                            left: (offset * 100) + '%',
                            'margin-left': offset * -1 * _this.options.thumbWidth + 'px',
                            background: tick < _this.value ? _this.options.colors.lower : _this.options.colors.upper,
                        });
                    }
                });
            }
        }
    };
    Slider.prototype.updateSliderColors = function (value) {
        var styleElement = this.$el.prev('.' + Slider.StyleClass);
        var colors = this.options.colors;
        var gradient = "background: linear-gradient(to right, " + colors.lower + " " + value + "%, " + colors.upper + " " + value + "%);";
        var selector = "." + Slider.InputClass + "[data-uid='" + this._uid + "']";
        var webkit = ["input[type=\"range\"]" + selector + "::-webkit-slider-runnable-track {", gradient, '}'].join('');
        var firefox = ["input[type=\"range\"]" + selector + "::-moz-range-track {", gradient, '}'].join('');
        var ie = [
            "input[type=\"range\"]" + selector + "::-ms-fill-lower {",
            'background: ',
            this.options.colors.lower,
            '}',
            "input[type=\"range\"]" + selector + "::-ms-fill-upper {",
            'background: ',
            this.options.colors.upper,
            '}',
        ].join('');
        styleElement.html([webkit, firefox, ie].join(''));
    };
    Object.defineProperty(Slider.prototype, "value", {
        get: function () { return parseFloat(this.$el.val()); },
        set: function (value) {
            var minOfValueAndMax = Math.min(value, this.max);
            var maxOfValueAndMin = Math.max(minOfValueAndMax, this.min);
            this.$el.val(maxOfValueAndMin);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, "min", {
        get: function () { return parseFloat(this.$el.attr('min')); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Slider.prototype, "max", {
        get: function () { return parseFloat(this.$el.attr('max')); },
        enumerable: true,
        configurable: true
    });
    Slider.prototype.disable = function () {
        this.$el.prop('disabled', true);
        this.$el.css('opacity', '0.8');
    };
    Slider.prototype.enable = function () {
        this.$el.prop('disabled', false);
        this.$el.css('opacity', '1');
    };
    Slider.prototype.destroy = function (elem) {
        this.$el.prev('.' + Slider.StyleClass).remove();
        this.$el.nextAll('.' + Slider.TickContainerClass).remove();
        this.$el.nextAll('.' + Slider.LabelContainerClass).remove();
        this.$el.removeData('slider');
        this.$el.removeAttr('data-uid');
        this.$el.off('input change');
        elem.removeData('slider');
        this.options.onDestroy();
    };
    Slider.LowerDefaultColor = '#f57f03';
    Slider.UpperDefaultColor = '#dddddd';
    Slider.StyleClass = 'coveo-slider-style';
    Slider.InputClass = 'coveo-slider-input';
    Slider.LabelContainerClass = 'coveo-slider-labels';
    Slider.LabelClass = 'coveo-slider-label';
    Slider.TickContainerClass = 'coveo-slider-ticks';
    Slider.TickClass = 'coveo-slider-tick';
    Slider.DefaultValue = 50;
    Slider._uid = 0;
    return Slider;
}());
+function ($) {
    'use strict';
    var createStyleElement = function () { return $('<style />', { type: 'text/css', class: Slider.StyleClass }); };
    var createInputElement = function (value, disabled) { return $('<input />', { type: 'range', class: Slider.InputClass, value: value }).prop('disabled', disabled); };
    var createTickContainer = function () { return $('<div />', { class: Slider.TickContainerClass }); };
    var createLabelContainer = function () { return $('<div />', { class: Slider.LabelContainerClass }); };
    var createLabelElements = function (container, labels) {
        _.chain(labels)
            .sortBy(function (label) { return label.index; })
            .each(function (label) {
            var $el = $('<div />', {
                class: Slider.LabelClass,
                text: label.label || label.index,
                'data-index': label.index,
            });
            container.append($el);
        });
    };
    var createTickElements = function (container, ticks) {
        _.chain(ticks)
            .sortBy(_.identity)
            .each(function (tick) {
            var $el = $('<div />', { class: Slider.TickClass, 'data-index': tick });
            container.append($el);
        });
    };
    $.fn.slider = function (opts) {
        var $this = $(this);
        opts = opts || { slider: $this };
        var slider = $this.data('slider');
        if (_.isNumber(opts)) {
            opts = { value: opts };
        }
        if (slider && slider instanceof Slider) {
            var slider_1 = $this.data('slider');
            if (opts && !_.isUndefined(opts.value)) {
                slider_1.value = opts.value;
                validateAndCreateElements($this, { value: slider_1.value });
                slider_1.update();
            }
            else if (_.isString(opts)) {
                validateAndCreateElements($this, {});
                switch (opts) {
                    case CoveoSliderMethods.Destroy:
                        slider_1.destroy($this);
                        break;
                    case CoveoSliderMethods.Disable:
                        slider_1.disable();
                        break;
                    case CoveoSliderMethods.Enable:
                        slider_1.enable();
                        break;
                    case CoveoSliderMethods.Update:
                        slider_1.update();
                        break;
                    default:
                        break;
                }
            }
            else {
                // no param. update
                validateAndCreateElements($this, { value: slider_1.value });
                slider_1.update();
            }
        }
        else if (!_.isString(opts) && !_.isNumber(opts)) {
            var sliderOptions = opts;
            var elements = validateAndCreateElements($this, sliderOptions);
            sliderOptions.slider = elements.input;
            slider = new Slider(sliderOptions);
            $this.data('slider', slider);
        }
        if (slider && slider instanceof Slider) {
            slider.update();
        }
        return $this;
    };
    function validateAndCreateElements($el, opts) {
        var style;
        var input;
        if ($el.is('input[type="range"]')) {
            input = $el;
            input.prop('disabled', opts.disabled === true);
            style = $el.prev('style.' + Slider.StyleClass);
            if (style.length == 0) {
                style = createStyleElement();
                $el.before(style);
            }
            if (opts && opts.ticks) {
                var ticksContainer = $el.nextAll('.' + Slider.TickContainerClass);
                var ticks = _.isBoolean(opts.ticks) && opts.ticks ? _.range(opts.min || 0, (opts.max || 100) + (opts.step || 1), opts.step || 1)
                    : opts.ticks;
                opts.ticks = ticks;
                if (ticks && ticks.length) {
                    if (ticksContainer.length == 0) {
                        ticksContainer = createTickContainer();
                    }
                    createTickElements(ticksContainer, ticks);
                    $el.after(ticksContainer);
                }
            }
            if (opts && opts.labels) {
                var labelsContainer = $el.nextAll('.' + Slider.LabelContainerClass);
                var labels = _.isBoolean(opts.labels) && opts.labels ? _.range(opts.min || 0, (opts.max || 100) + (opts.step || 1), opts.step || 1) : opts.labels;
                if (labels && labels.length) {
                    labels = _.map(labels, function (label) { return _.isNumber(label) ? { index: label } : label; });
                    if (labelsContainer.length == 0) {
                        labelsContainer = createLabelContainer();
                    }
                    createLabelElements(labelsContainer, labels);
                    $el.after(labelsContainer);
                }
                opts.labels = labels;
            }
        }
        else {
            // assume container
            style = $el.children('style.' + Slider.StyleClass);
            if (style.length == 0) {
                style = createStyleElement();
                $el.prepend(style);
            }
            input = $el.children('input[type="range"].' + Slider.InputClass);
            if (input.length == 0) {
                input = createInputElement(_.isUndefined(opts.value) ? Slider.DefaultValue : opts.value, opts && opts.disabled === true);
                $el.append(input);
            }
            else if (_.isNumber(opts.value)) {
                input.val(opts.value);
            }
            if (opts && opts.ticks) {
                var ticksContainer = $el.children('.' + Slider.TickContainerClass);
                var ticks = _.isBoolean(opts.ticks) && opts.ticks ? _.range(opts.min || 0, (opts.max || 100) + (opts.step || 1), opts.step || 1)
                    : opts.ticks;
                opts.ticks = ticks;
                if (ticks && ticks.length) {
                    if (ticksContainer.length == 0) {
                        ticksContainer = createTickContainer();
                    }
                    createTickElements(ticksContainer, ticks);
                    $el.append(ticksContainer);
                }
            }
            if (opts && opts.labels) {
                var labelsContainer = $el.children('.' + Slider.LabelContainerClass);
                var labels = _.isBoolean(opts.labels) && opts.labels ? _.range(opts.min || 0, (opts.max || 100) + (opts.step || 1), opts.step || 1) : opts.labels;
                if (labels && labels.length) {
                    labels = _.map(labels, function (label) { return _.isNumber(label) ? { index: label } : label; });
                    if (labelsContainer.length == 0) {
                        labelsContainer = createLabelContainer();
                    }
                    createLabelElements(labelsContainer, labels);
                    $el.append(labelsContainer);
                }
                opts.labels = labels;
            }
        }
        return {
            input: input,
            style: style,
        };
    }
}(jQuery);

//# sourceMappingURL=dist/js/Coveo.Slider.js.map

/*!
Chosen, a Select Box Enhancer for jQuery and Prototype
by Patrick Filler for Harvest, http://getharvest.com

Version 1.4.2
Full source at https://github.com/harvesthq/chosen
Copyright (c) 2011-2015 Harvest http://getharvest.com

MIT License, https://github.com/harvesthq/chosen/blob/master/LICENSE.md
This file is generated by `grunt build`, do not edit it by hand.
*/

(function() {
  var $, AbstractChosen, Chosen, SelectParser, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SelectParser = (function() {
    function SelectParser() {
      this.options_index = 0;
      this.parsed = [];
    }

    SelectParser.prototype.add_node = function(child) {
      if (child.nodeName.toUpperCase() === "OPTGROUP") {
        return this.add_group(child);
      } else {
        return this.add_option(child);
      }
    };

    SelectParser.prototype.add_group = function(group) {
      var group_position, option, _i, _len, _ref, _results;
      group_position = this.parsed.length;
      this.parsed.push({
        array_index: group_position,
        group: true,
        label: this.escapeExpression(group.label),
        title: group.title ? group.title : void 0,
        children: 0,
        disabled: group.disabled,
        classes: group.className
      });
      _ref = group.childNodes;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        _results.push(this.add_option(option, group_position, group.disabled));
      }
      return _results;
    };

    SelectParser.prototype.add_option = function(option, group_position, group_disabled) {
      if (option.nodeName.toUpperCase() === "OPTION") {
        if (option.text !== "") {
          if (group_position != null) {
            this.parsed[group_position].children += 1;
          }
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            value: option.value,
            text: option.text,
            html: option.innerHTML,
            title: option.title ? option.title : void 0,
            selected: option.selected,
            disabled: group_disabled === true ? group_disabled : option.disabled,
            group_array_index: group_position,
            group_label: group_position != null ? this.parsed[group_position].label : null,
            classes: option.className,
            style: option.style.cssText
          });
        } else {
          this.parsed.push({
            array_index: this.parsed.length,
            options_index: this.options_index,
            empty: true
          });
        }
        return this.options_index += 1;
      }
    };

    SelectParser.prototype.escapeExpression = function(text) {
      var map, unsafe_chars;
      if ((text == null) || text === false) {
        return "";
      }
      if (!/[\&\<\>\"\'\`]/.test(text)) {
        return text;
      }
      map = {
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
        "`": "&#x60;"
      };
      unsafe_chars = /&(?!\w+;)|[\<\>\"\'\`]/g;
      return text.replace(unsafe_chars, function(chr) {
        return map[chr] || "&amp;";
      });
    };

    return SelectParser;

  })();

  SelectParser.select_to_array = function(select) {
    var child, parser, _i, _len, _ref;
    parser = new SelectParser();
    _ref = select.childNodes;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      child = _ref[_i];
      parser.add_node(child);
    }
    return parser.parsed;
  };

  AbstractChosen = (function() {
    function AbstractChosen(form_field, options) {
      this.form_field = form_field;
      this.options = options != null ? options : {};
      if (!AbstractChosen.browser_is_supported()) {
        return;
      }
      this.is_multiple = this.form_field.multiple;
      this.set_default_text();
      this.set_default_values();
      this.setup();
      this.set_up_html();
      this.register_observers();
      this.on_ready();
    }

    AbstractChosen.prototype.set_default_values = function() {
      var _this = this;
      this.click_test_action = function(evt) {
        return _this.test_active_click(evt);
      };
      this.activate_action = function(evt) {
        return _this.activate_field(evt);
      };
      this.active_field = false;
      this.mouse_on_container = false;
      this.results_showing = false;
      this.result_highlighted = null;
      this.allow_single_deselect = (this.options.allow_single_deselect != null) && (this.form_field.options[0] != null) && this.form_field.options[0].text === "" ? this.options.allow_single_deselect : false;
      this.disable_search_threshold = this.options.disable_search_threshold || 0;
      this.disable_search = this.options.disable_search || false;
      this.enable_split_word_search = this.options.enable_split_word_search != null ? this.options.enable_split_word_search : true;
      this.group_search = this.options.group_search != null ? this.options.group_search : true;
      this.search_contains = this.options.search_contains || false;
      this.single_backstroke_delete = this.options.single_backstroke_delete != null ? this.options.single_backstroke_delete : true;
      this.max_selected_options = this.options.max_selected_options || Infinity;
      this.inherit_select_classes = this.options.inherit_select_classes || false;
      this.display_selected_options = this.options.display_selected_options != null ? this.options.display_selected_options : true;
      this.display_disabled_options = this.options.display_disabled_options != null ? this.options.display_disabled_options : true;
      this.include_group_label_in_selected = this.options.include_group_label_in_selected || false;
      return this.max_shown_results = this.options.max_shown_results || Number.POSITIVE_INFINITY;
    };

    AbstractChosen.prototype.set_default_text = function() {
      if (this.form_field.getAttribute("data-placeholder")) {
        this.default_text = this.form_field.getAttribute("data-placeholder");
      } else if (this.is_multiple) {
        this.default_text = this.options.placeholder_text_multiple || this.options.placeholder_text || AbstractChosen.default_multiple_text;
      } else {
        this.default_text = this.options.placeholder_text_single || this.options.placeholder_text || AbstractChosen.default_single_text;
      }
      return this.results_none_found = this.form_field.getAttribute("data-no_results_text") || this.options.no_results_text || AbstractChosen.default_no_result_text;
    };

    AbstractChosen.prototype.choice_label = function(item) {
      if (this.include_group_label_in_selected && (item.group_label != null)) {
        return "<b class='group-name'>" + item.group_label + "</b>" + item.html;
      } else {
        return item.html;
      }
    };

    AbstractChosen.prototype.mouse_enter = function() {
      return this.mouse_on_container = true;
    };

    AbstractChosen.prototype.mouse_leave = function() {
      return this.mouse_on_container = false;
    };

    AbstractChosen.prototype.input_focus = function(evt) {
      var _this = this;
      if (this.is_multiple) {
        if (!this.active_field) {
          return setTimeout((function() {
            return _this.container_mousedown();
          }), 50);
        }
      } else {
        if (!this.active_field) {
          return this.activate_field();
        }
      }
    };

    AbstractChosen.prototype.input_blur = function(evt) {
      var _this = this;
      if (!this.mouse_on_container) {
        this.active_field = false;
        return setTimeout((function() {
          return _this.blur_test();
        }), 100);
      }
    };

    AbstractChosen.prototype.results_option_build = function(options) {
      var content, data, data_content, shown_results, _i, _len, _ref;
      content = '';
      shown_results = 0;
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        data = _ref[_i];
        data_content = '';
        if (data.group) {
          data_content = this.result_add_group(data);
        } else {
          data_content = this.result_add_option(data);
        }
        if (data_content !== '') {
          shown_results++;
          content += data_content;
        }
        if (options != null ? options.first : void 0) {
          if (data.selected && this.is_multiple) {
            this.choice_build(data);
          } else if (data.selected && !this.is_multiple) {
            this.single_set_selected_text(this.choice_label(data));
          }
        }
        if (shown_results >= this.max_shown_results) {
          break;
        }
      }
      return content;
    };

    AbstractChosen.prototype.result_add_option = function(option) {
      var classes, option_el;
      if (!option.search_match) {
        return '';
      }
      if (!this.include_option_in_results(option)) {
        return '';
      }
      classes = [];
      if (!option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("active-result");
      }
      if (option.disabled && !(option.selected && this.is_multiple)) {
        classes.push("disabled-result");
      }
      if (option.selected) {
        classes.push("result-selected");
      }
      if (option.group_array_index != null) {
        classes.push("group-option");
      }
      if (option.classes !== "") {
        classes.push(option.classes);
      }
      option_el = document.createElement("li");
      option_el.className = classes.join(" ");
      option_el.style.cssText = option.style;
      option_el.setAttribute("data-option-array-index", option.array_index);
      option_el.innerHTML = option.search_text;
      if (option.title) {
        option_el.title = option.title;
      }
      return this.outerHTML(option_el);
    };

    AbstractChosen.prototype.result_add_group = function(group) {
      var classes, group_el;
      if (!(group.search_match || group.group_match)) {
        return '';
      }
      if (!(group.active_options > 0)) {
        return '';
      }
      classes = [];
      classes.push("group-result");
      if (group.classes) {
        classes.push(group.classes);
      }
      group_el = document.createElement("li");
      group_el.className = classes.join(" ");
      group_el.innerHTML = group.search_text;
      if (group.title) {
        group_el.title = group.title;
      }
      return this.outerHTML(group_el);
    };

    AbstractChosen.prototype.results_update_field = function() {
      this.set_default_text();
      if (!this.is_multiple) {
        this.results_reset_cleanup();
      }
      this.result_clear_highlight();
      this.results_build();
      if (this.results_showing) {
        return this.winnow_results();
      }
    };

    AbstractChosen.prototype.reset_single_select_options = function() {
      var result, _i, _len, _ref, _results;
      _ref = this.results_data;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        result = _ref[_i];
        if (result.selected) {
          _results.push(result.selected = false);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    AbstractChosen.prototype.results_toggle = function() {
      if (this.results_showing) {
        return this.results_hide();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.results_search = function(evt) {
      if (this.results_showing) {
        return this.winnow_results();
      } else {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.winnow_results = function() {
      var escapedSearchText, option, regex, results, results_group, searchText, startpos, text, zregex, _i, _len, _ref;
      this.no_results_clear();
      results = 0;
      searchText = this.get_search_text();
      escapedSearchText = searchText.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      zregex = new RegExp(escapedSearchText, 'i');
      regex = this.get_search_regex(escapedSearchText);
      _ref = this.results_data;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        option.search_match = false;
        results_group = null;
        if (this.include_option_in_results(option)) {
          if (option.group) {
            option.group_match = false;
            option.active_options = 0;
          }
          if ((option.group_array_index != null) && this.results_data[option.group_array_index]) {
            results_group = this.results_data[option.group_array_index];
            if (results_group.active_options === 0 && results_group.search_match) {
              results += 1;
            }
            results_group.active_options += 1;
          }
          option.search_text = option.group ? option.label : option.html;
          if (!(option.group && !this.group_search)) {
            option.search_match = this.search_string_match(option.search_text, regex);
            if (option.search_match && !option.group) {
              results += 1;
            }
            if (option.search_match) {
              if (searchText.length) {
                startpos = option.search_text.search(zregex);
                text = option.search_text.substr(0, startpos + searchText.length) + '</em>' + option.search_text.substr(startpos + searchText.length);
                option.search_text = text.substr(0, startpos) + '<em>' + text.substr(startpos);
              }
              if (results_group != null) {
                results_group.group_match = true;
              }
            } else if ((option.group_array_index != null) && this.results_data[option.group_array_index].search_match) {
              option.search_match = true;
            }
          }
        }
      }
      this.result_clear_highlight();
      if (results < 1 && searchText.length) {
        this.update_results_content("");
        return this.no_results(searchText);
      } else {
        this.update_results_content(this.results_option_build());
        return this.winnow_results_set_highlight();
      }
    };

    AbstractChosen.prototype.get_search_regex = function(escaped_search_string) {
      var regex_anchor;
      regex_anchor = this.search_contains ? "" : "^";
      return new RegExp(regex_anchor + escaped_search_string, 'i');
    };

    AbstractChosen.prototype.search_string_match = function(search_string, regex) {
      var part, parts, _i, _len;
      if (regex.test(search_string)) {
        return true;
      } else if (this.enable_split_word_search && (search_string.indexOf(" ") >= 0 || search_string.indexOf("[") === 0)) {
        parts = search_string.replace(/\[|\]/g, "").split(" ");
        if (parts.length) {
          for (_i = 0, _len = parts.length; _i < _len; _i++) {
            part = parts[_i];
            if (regex.test(part)) {
              return true;
            }
          }
        }
      }
    };

    AbstractChosen.prototype.choices_count = function() {
      var option, _i, _len, _ref;
      if (this.selected_option_count != null) {
        return this.selected_option_count;
      }
      this.selected_option_count = 0;
      _ref = this.form_field.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.selected) {
          this.selected_option_count += 1;
        }
      }
      return this.selected_option_count;
    };

    AbstractChosen.prototype.choices_click = function(evt) {
      evt.preventDefault();
      if (!(this.results_showing || this.is_disabled)) {
        return this.results_show();
      }
    };

    AbstractChosen.prototype.keyup_checker = function(evt) {
      var stroke, _ref;
      stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
      this.search_field_scale();
      switch (stroke) {
        case 8:
          if (this.is_multiple && this.backstroke_length < 1 && this.choices_count() > 0) {
            return this.keydown_backstroke();
          } else if (!this.pending_backstroke) {
            this.result_clear_highlight();
            return this.results_search();
          }
          break;
        case 13:
          evt.preventDefault();
          if (this.results_showing) {
            return this.result_select(evt);
          }
          break;
        case 27:
          if (this.results_showing) {
            this.results_hide();
          }
          return true;
        case 9:
        case 38:
        case 40:
        case 16:
        case 91:
        case 17:
          break;
        default:
          return this.results_search();
      }
    };

    AbstractChosen.prototype.clipboard_event_checker = function(evt) {
      var _this = this;
      return setTimeout((function() {
        return _this.results_search();
      }), 50);
    };

    AbstractChosen.prototype.container_width = function() {
      if (this.options.width != null) {
        return this.options.width;
      } else {
        return "" + this.form_field.offsetWidth + "px";
      }
    };

    AbstractChosen.prototype.include_option_in_results = function(option) {
      if (this.is_multiple && (!this.display_selected_options && option.selected)) {
        return false;
      }
      if (!this.display_disabled_options && option.disabled) {
        return false;
      }
      if (option.empty) {
        return false;
      }
      return true;
    };

    AbstractChosen.prototype.search_results_touchstart = function(evt) {
      this.touch_started = true;
      return this.search_results_mouseover(evt);
    };

    AbstractChosen.prototype.search_results_touchmove = function(evt) {
      this.touch_started = false;
      return this.search_results_mouseout(evt);
    };

    AbstractChosen.prototype.search_results_touchend = function(evt) {
      if (this.touch_started) {
        return this.search_results_mouseup(evt);
      }
    };

    AbstractChosen.prototype.outerHTML = function(element) {
      var tmp;
      if (element.outerHTML) {
        return element.outerHTML;
      }
      tmp = document.createElement("div");
      tmp.appendChild(element);
      return tmp.innerHTML;
    };

    AbstractChosen.browser_is_supported = function() {
      if (/iP(od|hone)/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Android/i.test(window.navigator.userAgent)) {
        if (/Mobile/i.test(window.navigator.userAgent)) {
          return false;
        }
      }
      if (/IEMobile/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/Windows Phone/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/BlackBerry/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (/BB10/i.test(window.navigator.userAgent)) {
        return false;
      }
      if (window.navigator.appName === "Microsoft Internet Explorer") {
        return document.documentMode >= 8;
      }
      return true;
    };

    AbstractChosen.default_multiple_text = "Select Some Options";

    AbstractChosen.default_single_text = "Select an Option";

    AbstractChosen.default_no_result_text = "No results match";

    return AbstractChosen;

  })();

  $ = jQuery;

  $.fn.extend({
    chosen: function(options) {
      if (!AbstractChosen.browser_is_supported()) {
        return this;
      }
      return this.each(function(input_field) {
        var $this, chosen;
        $this = $(this);
        chosen = $this.data('chosen');
        if (options === 'destroy') {
          if (chosen instanceof Chosen) {
            chosen.destroy();
          }
          return;
        }
        if (!(chosen instanceof Chosen)) {
          $this.data('chosen', new Chosen(this, options));
        }
      });
    }
  });

  Chosen = (function(_super) {
    __extends(Chosen, _super);

    function Chosen() {
      _ref = Chosen.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Chosen.prototype.setup = function() {
      this.form_field_jq = $(this.form_field);
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.is_rtl = this.form_field_jq.hasClass("chosen-rtl");
    };

    Chosen.prototype.set_up_html = function() {
      var container_classes, container_props;
      container_classes = ["chosen-container"];
      container_classes.push("chosen-container-" + (this.is_multiple ? "multi" : "single"));
      if (this.inherit_select_classes && this.form_field.className) {
        container_classes.push(this.form_field.className);
      }
      if (this.is_rtl) {
        container_classes.push("chosen-rtl");
      }
      container_props = {
        'class': container_classes.join(' '),
        'style': "width: " + (this.container_width()) + ";",
        'title': this.form_field.title
      };
      if (this.form_field.id.length) {
        container_props.id = this.form_field.id.replace(/[^\w]/g, '_') + "_chosen";
      }
      this.container = $("<div />", container_props);
      if (this.is_multiple) {
        this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="' + this.default_text + '" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>');
      } else {
        this.container.html('<a class="chosen-single chosen-default"><span>' + this.default_text + '</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>');
      }
      this.form_field_jq.hide().after(this.container);
      this.dropdown = this.container.find('div.chosen-drop').first();
      this.search_field = this.container.find('input').first();
      this.search_results = this.container.find('ul.chosen-results').first();
      this.search_field_scale();
      this.search_no_results = this.container.find('li.no-results').first();
      if (this.is_multiple) {
        this.search_choices = this.container.find('ul.chosen-choices').first();
        this.search_container = this.container.find('li.search-field').first();
      } else {
        this.search_container = this.container.find('div.chosen-search').first();
        this.selected_item = this.container.find('.chosen-single').first();
      }
      this.results_build();
      this.set_tab_index();
      return this.set_label_behavior();
    };

    Chosen.prototype.on_ready = function() {
      return this.form_field_jq.trigger("chosen:ready", {
        chosen: this
      });
    };

    Chosen.prototype.register_observers = function() {
      var _this = this;
      this.container.bind('touchstart.chosen', function(evt) {
        _this.container_mousedown(evt);
        return evt.preventDefault();
      });
      this.container.bind('touchend.chosen', function(evt) {
        _this.container_mouseup(evt);
        return evt.preventDefault();
      });
      this.container.bind('mousedown.chosen', function(evt) {
        _this.container_mousedown(evt);
      });
      this.container.bind('mouseup.chosen', function(evt) {
        _this.container_mouseup(evt);
      });
      this.container.bind('mouseenter.chosen', function(evt) {
        _this.mouse_enter(evt);
      });
      this.container.bind('mouseleave.chosen', function(evt) {
        _this.mouse_leave(evt);
      });
      this.search_results.bind('mouseup.chosen', function(evt) {
        _this.search_results_mouseup(evt);
      });
      this.search_results.bind('mouseover.chosen', function(evt) {
        _this.search_results_mouseover(evt);
      });
      this.search_results.bind('mouseout.chosen', function(evt) {
        _this.search_results_mouseout(evt);
      });
      this.search_results.bind('mousewheel.chosen DOMMouseScroll.chosen', function(evt) {
        _this.search_results_mousewheel(evt);
      });
      this.search_results.bind('touchstart.chosen', function(evt) {
        _this.search_results_touchstart(evt);
      });
      this.search_results.bind('touchmove.chosen', function(evt) {
        _this.search_results_touchmove(evt);
      });
      this.search_results.bind('touchend.chosen', function(evt) {
        _this.search_results_touchend(evt);
      });
      this.form_field_jq.bind("chosen:updated.chosen", function(evt) {
        _this.results_update_field(evt);
      });
      this.form_field_jq.bind("chosen:activate.chosen", function(evt) {
        _this.activate_field(evt);
      });
      this.form_field_jq.bind("chosen:open.chosen", function(evt) {
        _this.container_mousedown(evt);
      });
      this.form_field_jq.bind("chosen:close.chosen", function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('blur.chosen', function(evt) {
        _this.input_blur(evt);
      });
      this.search_field.bind('keyup.chosen', function(evt) {
        _this.keyup_checker(evt);
      });
      this.search_field.bind('keydown.chosen', function(evt) {
        _this.keydown_checker(evt);
      });
      this.search_field.bind('focus.chosen', function(evt) {
        _this.input_focus(evt);
      });
      this.search_field.bind('cut.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      this.search_field.bind('paste.chosen', function(evt) {
        _this.clipboard_event_checker(evt);
      });
      if (this.is_multiple) {
        return this.search_choices.bind('click.chosen', function(evt) {
          _this.choices_click(evt);
        });
      } else {
        return this.container.bind('click.chosen', function(evt) {
          evt.preventDefault();
        });
      }
    };

    Chosen.prototype.destroy = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      if (this.search_field[0].tabIndex) {
        this.form_field_jq[0].tabIndex = this.search_field[0].tabIndex;
      }
      this.container.remove();
      this.form_field_jq.removeData('chosen');
      return this.form_field_jq.show();
    };

    Chosen.prototype.search_field_disabled = function() {
      this.is_disabled = this.form_field_jq[0].disabled;
      if (this.is_disabled) {
        this.container.addClass('chosen-disabled');
        this.search_field[0].disabled = true;
        if (!this.is_multiple) {
          this.selected_item.unbind("focus.chosen", this.activate_action);
        }
        return this.close_field();
      } else {
        this.container.removeClass('chosen-disabled');
        this.search_field[0].disabled = false;
        if (!this.is_multiple) {
          return this.selected_item.bind("focus.chosen", this.activate_action);
        }
      }
    };

    Chosen.prototype.container_mousedown = function(evt) {
      if (!this.is_disabled) {
        if (evt && evt.type === "mousedown" && !this.results_showing) {
          evt.preventDefault();
        }
        if (!((evt != null) && ($(evt.target)).hasClass("search-choice-close"))) {
          if (!this.active_field) {
            if (this.is_multiple) {
              this.search_field.val("");
            }
            $(this.container[0].ownerDocument).bind('click.chosen', this.click_test_action);
            this.results_show();
          } else if (!this.is_multiple && evt && (($(evt.target)[0] === this.selected_item[0]) || $(evt.target).parents("a.chosen-single").length)) {
            evt.preventDefault();
            this.results_toggle();
          }
          return this.activate_field();
        }
      }
    };

    Chosen.prototype.container_mouseup = function(evt) {
      if (evt.target.nodeName === "ABBR" && !this.is_disabled) {
        return this.results_reset(evt);
      }
    };

    Chosen.prototype.search_results_mousewheel = function(evt) {
      var delta;
      if (evt.originalEvent) {
        delta = evt.originalEvent.deltaY || -evt.originalEvent.wheelDelta || evt.originalEvent.detail;
      }
      if (delta != null) {
        evt.preventDefault();
        if (evt.type === 'DOMMouseScroll') {
          delta = delta * 40;
        }
        return this.search_results.scrollTop(delta + this.search_results.scrollTop());
      }
    };

    Chosen.prototype.blur_test = function(evt) {
      if (!this.active_field && this.container.hasClass("chosen-container-active")) {
        return this.close_field();
      }
    };

    Chosen.prototype.close_field = function() {
      $(this.container[0].ownerDocument).unbind("click.chosen", this.click_test_action);
      this.active_field = false;
      this.results_hide();
      this.container.removeClass("chosen-container-active");
      this.clear_backstroke();
      this.show_search_field_default();
      return this.search_field_scale();
    };

    Chosen.prototype.activate_field = function() {
      this.container.addClass("chosen-container-active");
      this.active_field = true;
      this.search_field.val(this.search_field.val());
      return this.search_field.focus();
    };

    Chosen.prototype.test_active_click = function(evt) {
      var active_container;
      active_container = $(evt.target).closest('.chosen-container');
      if (active_container.length && this.container[0] === active_container[0]) {
        return this.active_field = true;
      } else {
        return this.close_field();
      }
    };

    Chosen.prototype.results_build = function() {
      this.parsing = true;
      this.selected_option_count = null;
      this.results_data = SelectParser.select_to_array(this.form_field);
      if (this.is_multiple) {
        this.search_choices.find("li.search-choice").remove();
      } else if (!this.is_multiple) {
        this.single_set_selected_text();
        if (this.disable_search || this.form_field.options.length <= this.disable_search_threshold) {
          this.search_field[0].readOnly = true;
          this.container.addClass("chosen-container-single-nosearch");
        } else {
          this.search_field[0].readOnly = false;
          this.container.removeClass("chosen-container-single-nosearch");
        }
      }
      this.update_results_content(this.results_option_build({
        first: true
      }));
      this.search_field_disabled();
      this.show_search_field_default();
      this.search_field_scale();
      return this.parsing = false;
    };

    Chosen.prototype.result_do_highlight = function(el) {
      var high_bottom, high_top, maxHeight, visible_bottom, visible_top;
      if (el.length) {
        this.result_clear_highlight();
        this.result_highlight = el;
        this.result_highlight.addClass("highlighted");
        maxHeight = parseInt(this.search_results.css("maxHeight"), 10);
        visible_top = this.search_results.scrollTop();
        visible_bottom = maxHeight + visible_top;
        high_top = this.result_highlight.position().top + this.search_results.scrollTop();
        high_bottom = high_top + this.result_highlight.outerHeight();
        if (high_bottom >= visible_bottom) {
          return this.search_results.scrollTop((high_bottom - maxHeight) > 0 ? high_bottom - maxHeight : 0);
        } else if (high_top < visible_top) {
          return this.search_results.scrollTop(high_top);
        }
      }
    };

    Chosen.prototype.result_clear_highlight = function() {
      if (this.result_highlight) {
        this.result_highlight.removeClass("highlighted");
      }
      return this.result_highlight = null;
    };

    Chosen.prototype.results_show = function() {
      if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
        this.form_field_jq.trigger("chosen:maxselected", {
          chosen: this
        });
        return false;
      }
      this.container.addClass("chosen-with-drop");
      this.results_showing = true;
      this.search_field.focus();
      this.search_field.val(this.search_field.val());
      this.winnow_results();
      return this.form_field_jq.trigger("chosen:showing_dropdown", {
        chosen: this
      });
    };

    Chosen.prototype.update_results_content = function(content) {
      return this.search_results.html(content);
    };

    Chosen.prototype.results_hide = function() {
      if (this.results_showing) {
        this.result_clear_highlight();
        this.container.removeClass("chosen-with-drop");
        this.form_field_jq.trigger("chosen:hiding_dropdown", {
          chosen: this
        });
      }
      return this.results_showing = false;
    };

    Chosen.prototype.set_tab_index = function(el) {
      var ti;
      if (this.form_field.tabIndex) {
        ti = this.form_field.tabIndex;
        this.form_field.tabIndex = -1;
        return this.search_field[0].tabIndex = ti;
      }
    };

    Chosen.prototype.set_label_behavior = function() {
      var _this = this;
      this.form_field_label = this.form_field_jq.parents("label");
      if (!this.form_field_label.length && this.form_field.id.length) {
        this.form_field_label = $("label[for='" + this.form_field.id + "']");
      }
      if (this.form_field_label.length > 0) {
        return this.form_field_label.bind('click.chosen', function(evt) {
          if (_this.is_multiple) {
            return _this.container_mousedown(evt);
          } else {
            return _this.activate_field();
          }
        });
      }
    };

    Chosen.prototype.show_search_field_default = function() {
      if (this.is_multiple && this.choices_count() < 1 && !this.active_field) {
        this.search_field.val(this.default_text);
        return this.search_field.addClass("default");
      } else {
        this.search_field.val("");
        return this.search_field.removeClass("default");
      }
    };

    Chosen.prototype.search_results_mouseup = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target.length) {
        this.result_highlight = target;
        this.result_select(evt);
        return this.search_field.focus();
      }
    };

    Chosen.prototype.search_results_mouseover = function(evt) {
      var target;
      target = $(evt.target).hasClass("active-result") ? $(evt.target) : $(evt.target).parents(".active-result").first();
      if (target) {
        return this.result_do_highlight(target);
      }
    };

    Chosen.prototype.search_results_mouseout = function(evt) {
      if ($(evt.target).hasClass("active-result" || $(evt.target).parents('.active-result').first())) {
        return this.result_clear_highlight();
      }
    };

    Chosen.prototype.choice_build = function(item) {
      var choice, close_link,
        _this = this;
      choice = $('<li />', {
        "class": "search-choice"
      }).html("<span>" + (this.choice_label(item)) + "</span>");
      if (item.disabled) {
        choice.addClass('search-choice-disabled');
      } else {
        close_link = $('<a />', {
          "class": 'search-choice-close',
          'data-option-array-index': item.array_index
        });
        close_link.bind('click.chosen', function(evt) {
          return _this.choice_destroy_link_click(evt);
        });
        choice.append(close_link);
      }
      return this.search_container.before(choice);
    };

    Chosen.prototype.choice_destroy_link_click = function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if (!this.is_disabled) {
        return this.choice_destroy($(evt.target));
      }
    };

    Chosen.prototype.choice_destroy = function(link) {
      if (this.result_deselect(link[0].getAttribute("data-option-array-index"))) {
        this.show_search_field_default();
        if (this.is_multiple && this.choices_count() > 0 && this.search_field.val().length < 1) {
          this.results_hide();
        }
        link.parents('li').first().remove();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.results_reset = function() {
      this.reset_single_select_options();
      this.form_field.options[0].selected = true;
      this.single_set_selected_text();
      this.show_search_field_default();
      this.results_reset_cleanup();
      this.form_field_jq.trigger("change");
      if (this.active_field) {
        return this.results_hide();
      }
    };

    Chosen.prototype.results_reset_cleanup = function() {
      this.current_selectedIndex = this.form_field.selectedIndex;
      return this.selected_item.find("abbr").remove();
    };

    Chosen.prototype.result_select = function(evt) {
      var high, item;
      if (this.result_highlight) {
        high = this.result_highlight;
        this.result_clear_highlight();
        if (this.is_multiple && this.max_selected_options <= this.choices_count()) {
          this.form_field_jq.trigger("chosen:maxselected", {
            chosen: this
          });
          return false;
        }
        if (this.is_multiple) {
          high.removeClass("active-result");
        } else {
          this.reset_single_select_options();
        }
        high.addClass("result-selected");
        item = this.results_data[high[0].getAttribute("data-option-array-index")];
        item.selected = true;
        this.form_field.options[item.options_index].selected = true;
        this.selected_option_count = null;
        if (this.is_multiple) {
          this.choice_build(item);
        } else {
          this.single_set_selected_text(this.choice_label(item));
        }
        if (!((evt.metaKey || evt.ctrlKey) && this.is_multiple)) {
          this.results_hide();
        }
        this.show_search_field_default();
        if (this.is_multiple || this.form_field.selectedIndex !== this.current_selectedIndex) {
          this.form_field_jq.trigger("change", {
            'selected': this.form_field.options[item.options_index].value
          });
        }
        this.current_selectedIndex = this.form_field.selectedIndex;
        evt.preventDefault();
        return this.search_field_scale();
      }
    };

    Chosen.prototype.single_set_selected_text = function(text) {
      if (text == null) {
        text = this.default_text;
      }
      if (text === this.default_text) {
        this.selected_item.addClass("chosen-default");
      } else {
        this.single_deselect_control_build();
        this.selected_item.removeClass("chosen-default");
      }
      return this.selected_item.find("span").html(text);
    };

    Chosen.prototype.result_deselect = function(pos) {
      var result_data;
      result_data = this.results_data[pos];
      if (!this.form_field.options[result_data.options_index].disabled) {
        result_data.selected = false;
        this.form_field.options[result_data.options_index].selected = false;
        this.selected_option_count = null;
        this.result_clear_highlight();
        if (this.results_showing) {
          this.winnow_results();
        }
        this.form_field_jq.trigger("change", {
          deselected: this.form_field.options[result_data.options_index].value
        });
        this.search_field_scale();
        return true;
      } else {
        return false;
      }
    };

    Chosen.prototype.single_deselect_control_build = function() {
      if (!this.allow_single_deselect) {
        return;
      }
      if (!this.selected_item.find("abbr").length) {
        this.selected_item.find("span").first().after("<abbr class=\"search-choice-close\"></abbr>");
      }
      return this.selected_item.addClass("chosen-single-with-deselect");
    };

    Chosen.prototype.get_search_text = function() {
      return $('<div/>').text($.trim(this.search_field.val())).html();
    };

    Chosen.prototype.winnow_results_set_highlight = function() {
      var do_high, selected_results;
      selected_results = !this.is_multiple ? this.search_results.find(".result-selected.active-result") : [];
      do_high = selected_results.length ? selected_results.first() : this.search_results.find(".active-result").first();
      if (do_high != null) {
        return this.result_do_highlight(do_high);
      }
    };

    Chosen.prototype.no_results = function(terms) {
      var no_results_html;
      no_results_html = $('<li class="no-results">' + this.results_none_found + ' "<span></span>"</li>');
      no_results_html.find("span").first().html(terms);
      this.search_results.append(no_results_html);
      return this.form_field_jq.trigger("chosen:no_results", {
        chosen: this
      });
    };

    Chosen.prototype.no_results_clear = function() {
      return this.search_results.find(".no-results").remove();
    };

    Chosen.prototype.keydown_arrow = function() {
      var next_sib;
      if (this.results_showing && this.result_highlight) {
        next_sib = this.result_highlight.nextAll("li.active-result").first();
        if (next_sib) {
          return this.result_do_highlight(next_sib);
        }
      } else {
        return this.results_show();
      }
    };

    Chosen.prototype.keyup_arrow = function() {
      var prev_sibs;
      if (!this.results_showing && !this.is_multiple) {
        return this.results_show();
      } else if (this.result_highlight) {
        prev_sibs = this.result_highlight.prevAll("li.active-result");
        if (prev_sibs.length) {
          return this.result_do_highlight(prev_sibs.first());
        } else {
          if (this.choices_count() > 0) {
            this.results_hide();
          }
          return this.result_clear_highlight();
        }
      }
    };

    Chosen.prototype.keydown_backstroke = function() {
      var next_available_destroy;
      if (this.pending_backstroke) {
        this.choice_destroy(this.pending_backstroke.find("a").first());
        return this.clear_backstroke();
      } else {
        next_available_destroy = this.search_container.siblings("li.search-choice").last();
        if (next_available_destroy.length && !next_available_destroy.hasClass("search-choice-disabled")) {
          this.pending_backstroke = next_available_destroy;
          if (this.single_backstroke_delete) {
            return this.keydown_backstroke();
          } else {
            return this.pending_backstroke.addClass("search-choice-focus");
          }
        }
      }
    };

    Chosen.prototype.clear_backstroke = function() {
      if (this.pending_backstroke) {
        this.pending_backstroke.removeClass("search-choice-focus");
      }
      return this.pending_backstroke = null;
    };

    Chosen.prototype.keydown_checker = function(evt) {
      var stroke, _ref1;
      stroke = (_ref1 = evt.which) != null ? _ref1 : evt.keyCode;
      this.search_field_scale();
      if (stroke !== 8 && this.pending_backstroke) {
        this.clear_backstroke();
      }
      switch (stroke) {
        case 8:
          this.backstroke_length = this.search_field.val().length;
          break;
        case 9:
          if (this.results_showing && !this.is_multiple) {
            this.result_select(evt);
          }
          this.mouse_on_container = false;
          break;
        case 13:
          if (this.results_showing) {
            evt.preventDefault();
          }
          break;
        case 32:
          if (this.disable_search) {
            evt.preventDefault();
          }
          break;
        case 38:
          evt.preventDefault();
          this.keyup_arrow();
          break;
        case 40:
          evt.preventDefault();
          this.keydown_arrow();
          break;
      }
    };

    Chosen.prototype.search_field_scale = function() {
      var div, f_width, h, style, style_block, styles, w, _i, _len;
      if (this.is_multiple) {
        h = 0;
        w = 0;
        style_block = "position:absolute; left: -1000px; top: -1000px; display:none;";
        styles = ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height', 'text-transform', 'letter-spacing'];
        for (_i = 0, _len = styles.length; _i < _len; _i++) {
          style = styles[_i];
          style_block += style + ":" + this.search_field.css(style) + ";";
        }
        div = $('<div />', {
          'style': style_block
        });
        div.text(this.search_field.val());
        $('body').append(div);
        w = div.width() + 25;
        div.remove();
        f_width = this.container.outerWidth();
        if (w > f_width - 10) {
          w = f_width - 10;
        }
        return this.search_field.css({
          'width': w + 'px'
        });
      }
    };

    return Chosen;

  })(AbstractChosen);

}).call(this);

/*
 * jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
 *
 * Uses the built in easing capabilities added In jQuery 1.1
 * to offer multiple easing options
 *
 * TERMS OF USE - jQuery Easing
 *
 * Open source under the BSD License.
 *
 * Copyright © 2008 George McGinley Smith
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
*/

// t: current time, b: begInnIng value, c: change In value, d: duration
jQuery.easing['jswing'] = jQuery.easing['swing'];

jQuery.extend( jQuery.easing,
{
	def: 'easeOutQuad',
	swing: function (x, t, b, c, d) {
		//alert(jQuery.easing.default);
		return jQuery.easing[jQuery.easing.def](x, t, b, c, d);
	},
	easeInQuad: function (x, t, b, c, d) {
		return c*(t/=d)*t + b;
	},
	easeOutQuad: function (x, t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	},
	easeInOutQuad: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	},
	easeInCubic: function (x, t, b, c, d) {
		return c*(t/=d)*t*t + b;
	},
	easeOutCubic: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	},
	easeInOutCubic: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	},
	easeInQuart: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	},
	easeOutQuart: function (x, t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	},
	easeInOutQuart: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	},
	easeInQuint: function (x, t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	},
	easeOutQuint: function (x, t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	},
	easeInOutQuint: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	},
	easeInSine: function (x, t, b, c, d) {
		return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
	},
	easeOutSine: function (x, t, b, c, d) {
		return c * Math.sin(t/d * (Math.PI/2)) + b;
	},
	easeInOutSine: function (x, t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	},
	easeInExpo: function (x, t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
	},
	easeOutExpo: function (x, t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	},
	easeInOutExpo: function (x, t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	easeInCirc: function (x, t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	},
	easeOutCirc: function (x, t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	},
	easeInOutCirc: function (x, t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	},
	easeInElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	},
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	},
	easeInOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
	},
	easeInBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	},
	easeOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	},
	easeInOutBack: function (x, t, b, c, d, s) {
		if (s == undefined) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	},
	easeInBounce: function (x, t, b, c, d) {
		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
	},
	easeOutBounce: function (x, t, b, c, d) {
		if ((t/=d) < (1/2.75)) {
			return c*(7.5625*t*t) + b;
		} else if (t < (2/2.75)) {
			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
		} else if (t < (2.5/2.75)) {
			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
		} else {
			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
		}
	},
	easeInOutBounce: function (x, t, b, c, d) {
		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
	}
});

/*
 *
 * TERMS OF USE - EASING EQUATIONS
 *
 * Open source under the BSD License.
 *
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice, this list of
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list
 * of conditions and the following disclaimer in the documentation and/or other materials
 * provided with the distribution.
 *
 * Neither the name of the author nor the names of contributors may be used to endorse
 * or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */
(function ($) {
  $.fn.collapsible = function(options, methodParam) {
    var defaults = {
      accordion: undefined,
      onOpen: undefined,
      onClose: undefined
    };

    var methodName = options;
    options = $.extend(defaults, options);


    return this.each(function() {

      var $this = $(this);

      var $panel_headers = $(this).find('> li > .collapsible-header');

      var collapsible_type = $this.data("collapsible");

      /****************
      Helper Functions
      ****************/

      // Accordion Open
      function accordionOpen(object) {
        $panel_headers = $this.find('> li > .collapsible-header');
        if (object.hasClass('active')) {
          object.parent().addClass('active');
        }
        else {
          object.parent().removeClass('active');
        }
        if (object.parent().hasClass('active')){
          object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }
        else{
          object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }

        $panel_headers.not(object).removeClass('active').parent().removeClass('active');

        // Close previously open accordion elements.
        $panel_headers.not(object).parent().children('.collapsible-body').stop(true,false).each(function() {
          if ($(this).is(':visible')) {
            $(this).slideUp({
              duration: 350,
              easing: "easeOutQuart",
              queue: false,
              complete:
                function() {
                  $(this).css('height', '');
                  execCallbacks($(this).siblings('.collapsible-header'));
                }
            });
          }
        });
      }

      // Expandable Open
      function expandableOpen(object) {
        if (object.hasClass('active')) {
          object.parent().addClass('active');
        }
        else {
          object.parent().removeClass('active');
        }
        if (object.parent().hasClass('active')){
          object.siblings('.collapsible-body').stop(true,false).slideDown({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }
        else {
          object.siblings('.collapsible-body').stop(true,false).slideUp({ duration: 350, easing: "easeOutQuart", queue: false, complete: function() {$(this).css('height', '');}});
        }
      }

      // Open collapsible. object: .collapsible-header
      function collapsibleOpen(object, noToggle) {
        if (!noToggle) {
          object.toggleClass('active');
        }

        if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
          accordionOpen(object);
        } else { // Handle Expandables
          expandableOpen(object);
        }

        execCallbacks(object);
      }

      // Handle callbacks
      function execCallbacks(object) {
        if (object.hasClass('active')) {
          if (typeof(options.onOpen) === "function") {
            options.onOpen.call(this, object.parent());
          }
        } else {
          if (typeof(options.onClose) === "function") {
            options.onClose.call(this, object.parent());
          }
        }
      }

      /**
       * Check if object is children of panel header
       * @param  {Object}  object Jquery object
       * @return {Boolean} true if it is children
       */
      function isChildrenOfPanelHeader(object) {

        var panelHeader = getPanelHeader(object);

        return panelHeader.length > 0;
      }

      /**
       * Get panel header from a children element
       * @param  {Object} object Jquery object
       * @return {Object} panel header object
       */
      function getPanelHeader(object) {

        return object.closest('li > .collapsible-header');
      }


      // Turn off any existing event handlers
      function removeEventHandlers() {
        $this.off('click.collapse', '> li > .collapsible-header');
      }

      /*****  End Helper Functions  *****/


      // Methods
      if (methodName === 'destroy') {
        removeEventHandlers();
        return;
      } else if (methodParam >= 0 &&
          methodParam < $panel_headers.length) {
        var $curr_header = $panel_headers.eq(methodParam);
        if ($curr_header.length &&
            (methodName === 'open' ||
            (methodName === 'close' &&
            $curr_header.hasClass('active')))) {
          collapsibleOpen($curr_header);
        }
        return;
      }


      removeEventHandlers();


      // Add click handler to only direct collapsible header children
      $this.on('click.collapse', '> li > .collapsible-header', function(e) {
        var element = $(e.target);

        if (isChildrenOfPanelHeader(element)) {
          element = getPanelHeader(element);
        }

        collapsibleOpen(element);
      });


      // Open first active
      if (options.accordion || collapsible_type === "accordion" || collapsible_type === undefined) { // Handle Accordion
        collapsibleOpen($panel_headers.filter('.active').first(), true);

      } else { // Handle Expandables
        $panel_headers.filter('.active').each(function() {
          collapsibleOpen($(this), true);
        });
      }

    });
  };

  $(document).ready(function(){
    $('.collapsible').collapsible();
  });
}( jQuery ));
// DEPRECATED!!! Replaced by collapsible.js from Dogfalo/materialize

/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // COLLAPSE PUBLIC CLASS DEFINITION
    // ================================

    var Collapse = function (element, options) {
        this.$element = $(element)
        this.options = $.extend({}, Collapse.DEFAULTS, options)
        this.$trigger = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
            '[data-toggle="collapse"][data-target="#' + element.id + '"]')
        this.transitioning = null

        if (this.options.parent) {
            this.$parent = this.getParent()
        } else {
            this.addAriaAndCollapsedClass(this.$element, this.$trigger)
        }

        if (this.options.toggle) this.toggle()
    }

    Collapse.VERSION = '3.3.5'

    Collapse.TRANSITION_DURATION = 350

    Collapse.DEFAULTS = {
        toggle: true
    }

    Collapse.prototype.dimension = function () {
        var hasWidth = this.$element.hasClass('width')
        return hasWidth ? 'width' : 'height'
    }

    Collapse.prototype.show = function () {
        if (this.transitioning || this.$element.hasClass('in')) return

        var activesData
        var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

        if (actives && actives.length) {
            activesData = actives.data('bs.collapse')
            if (activesData && activesData.transitioning) return
        }

        var startEvent = $.Event('show.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        if (actives && actives.length) {
            Plugin.call(actives, 'hide')
            activesData || actives.data('bs.collapse', null)
        }

        var dimension = this.dimension()

        this.$element
            .removeClass('collapse')
            .addClass('collapsing')[dimension](0)
            .attr('aria-expanded', true)

        this.$trigger
            .removeClass('collapsed')
            .attr('aria-expanded', true)

        this.transitioning = 1

        var complete = function () {
            this.$element
                .removeClass('collapsing')
                .addClass('collapse in')[dimension]('')
            this.transitioning = 0
            this.$element
                .trigger('shown.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        var scrollSize = $.camelCase(['scroll', dimension].join('-'))

        this.$element
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
    }

    Collapse.prototype.hide = function () {
        if (this.transitioning || !this.$element.hasClass('in')) return

        var startEvent = $.Event('hide.bs.collapse')
        this.$element.trigger(startEvent)
        if (startEvent.isDefaultPrevented()) return

        var dimension = this.dimension()

        this.$element[dimension](this.$element[dimension]())[0].offsetHeight

        this.$element
            .addClass('collapsing')
            .removeClass('collapse in')
            .attr('aria-expanded', false)

        this.$trigger
            .addClass('collapsed')
            .attr('aria-expanded', false)

        this.transitioning = 1

        var complete = function () {
            this.transitioning = 0
            this.$element
                .removeClass('collapsing')
                .addClass('collapse')
                .trigger('hidden.bs.collapse')
        }

        if (!$.support.transition) return complete.call(this)

        this.$element
            [dimension](0)
            .one('bsTransitionEnd', $.proxy(complete, this))
            .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
    }

    Collapse.prototype.toggle = function () {
        this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

    Collapse.prototype.getParent = function () {
        return $(this.options.parent)
            .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
            .each($.proxy(function (i, element) {
                var $element = $(element)
                this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
            }, this))
            .end()
    }

    Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
        var isOpen = $element.hasClass('in')

        $element.attr('aria-expanded', isOpen)
        $trigger
            .toggleClass('collapsed', !isOpen)
            .attr('aria-expanded', isOpen)
    }

    function getTargetFromTrigger($trigger) {
        var href
        var target = $trigger.attr('data-target')
            || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

        return $(target)
    }


    // COLLAPSE PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('bs.collapse')
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

            if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
            if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.collapse

    $.fn.collapse = Plugin
    $.fn.collapse.Constructor = Collapse


    // COLLAPSE NO CONFLICT
    // ====================

    $.fn.collapse.noConflict = function () {
        $.fn.collapse = old
        return this
    }


    // COLLAPSE DATA-API
    // =================

    $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
        var $this = $(this)

        if (!$this.attr('data-target')) e.preventDefault()

        var $target = getTargetFromTrigger($this)
        var data = $target.data('bs.collapse')
        var option = data ? 'toggle' : $this.data()

        Plugin.call($target, option)
    })

}(jQuery);

/**
 * DatePicker 1.0.0
 *
 * A jQuery-based DatePicker that provides an easy way of creating both single
 * and multi-viewed calendars capable of accepting single, range, and multiple
 * selected dates.  Easily styled with two example styles provided: an attractive
 * 'dark' style, and a Google Analytics-like 'clean' style.
 *
 * View project page for Examples and Documentation:
 * http://foxrunsoftware.github.com/DatePicker/
 *
 * This project is distinct from and not affiliated with the jquery.ui.datepicker.
 *
 * Copyright 2012, Justin Stern (www.foxrunsoftware.net)
 * Dual licensed under the MIT and GPL Version 2 licenses.
 *
 * Based on Work by Original Author: Stefan Petre www.eyecon.ro
 *
 * Depends:
 *   jquery.js
 */
(function ($) {
    var DatePicker = function () {
        var ids = {},
            views = {
                years: 'datepickerViewYears',
                moths: 'datepickerViewMonths',
                days: 'datepickerViewDays'
            },
            tpl = {
                wrapper: '<div class="datepicker"><div class="datepickerBorderT" /><div class="datepickerBorderB" /><div class="datepickerBorderL" /><div class="datepickerBorderR" /><div class="datepickerBorderTL" /><div class="datepickerBorderTR" /><div class="datepickerBorderBL" /><div class="datepickerBorderBR" /><div class="datepickerContainer"><table class="datepicker-table" cellspacing="0" cellpadding="0"><tbody><tr></tr></tbody></table></div></div>',
                head: [
                    '<td class="datepickerBlock">',
                    '<table class="datepicker-table" cellspacing="0" cellpadding="0">',
                    '<thead>',
                    '<tr>',
                    '<th colspan="7"><a class="datepickerGoPrev" href="#"><span><%=prev%></span></a>',
                    '<a class="datepickerMonth" href="#"><span></span></a>',
                    '<a class="datepickerGoNext" href="#"><span><%=next%></span></a></th>',
                    '</tr>',
                    '<tr class="datepickerDoW">',
                    '<th><span><%=day1%></span></th>',
                    '<th><span><%=day2%></span></th>',
                    '<th><span><%=day3%></span></th>',
                    '<th><span><%=day4%></span></th>',
                    '<th><span><%=day5%></span></th>',
                    '<th><span><%=day6%></span></th>',
                    '<th><span><%=day7%></span></th>',
                    '</tr>',
                    '</thead>',
                    '</table></td>'
                ],
                space: '<td class="datepickerSpace"><div></div></td>',
                days: [
                    '<tbody class="datepickerDays">',
                    '<tr>',
                    '<td class="<%=weeks[0].days[0].classname%>"><a href="#"><span><%=weeks[0].days[0].text%></span></a></td>',
                    '<td class="<%=weeks[0].days[1].classname%>"><a href="#"><span><%=weeks[0].days[1].text%></span></a></td>',
                    '<td class="<%=weeks[0].days[2].classname%>"><a href="#"><span><%=weeks[0].days[2].text%></span></a></td>',
                    '<td class="<%=weeks[0].days[3].classname%>"><a href="#"><span><%=weeks[0].days[3].text%></span></a></td>',
                    '<td class="<%=weeks[0].days[4].classname%>"><a href="#"><span><%=weeks[0].days[4].text%></span></a></td>',
                    '<td class="<%=weeks[0].days[5].classname%>"><a href="#"><span><%=weeks[0].days[5].text%></span></a></td>',
                    '<td class="<%=weeks[0].days[6].classname%>"><a href="#"><span><%=weeks[0].days[6].text%></span></a></td>',
                    '</tr>',
                    '<tr>',
                    '<td class="<%=weeks[1].days[0].classname%>"><a href="#"><span><%=weeks[1].days[0].text%></span></a></td>',
                    '<td class="<%=weeks[1].days[1].classname%>"><a href="#"><span><%=weeks[1].days[1].text%></span></a></td>',
                    '<td class="<%=weeks[1].days[2].classname%>"><a href="#"><span><%=weeks[1].days[2].text%></span></a></td>',
                    '<td class="<%=weeks[1].days[3].classname%>"><a href="#"><span><%=weeks[1].days[3].text%></span></a></td>',
                    '<td class="<%=weeks[1].days[4].classname%>"><a href="#"><span><%=weeks[1].days[4].text%></span></a></td>',
                    '<td class="<%=weeks[1].days[5].classname%>"><a href="#"><span><%=weeks[1].days[5].text%></span></a></td>',
                    '<td class="<%=weeks[1].days[6].classname%>"><a href="#"><span><%=weeks[1].days[6].text%></span></a></td>',
                    '</tr>',
                    '<tr>',
                    '<td class="<%=weeks[2].days[0].classname%>"><a href="#"><span><%=weeks[2].days[0].text%></span></a></td>',
                    '<td class="<%=weeks[2].days[1].classname%>"><a href="#"><span><%=weeks[2].days[1].text%></span></a></td>',
                    '<td class="<%=weeks[2].days[2].classname%>"><a href="#"><span><%=weeks[2].days[2].text%></span></a></td>',
                    '<td class="<%=weeks[2].days[3].classname%>"><a href="#"><span><%=weeks[2].days[3].text%></span></a></td>',
                    '<td class="<%=weeks[2].days[4].classname%>"><a href="#"><span><%=weeks[2].days[4].text%></span></a></td>',
                    '<td class="<%=weeks[2].days[5].classname%>"><a href="#"><span><%=weeks[2].days[5].text%></span></a></td>',
                    '<td class="<%=weeks[2].days[6].classname%>"><a href="#"><span><%=weeks[2].days[6].text%></span></a></td>',
                    '</tr>',
                    '<tr>',
                    '<td class="<%=weeks[3].days[0].classname%>"><a href="#"><span><%=weeks[3].days[0].text%></span></a></td>',
                    '<td class="<%=weeks[3].days[1].classname%>"><a href="#"><span><%=weeks[3].days[1].text%></span></a></td>',
                    '<td class="<%=weeks[3].days[2].classname%>"><a href="#"><span><%=weeks[3].days[2].text%></span></a></td>',
                    '<td class="<%=weeks[3].days[3].classname%>"><a href="#"><span><%=weeks[3].days[3].text%></span></a></td>',
                    '<td class="<%=weeks[3].days[4].classname%>"><a href="#"><span><%=weeks[3].days[4].text%></span></a></td>',
                    '<td class="<%=weeks[3].days[5].classname%>"><a href="#"><span><%=weeks[3].days[5].text%></span></a></td>',
                    '<td class="<%=weeks[3].days[6].classname%>"><a href="#"><span><%=weeks[3].days[6].text%></span></a></td>',
                    '</tr>',
                    '<tr>',
                    '<td class="<%=weeks[4].days[0].classname%>"><a href="#"><span><%=weeks[4].days[0].text%></span></a></td>',
                    '<td class="<%=weeks[4].days[1].classname%>"><a href="#"><span><%=weeks[4].days[1].text%></span></a></td>',
                    '<td class="<%=weeks[4].days[2].classname%>"><a href="#"><span><%=weeks[4].days[2].text%></span></a></td>',
                    '<td class="<%=weeks[4].days[3].classname%>"><a href="#"><span><%=weeks[4].days[3].text%></span></a></td>',
                    '<td class="<%=weeks[4].days[4].classname%>"><a href="#"><span><%=weeks[4].days[4].text%></span></a></td>',
                    '<td class="<%=weeks[4].days[5].classname%>"><a href="#"><span><%=weeks[4].days[5].text%></span></a></td>',
                    '<td class="<%=weeks[4].days[6].classname%>"><a href="#"><span><%=weeks[4].days[6].text%></span></a></td>',
                    '</tr>',
                    '<tr>',
                    '<td class="<%=weeks[5].days[0].classname%>"><a href="#"><span><%=weeks[5].days[0].text%></span></a></td>',
                    '<td class="<%=weeks[5].days[1].classname%>"><a href="#"><span><%=weeks[5].days[1].text%></span></a></td>',
                    '<td class="<%=weeks[5].days[2].classname%>"><a href="#"><span><%=weeks[5].days[2].text%></span></a></td>',
                    '<td class="<%=weeks[5].days[3].classname%>"><a href="#"><span><%=weeks[5].days[3].text%></span></a></td>',
                    '<td class="<%=weeks[5].days[4].classname%>"><a href="#"><span><%=weeks[5].days[4].text%></span></a></td>',
                    '<td class="<%=weeks[5].days[5].classname%>"><a href="#"><span><%=weeks[5].days[5].text%></span></a></td>',
                    '<td class="<%=weeks[5].days[6].classname%>"><a href="#"><span><%=weeks[5].days[6].text%></span></a></td>',
                    '</tr>',
                    '</tbody>'
                ],
                months: [
                    '<tbody class="<%=className%>">',
                    '<tr>',
                    '<td colspan="2"><a href="#"><span><%=data[0]%></span></a></td>',
                    '<td colspan="2"><a href="#"><span><%=data[1]%></span></a></td>',
                    '<td colspan="2"><a href="#"><span><%=data[2]%></span></a></td>',
                    '<td colspan="1"><a href="#"><span><%=data[3]%></span></a></td>',
                    '</tr>',
                    '<tr>',
                    '<td colspan="2"><a href="#"><span><%=data[4]%></span></a></td>',
                    '<td colspan="2"><a href="#"><span><%=data[5]%></span></a></td>',
                    '<td colspan="2"><a href="#"><span><%=data[6]%></span></a></td>',
                    '<td colspan="1"><a href="#"><span><%=data[7]%></span></a></td>',
                    '</tr>',
                    '<tr>',
                    '<td colspan="2"><a href="#"><span><%=data[8]%></span></a></td>',
                    '<td colspan="2"><a href="#"><span><%=data[9]%></span></a></td>',
                    '<td colspan="2"><a href="#"><span><%=data[10]%></span></a></td>',
                    '<td colspan="1"><a href="#"><span><%=data[11]%></span></a></td>',
                    '</tr>',
                    '</tbody>'
                ]
            },
            defaults = {
                /**
                 * The currently selected date(s).  This can be: a single date, an array
                 * of two dates (sets a range when 'mode' is 'range'), or an array of
                 * any number of dates (selects all dates when 'mode' is 'multiple'.
                 * The supplied dates can be any one of: Date object, milliseconds
                 * (as from date.getTime(), date.valueOf()), or a date string
                 * parseable by Date.parse().
                 */
                date: null,
                /**
                 * Optional date which determines the current calendar month/year.  This
                 * can be one of: Date object, milliseconds (as from date.getTime(), date.valueOf()), or a date string
                 * parseable by Date.parse().  Defaults to todays date.
                 */
                current: null,
                /**
                 * true causes the datepicker calendar to be appended to the DatePicker
                 * element and rendered, false binds the DatePicker to an event on the trigger element
                 */
                inline: false,
                /**
                 * Date selection mode, one of 'single', 'range' or 'multiple'.  Default
                 * 'single'.  'Single' allows the selection of a single date, 'range'
                 * allows the selection of range of dates, and 'multiple' allows the
                 * selection of any number of individual dates.
                 */
                mode: 'single',
                /**
                 * Number of side-by-side calendars, defaults to 1.
                 */
                calendars: 1,
                /**
                 * The day that starts the week, where 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday.  Defaults to Sunday
                 */
                starts: 0,
                /**
                 * Previous link text.  Default '&#9664;' (Unicode left arrow)
                 */
                prev: '&#9664;',
                /**
                 * Next link text.  Default '&#9664;' (Unicode left arrow)
                 */
                next: '&#9654;',
                /**
                 * Initial calendar view, one of 'days', 'months' or 'years'.  Defaults to 'days'.
                 */
                view: 'days',
                /**
                 * Date picker's position relative to the trigger element (non inline
                 * mode only), one of 'top', 'left', 'right' or 'bottom'. Defaults to 'bottom'
                 */
                position: 'bottom',
                /**
                 * The trigger event used to show a non-inline calendar.  Defaults to
                 * 'focus' which is useful when the trigger element is a text input,
                 * can also be 'click' for instance if the trigger element is a button
                 * or some text element.
                 */
                showOn: 'focus',
                /**
                 * Callback, invoked prior to the rendering of each date cell, which
                 * allows control of the styling of the cell via the returned hash.
                 *
                 * @param HTMLDivElement el the datepicker containing element, ie the
                 *        div with class 'datepicker'
                 * @param Date date the date that will be rendered
                 * @return hash with the following optional attributes:
                 *         selected: if true, date will be selected
                 *         disabled: if true, date cell will be disabled
                 *         className: css class name to add to the cell
                 */
                onRenderCell: function () {
                    return {}
                },
                /*
                 * Callback, invoked when a date is selected, with 'this' referring to
                 * the HTMLElement that DatePicker was invoked upon.
                 *
                 * @param dates: Selected date(s) depending on calendar mode.  When calendar mode  is 'single' this
                 *        is a single Date object.  When calendar mode is 'range', this is an array containing
                 *        a 'from' and 'to' Date objects.  When calendar mode is 'multiple' this is an array
                 *        of Date objects.
                 * @param HTMLElement el the DatePicker element, ie the element that DatePicker was invoked upon
                 */
                onChange: function () {
                },
                /**
                 * Invoked before a non-inline datepicker is shown, with 'this'
                 * referring to the HTMLElement that DatePicker was invoked upon, ie
                 * the trigger element
                 *
                 * @param HTMLDivElement el The datepicker container element, ie the div with class 'datepicker'
                 * @return true to allow the datepicker to be shown, false to keep it hidden
                 */
                onBeforeShow: function () {
                    return true
                },
                /**
                 * Invoked after a non-inline datepicker is shown, with 'this'
                 * referring to the HTMLElement that DatePicker was invoked upon, ie
                 * the trigger element
                 *
                 * @param HTMLDivElement el The datepicker container element, ie the div with class 'datepicker'
                 */
                onAfterShow: function () {
                },
                /**
                 * Invoked before a non-inline datepicker is hidden, with 'this'
                 * referring to the HTMLElement that DatePicker was invoked upon, ie
                 * the trigger element
                 *
                 * @param HTMLDivElement el The datepicker container element, ie the div with class 'datepicker'
                 * @return true to allow the datepicker to be hidden, false to keep it visible
                 */
                onBeforeHide: function () {
                    return true
                },
                /**
                 * Invoked after a non-inline datepicker is hidden, with 'this'
                 * referring to the HTMLElement that DatePicker was invoked upon, ie
                 * the trigger element
                 *
                 * @param HTMLDivElement el The datepicker container element, ie the div with class 'datepicker'
                 */
                onAfterHide: function () {
                },
                /**
                 * Locale text for day/month names: provide a hash with keys 'daysMin', 'months' and 'monthsShort'. Default english
                 */
                locale: {
                    daysMin: ["S", "M", "T", "W", "T", "F", "S"],
                    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
                },
                /**
                 * The combined height from the top/bottom borders.  'false' is the default
                 * and generally the correct value.
                 */
                extraHeight: false,
                /**
                 * The combined width from the left/right borders.  'false' is the default
                 * and generally the correct value.
                 */
                extraWidth: false,
                /**
                 * Private option, used to determine when a range is selected
                 */
                lastSel: false,
                /**
                 * Prevent selection of date that after the current day
                 */
                preventFuture: false,
                /**
                 * Disable selection of date that are not in the displayed month
                 */
                disableNotInMonth: true,
                /**
                 * Disable selection of date that are before this date
                 */
                minDate: null
            },

            /**
             * Internal method which renders the calendar cells
             *
             * @param HTMLDivElement el datepicker container element
             */
            fill = function (el) {
                var options = $(el).data('datepicker');
                var cal = $(el);
                var currentCal = Math.floor(options.calendars / 2), date, data, dow, month, cnt = 0, days, indic, indic2, html, tblCal;

                cal.find('td>table tbody').remove();
                for (var i = 0; i < options.calendars; i++) {
                    date = new Date(options.current);
                    date.addMonths(-currentCal + i);
                    tblCal = cal.find('table').eq(i + 1);

                    if (i == 0) tblCal.addClass('datepickerFirstView');
                    if (i == options.calendars - 1) tblCal.addClass('datepickerLastView');

                    if (tblCal.hasClass('datepickerViewDays')) {
                        dow = date.getMonthName(true) + ", " + date.getFullYear();
                    } else if (tblCal.hasClass('datepickerViewMonths')) {
                        dow = date.getFullYear();
                    } else if (tblCal.hasClass('datepickerViewYears')) {
                        dow = (date.getFullYear() - 6) + ' - ' + (date.getFullYear() + 5);
                    }
                    tblCal.find('thead tr:first th a:eq(1) span').text(dow);
                    dow = date.getFullYear() - 6;
                    data = {
                        data: [],
                        className: 'datepickerYears'
                    }
                    for (var j = 0; j < 12; j++) {
                        data.data.push(dow + j);
                    }
                    // datepickerYears template
                    html = tmpl(tpl.months.join(''), data);
                    date.setDate(1);
                    data = {weeks: [], test: 10};
                    month = date.getMonth();
                    var dow = (date.getDay() - options.starts) % 7;
                    date.addDays(-(dow + (dow < 0 ? 7 : 0)));
                    cnt = 0;
                    while (cnt < 42) {
                        indic = parseInt(cnt / 7, 10);
                        indic2 = cnt % 7;
                        if (!data.weeks[indic]) {
                            data.weeks[indic] = {
                                days: []
                            };
                        }
                        data.weeks[indic].days[indic2] = {
                            text: date.getDate(),
                            classname: []
                        };
                        var today = new Date();
                        if (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getYear() == date.getYear()) {
                            data.weeks[indic].days[indic2].classname.push('datepickerToday');
                        } else if (date > today) {
                            // current month, date in future
                            data.weeks[indic].days[indic2].classname.push('datepickerFuture');


                            if (options.preventFuture === true) {
                                // disable clicking of the date in future cells
                                data.weeks[indic].days[indic2].classname.push('datepickerDisabled');
                            }
                        }

                        if (options.minDate && date < options.minDate) {
                            data.weeks[indic].days[indic2].classname.push('datepickerDisabled');
                        }

                        if (month != date.getMonth()) {
                            data.weeks[indic].days[indic2].classname.push('datepickerNotInMonth');
                            // disable clicking of the 'not in month' cells

                            if (options.disableNotInMonth === true) {
                                data.weeks[indic].days[indic2].classname.push('datepickerDisabled');
                            }
                        }
                        if (date.getDay() == 0) {
                            data.weeks[indic].days[indic2].classname.push('datepickerSunday');
                        }
                        if (date.getDay() == 6) {
                            data.weeks[indic].days[indic2].classname.push('datepickerSaturday');
                        }
                        var fromUser = options.onRenderCell(el, date);
                        var val = date.valueOf();
                        if (options.date && (!$.isArray(options.date) || options.date.length > 0)) {
                            if (fromUser.selected || options.date == val || $.inArray(val, options.date) > -1 || (options.mode == 'range' && val >= options.date[0] && val <= options.date[1])) {
                                data.weeks[indic].days[indic2].classname.push('datepickerSelected');
                            }
                        }
                        if (fromUser.disabled) {
                            data.weeks[indic].days[indic2].classname.push('datepickerDisabled');
                        }
                        if (fromUser.className) {
                            data.weeks[indic].days[indic2].classname.push(fromUser.className);
                        }
                        data.weeks[indic].days[indic2].classname = data.weeks[indic].days[indic2].classname.join(' ');
                        cnt++;
                        date.addDays(1);
                    }
                    // Fill the datepickerDays template with data
                    html = tmpl(tpl.days.join(''), data) + html;

                    data = {
                        data: options.locale.monthsShort,
                        className: 'datepickerMonths'
                    };
                    // datepickerMonths template
                    html = tmpl(tpl.months.join(''), data) + html;
                    tblCal.append(html);
                }
            },

            /**
             * Extends the Date object with some useful helper methods
             */
            extendDate = function (locale) {
                if (Date.prototype.tempDate) {
                    return;
                }
                Date.prototype.tempDate = null;
                Date.prototype.months = locale.months;
                Date.prototype.monthsShort = locale.monthsShort;
                Date.prototype.getMonthName = function (fullName) {
                    return this[fullName ? 'months' : 'monthsShort'][this.getMonth()];
                };
                Date.prototype.addDays = function (n) {
                    this.setDate(this.getDate() + n);
                    this.tempDate = this.getDate();
                };
                Date.prototype.addMonths = function (n) {
                    if (this.tempDate == null) {
                        this.tempDate = this.getDate();
                    }
                    this.setDate(1);
                    this.setMonth(this.getMonth() + n);
                    this.setDate(Math.min(this.tempDate, this.getMaxDays()));
                };
                Date.prototype.addYears = function (n) {
                    if (this.tempDate == null) {
                        this.tempDate = this.getDate();
                    }
                    this.setDate(1);
                    this.setFullYear(this.getFullYear() + n);
                    this.setDate(Math.min(this.tempDate, this.getMaxDays()));
                };
                Date.prototype.getMaxDays = function () {
                    var tmpDate = new Date(Date.parse(this)),
                        d = 28, m;
                    m = tmpDate.getMonth();
                    d = 28;
                    while (tmpDate.getMonth() == m) {
                        d++;
                        tmpDate.setDate(d);
                    }
                    return d - 1;
                };
                Date.prototype.isSameMonthAs = function (pDate) {
                    return (
                        this.getFullYear() === pDate.getFullYear() &&
                        this.getMonth() === pDate.getMonth()
                    );
                }
            },

            /**
             * Internal method which lays out the calendar widget
             */
            layout = function (el) {
                var options = $(el).data('datepicker');
                var cal = $('#' + options.id);
                if (options.extraHeight === false) {
                    var divs = $(el).find('div');
                    options.extraHeight = divs.get(0).offsetHeight + divs.get(1).offsetHeight;  // heights from top/bottom borders
                    options.extraWidth = divs.get(2).offsetWidth + divs.get(3).offsetWidth;     // widths from left/right borders
                }
                var tbl = cal.find('table:first').get(0);
                var width = tbl.offsetWidth;
                var height = tbl.offsetHeight;
                cal.css({
                    width: width + options.extraWidth + 'px',
                    height: height + options.extraHeight + 'px'
                }).find('div.datepickerContainer').css({
                    width: width + 'px',
                    height: height + 'px'
                });
            },

            /**
             * Internal method, bound to the HTML DatePicker Element, onClick.
             * This is the function that controls the behavior of the calendar when
             * the title, next/previous, or a date cell is clicked on.
             */
            click = function (ev) {
                if ($(ev.target).is('span')) {
                    ev.target = ev.target.parentNode;
                }
                var el = $(ev.target);
                if (el.is('a')) {
                    ev.target.blur();
                    if (el.hasClass('datepickerDisabled')) {
                        return false;
                    }
                    var options = $(this).data('datepicker');
                    var parentEl = el.parent();
                    var tblEl = parentEl.parent().parent().parent();
                    var tblIndex = $('table', this).index(tblEl.get(0)) - 1;
                    var tmp = new Date(options.current);
                    var changed = false;
                    var fillIt = false;
                    var currentCal = Math.floor(options.calendars / 2);

                    if (parentEl.is('th')) {
                        // clicking the calendar title

                        if (el.hasClass('datepickerMonth')) {
                            // clicking on the title of a Month Datepicker
                            tmp.addMonths(tblIndex - currentCal);

                            if (options.mode == 'range') {
                                // range, select the whole month
                                tmp.setDate(1);
                                options.date[0] = (tmp.setHours(0, 0, 0, 0)).valueOf();
                                tmp.addDays(tmp.getMaxDays() - 1);
                                tmp.setHours(23, 59, 59, 0);
                                options.date[1] = tmp.valueOf();
                                fillIt = true;
                                changed = true;
                                options.lastSel = false;
                            } else if (options.calendars == 1) {
                                // single/multiple mode with a single calendar: swap between daily/monthly/yearly view.
                                // Note:  there's no reason a multi-calendar widget can't have this functionality,
                                //   however I think it looks really unintuitive.
                                if (tblEl.eq(0).hasClass('datepickerViewDays')) {
                                    tblEl.eq(0).toggleClass('datepickerViewDays datepickerViewMonths');
                                    el.find('span').text(tmp.getFullYear());
                                } else if (tblEl.eq(0).hasClass('datepickerViewMonths')) {
                                    tblEl.eq(0).toggleClass('datepickerViewMonths datepickerViewYears');
                                    el.find('span').text((tmp.getFullYear() - 6) + ' - ' + (tmp.getFullYear() + 5));
                                } else if (tblEl.eq(0).hasClass('datepickerViewYears')) {
                                    tblEl.eq(0).toggleClass('datepickerViewYears datepickerViewDays');
                                    el.find('span').text(tmp.getMonthName(true) + ", " + tmp.getFullYear());
                                }
                            }
                        } else if (parentEl.parent().parent().is('thead')) {
                            // clicked either next/previous arrows
                            if (tblEl.eq(0).hasClass('datepickerViewDays')) {
                                options.current.addMonths(el.hasClass('datepickerGoPrev') ? -1 : 1);
                            } else if (tblEl.eq(0).hasClass('datepickerViewMonths')) {
                                options.current.addYears(el.hasClass('datepickerGoPrev') ? -1 : 1);
                            } else if (tblEl.eq(0).hasClass('datepickerViewYears')) {
                                options.current.addYears(el.hasClass('datepickerGoPrev') ? -12 : 12);
                            }
                            fillIt = true;
                        }

                    } else if (parentEl.is('td') && !parentEl.hasClass('datepickerDisabled')) {
                        // clicking the calendar grid

                        if (tblEl.eq(0).hasClass('datepickerViewMonths')) {
                            // clicked a month cell
                            options.current.setMonth(tblEl.find('tbody.datepickerMonths td').index(parentEl));
                            options.current.setFullYear(parseInt(tblEl.find('thead th a.datepickerMonth span').text(), 10));
                            options.current.addMonths(currentCal - tblIndex);
                            tblEl.eq(0).toggleClass('datepickerViewMonths datepickerViewDays');
                        } else if (tblEl.eq(0).hasClass('datepickerViewYears')) {
                            // clicked a year cell
                            options.current.setFullYear(parseInt(el.text(), 10));
                            tblEl.eq(0).toggleClass('datepickerViewYears datepickerViewMonths');
                        } else {
                            // clicked a day cell
                            var val = parseInt(el.text(), 10);
                            tmp.addMonths(tblIndex - currentCal);
                            if (parentEl.hasClass('datepickerNotInMonth')) {
                                tmp.addMonths(val > 15 ? -1 : 1);
                            }
                            tmp.setDate(val);
                            switch (options.mode) {
                                case 'multiple':
                                    val = (tmp.setHours(0, 0, 0, 0)).valueOf();
                                    if ($.inArray(val, options.date) > -1) {
                                        $.each(options.date, function (nr, dat) {
                                            if (dat == val) {
                                                options.date.splice(nr, 1);
                                                return false;
                                            }
                                        });
                                    } else {
                                        options.date.push(val);
                                    }
                                    break;
                                case 'range':
                                    if (!options.lastSel) {
                                        // first click: set to the start of the day
                                        options.date[0] = (tmp.setHours(0, 0, 0, 0)).valueOf();
                                    }
                                    // get the very end of the day clicked
                                    val = (tmp.setHours(23, 59, 59, 0)).valueOf();

                                    if (val < options.date[0]) {
                                        // second range click < first
                                        options.date[1] = options.date[0] + 86399000;  // starting date + 1 day
                                        options.date[0] = val - 86399000;  // minus 1 day
                                    } else {
                                        // initial range click, or final range click >= first
                                        options.date[1] = val;
                                    }
                                    options.lastSel = !options.lastSel;
                                    break;
                                default:
                                    options.date = tmp.valueOf();
                                    break;
                            }
                            changed = true;
                        }
                        fillIt = true;
                    }
                    if (fillIt) {
                        fill(this);
                    }
                    if (changed) {
                        options.onChange.apply(this, prepareDate(options));
                    }
                }
                return false;
            },

            /**
             * Internal method, called from the public getDate() method, and when
             * invoking the onChange callback function
             *
             * @param object options with the following attributes: 'mode' which can
             *        be one of 'single', 'range', or 'multiple'.  Attribute 'date'
             *        which will be a single timestamp when 'mode' is 'single', or
             *        an array of timestamps otherwise.  Attribute 'el' which is the
             *        HTML element that DatePicker was invoked upon.
             * @return array where the first item is either a Date object, or an
             *         array of Date objects, depending on the DatePicker mode, and
             *         the second item is the HTMLElement that DatePicker was invoked
             *         upon.
             */
            prepareDate = function (options) {
                var dates = null;
                if (options.mode == 'single') {
                    if (options.date) dates = new Date(options.date);
                } else {
                    dates = new Array();
                    $(options.date).each(function (i, val) {
                        dates.push(new Date(val));
                    });
                }
                return [dates, options.el];
            },

            /**
             * Internal method, returns an object containing the viewport dimensions
             */
            getViewport = function () {
                var m = document.compatMode == 'CSS1Compat';
                return {
                    l: window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
                    t: window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
                    w: window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
                    h: window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
                };
            },

            /**
             * Internal method, returns true if el is a child of parentEl
             */
            isChildOf = function (parentEl, el, container) {
                if (parentEl == el) {
                    return true;
                }
                if (parentEl.contains) {
                    return parentEl.contains(el);
                }
                if (parentEl.compareDocumentPosition) {
                    return !!(parentEl.compareDocumentPosition(el) & 16);
                }
                var prEl = el.parentNode;
                while (prEl && prEl != container) {
                    if (prEl == parentEl)
                        return true;
                    prEl = prEl.parentNode;
                }
                return false;
            },

            /**
             * Bound to the HTML DatePicker element when it's not inline, and also
             * can be called directly to show the bound datepicker.  A DatePicker
             * calendar shown with this method will hide on a mouseclick outside
             * of the calendar.
             *
             * Method is not applicable for inline DatePickers
             */
            show = function (ev) {
                var cal = $('#' + $(this).data('datepickerId'));
                if (!cal.is(':visible')) {
                    var calEl = cal.get(0);
                    var options = cal.data('datepicker');

                    var test = options.onBeforeShow.apply(this, [calEl]);
                    if (options.onBeforeShow.apply(this, [calEl]) == false) {
                        return;
                    }

                    fill(calEl);
                    var pos = $(this).offset();
                    var viewPort = getViewport();
                    var top = pos.top;
                    var left = pos.left;
                    var oldDisplay = $.css(calEl, 'display');
                    cal.css({
                        visibility: 'hidden',
                        display: 'block'
                    });
                    layout(calEl);
                    switch (options.position) {
                        case 'top':
                            top -= calEl.offsetHeight;
                            break;
                        case 'left':
                            left -= calEl.offsetWidth;
                            break;
                        case 'right':
                            left += this.offsetWidth;
                            break;
                        case 'bottom':
                            top += this.offsetHeight;
                            break;
                    }
                    if (top + calEl.offsetHeight > viewPort.t + viewPort.h) {
                        top = pos.top - calEl.offsetHeight;
                    }
                    if (top < viewPort.t) {
                        top = pos.top + this.offsetHeight + calEl.offsetHeight;
                    }
                    if (left + calEl.offsetWidth > viewPort.l + viewPort.w) {
                        left = pos.left - calEl.offsetWidth;
                    }
                    if (left < viewPort.l) {
                        left = pos.left + this.offsetWidth
                    }
                    cal.css({
                        visibility: 'visible',
                        display: 'block',
                        top: top + 'px',
                        left: left + 'px'
                    });
                    options.onAfterShow.apply(this, [cal.get(0)]);
                    $(document).bind('mousedown', {cal: cal, trigger: this}, hide);  // global listener so clicking outside the calendar will close it
                }
                return false;
            },

            /**
             * Hide a non-inline DatePicker calendar.
             *
             * Not applicable for inline DatePickers.
             *
             * @param ev Event object
             */
            hide = function (ev) {
                if (ev.target != ev.data.trigger && !isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
                    if (ev.data.cal.data('datepicker').onBeforeHide.apply(this, [ev.data.cal.get(0)]) != false) {
                        ev.data.cal.hide();
                        ev.data.cal.data('datepicker').onAfterHide.apply(this, [ev.data.cal.get(0)]);
                        $(document).unbind('mousedown', hide);  // remove the global listener
                    }
                }
            },

            /**
             * Internal method to normalize the selected date based on the current
             * calendar mode.
             */
            normalizeDate = function (mode, date) {
                // if range/multi mode, make sure that the current date value is at least an empty array
                if (mode != 'single' && !date) date = [];

                // if we have a selected date and not a null or empty array
                if (date && (!$.isArray(date) || date.length > 0)) {
                    // Create a standardized date depending on the calendar mode
                    if (mode != 'single') {
                        if (!$.isArray(date)) {
                            date = [((new Date(date)).setHours(0, 0, 0, 0)).valueOf()];
                            if (mode == 'range') {
                                // create a range of one day
                                date.push(((new Date(date[0])).setHours(23, 59, 59, 0)).valueOf());
                            }
                        } else {
                            for (var i = 0; i < date.length; i++) {
                                date[i] = ((new Date(date[i])).setHours(0, 0, 0, 0)).valueOf();
                            }
                            if (mode == 'range') {
                                // for range mode, create the other end of the range
                                if (date.length == 1) date.push(new Date(date[0]));
                                date[1] = ((new Date(date[1])).setHours(23, 59, 59, 0)).valueOf();
                            }
                        }
                    } else {
                        // mode is single, convert date object into a timestamp
                        date = ((new Date(date)).setHours(0, 0, 0, 0)).valueOf();
                    }
                    // at this point date is either a timestamp at hour zero
                    //  for 'single' mode, an array of timestamps at hour zero for
                    //  'multiple' mode, or a two-item array with timestamps at hour
                    //  zero and hour 23:59 for 'range' mode
                }
                return date;
            };
        return {
            /**
             * 'Public' functions
             */

            /**
             * Called when element.DatePicker() is invoked
             *
             * Note that 'this' is the HTML element that DatePicker was invoked upon
             * @see DatePicker()
             */
            init: function (options) {
                options = $.extend({}, defaults, options || {});
                extendDate(options.locale);
                options.calendars = Math.max(1, parseInt(options.calendars, 10) || 1);
                options.mode = /single|multiple|range/.test(options.mode) ? options.mode : 'single';

                return this.each(function () {
                    if (!$(this).data('datepicker')) {
                        options.el = this;

                        options.date = normalizeDate(options.mode, options.date);

                        if (!options.current) {
                            options.current = new Date();
                        } else {
                            options.current = new Date(options.current);
                        }
                        options.current.setDate(1);
                        options.current.setHours(0, 0, 0, 0);

                        var id = 'datepicker_' + parseInt(Math.random() * 1000), cnt;
                        options.id = id;
                        $(this).data('datepickerId', options.id);
                        var cal = $(tpl.wrapper).attr('id', id).bind('click', click).data('datepicker', options);
                        if (options.className) {
                            cal.addClass(options.className);
                        }
                        var html = '';
                        for (var i = 0; i < options.calendars; i++) {
                            cnt = options.starts;
                            if (i > 0) {
                                html += tpl.space;
                            }
                            // calendar header template
                            html += tmpl(tpl.head.join(''), {
                                prev: options.prev,
                                next: options.next,
                                day1: options.locale.daysMin[(cnt++) % 7],
                                day2: options.locale.daysMin[(cnt++) % 7],
                                day3: options.locale.daysMin[(cnt++) % 7],
                                day4: options.locale.daysMin[(cnt++) % 7],
                                day5: options.locale.daysMin[(cnt++) % 7],
                                day6: options.locale.daysMin[(cnt++) % 7],
                                day7: options.locale.daysMin[(cnt++) % 7]
                            });
                        }
                        cal
                            .find('tr:first').append(html)
                            .find('table').addClass(views[options.view]);
                        fill(cal.get(0));
                        if (options.inline) {
                            cal.appendTo(this).show().css('position', 'relative');
                            layout(cal.get(0));
                        } else {
                            cal.appendTo(document.body);
                            $(this).bind(options.showOn, show);
                        }
                    }
                });
            },

            /**
             * Shows the DatePicker, applicable only when the picker is not inline
             *
             * @return the DatePicker HTML element
             * @see DatePickerShow()
             */
            showPicker: function () {
                return this.each(function () {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        if (!options.inline) {
                            show.apply(this);
                        }
                    }
                });
            },

            /**
             * Hides the DatePicker, applicable only when the picker is not inline
             *
             * @return the DatePicker HTML element
             * @see DatePickerHide()
             */
            hidePicker: function () {
                return this.each(function () {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        if (!options.inline) {
                            $('#' + $(this).data('datepickerId')).hide();
                        }
                    }
                });
            },

            /**
             * Sets the DatePicker current date, and optionally shifts the current
             * calendar to that date.
             *
             * @param Date|String|int|Array date The currently selected date(s).
             *        This can be: a single date, an array
             *        of two dates (sets a range when 'mode' is 'range'), or an array of
             *        any number of dates (selects all dates when 'mode' is 'multiple'.
             *        The supplied dates can be any one of: Date object, milliseconds
             *        (as from date.getTime(), date.valueOf()), or a date string
             *        parseable by Date.parse().
             * @param boolean shiftTo if true, shifts the visible calendar to the
             *        newly set date(s)
             * @param boolean shiftEnd if true, shifts the end of the visible calendar to the
             *        newly set end date
             *
             * @see DatePickerSetDate()
             */
            setDate: function (date, shiftTo, end) {
                return this.each(function () {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        options.date = normalizeDate(options.mode, date);

                        if (shiftTo) {
                            var d = options.mode != 'single' ? options.date[end === true ? 1 : 0] : options.date;
                            if (options.mode != 'single') {
                                var d1 = new Date(options.date[0]);
                                var d2 = new Date(options.date[Math.max(options.date.length - 1, 0)]);

                                var minDate = new Date(Date.parse(options.current));
                                minDate.addMonths(-1);

                                var daysInCurrentMonth = options.current.getMaxDays();
                                var maxDate = new Date(Date.parse(options.current));
                                maxDate.setDate(daysInCurrentMonth);

                                if (d1 >= minDate && d1 <= maxDate) {
                                    // do nothing
                                } else if (d2 >= minDate && d2 <= maxDate) {
                                    // do nothing
                                } else {
                                    options.current = new Date(d);
                                }
                            } else {
                                options.current = new Date(d);
                            }
                        }
                        fill(cal.get(0));
                    }
                });
            },

            /**
             * Returns the currently selected date(s) and the datepicker element.
             *
             * @return array where the first element is the selected date(s)  When calendar mode  is 'single' this
             *        is a single date object, or null if no date is selected.  When calendar mode is 'range', this is an array containing
             *        a 'from' and 'to' date objects, or the empty array if no date range is selected.  When calendar mode is 'multiple' this
             *        is an array of Date objects, or the empty array if no date is selected.
             *        The second element is the HTMLElement that DatePicker was invoked upon
             *
             * @see DatePickerGetDate()
             */
            getDate: function () {
                if (this.size() > 0) {
                    return prepareDate($('#' + $(this).data('datepickerId')).data('datepicker'));
                }
            },

            /**
             * Clears the currently selected date(s)
             *
             * @see DatePickerClear()
             */
            clear: function () {
                return this.each(function () {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        if (options.mode == 'single') {
                            options.date = null;
                        } else {
                            options.date = [];
                        }
                        fill(cal.get(0));
                    }
                });
            },

            /**
             * Only applicable when the DatePicker is inline
             *
             * @see DatePickerLayout()
             */
            fixLayout: function () {
                return this.each(function () {
                    if ($(this).data('datepickerId')) {
                        var cal = $('#' + $(this).data('datepickerId'));
                        var options = cal.data('datepicker');
                        if (options.inline) {
                            layout(cal.get(0));
                        }
                    }
                });
            }
        };
    }();  // DatePicker

    // Extend jQuery with the following functions so that they can be called on HTML elements, ie: $('#widgetCalendar').DatePicker();
    $.fn.extend({
        DatePicker: DatePicker.init,
        DatePickerHide: DatePicker.hidePicker,
        DatePickerShow: DatePicker.showPicker,
        DatePickerSetDate: DatePicker.setDate,
        DatePickerGetDate: DatePicker.getDate,
        DatePickerClear: DatePicker.clear,
        DatePickerLayout: DatePicker.fixLayout
    });
})(jQuery);

(function () {
    // within here, 'this' refers to the window object
    var cache = {};

    this.tmpl = function tmpl(str, data) {
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn(data) : fn;
    };
})();

/*!
 * Bootstrap v3.3.5 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

/*!
 * Generated using the Bootstrap Customizer (http://getbootstrap.com/customize/?id=5724e96c68107bd9186f)
 * Config saved to config.json and https://gist.github.com/5724e96c68107bd9186f
 */
if (typeof jQuery === 'undefined') {
    throw new Error('Bootstrap\'s JavaScript requires jQuery')
}
+function ($) {
    'use strict';
    var version = $.fn.jquery.split(' ')[0].split('.')
    if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
        throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
    }
}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // TOOLTIP PUBLIC CLASS DEFINITION
    // ===============================

    var Tooltip = function (element, options) {
        this.type       = null
        this.options    = null
        this.enabled    = null
        this.timeout    = null
        this.hoverState = null
        this.$element   = null
        this.inState    = null

        this.init('tooltip', element, options)
    }

    Tooltip.VERSION  = '3.3.6'

    Tooltip.TRANSITION_DURATION = 150

    Tooltip.DEFAULTS = {
        animation: true,
        placement: 'top',
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: 'hover focus',
        title: '',
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: 'body',
            padding: 0
        }
    }

    Tooltip.prototype.init = function (type, element, options) {
        this.enabled   = true
        this.type      = type
        this.$element  = $(element)
        this.options   = this.getOptions(options)
        this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
        this.inState   = { click: false, hover: false, focus: false }

        if (this.$element[0] instanceof document.constructor && !this.options.selector) {
            throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
        }

        var triggers = this.options.trigger.split(' ')

        for (var i = triggers.length; i--;) {
            var trigger = triggers[i]

            if (trigger == 'click') {
                this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
            } else if (trigger != 'manual') {
                var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
                var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

                this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
                this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
            }
        }

        this.options.selector ?
            (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
            this.fixTitle()
    }

    Tooltip.prototype.getDefaults = function () {
        return Tooltip.DEFAULTS
    }

    Tooltip.prototype.getOptions = function (options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options)

        if (options.delay && typeof options.delay == 'number') {
            options.delay = {
                show: options.delay,
                hide: options.delay
            }
        }

        return options
    }

    Tooltip.prototype.getDelegateOptions = function () {
        var options  = {}
        var defaults = this.getDefaults()

        this._options && $.each(this._options, function (key, value) {
            if (defaults[key] != value) options[key] = value
        })

        return options
    }

    Tooltip.prototype.enter = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
        }

        if (self.tip().hasClass('in') || self.hoverState == 'in') {
            self.hoverState = 'in'
            return
        }

        clearTimeout(self.timeout)

        self.hoverState = 'in'

        if (!self.options.delay || !self.options.delay.show) return self.show()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'in') self.show()
        }, self.options.delay.show)
    }

    Tooltip.prototype.isInStateTrue = function () {
        for (var key in this.inState) {
            if (this.inState[key]) return true
        }

        return false
    }

    Tooltip.prototype.leave = function (obj) {
        var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget).data('bs.' + this.type)

        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
            $(obj.currentTarget).data('bs.' + this.type, self)
        }

        if (obj instanceof $.Event) {
            self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
        }

        if (self.isInStateTrue()) return

        clearTimeout(self.timeout)

        self.hoverState = 'out'

        if (!self.options.delay || !self.options.delay.hide) return self.hide()

        self.timeout = setTimeout(function () {
            if (self.hoverState == 'out') self.hide()
        }, self.options.delay.hide)
    }

    Tooltip.prototype.show = function () {
        var e = $.Event('show.bs.' + this.type)

        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e)

            var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
            if (e.isDefaultPrevented() || !inDom) return
            var that = this

            var $tip = this.tip()

            var tipId = this.getUID(this.type)

            this.setContent()
            $tip.attr('id', tipId)
            this.$element.attr('aria-describedby', tipId)

            if (this.options.animation) $tip.addClass('fade')

            var placement = typeof this.options.placement == 'function' ?
                this.options.placement.call(this, $tip[0], this.$element[0]) :
                this.options.placement

            var autoToken = /\s?auto?\s?/i
            var autoPlace = autoToken.test(placement)
            if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

            $tip
                .detach()
                .css({ top: 0, left: 0, display: 'block' })
                .addClass(placement)
                .data('bs.' + this.type, this)

            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
            this.$element.trigger('inserted.bs.' + this.type)

            var pos          = this.getPosition()
            var actualWidth  = $tip[0].offsetWidth
            var actualHeight = $tip[0].offsetHeight

            if (autoPlace) {
                var orgPlacement = placement
                var viewportDim = this.getPosition(this.$viewport)

                placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                        placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                            placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                                placement

                $tip
                    .removeClass(orgPlacement)
                    .addClass(placement)
            }

            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

            this.applyPlacement(calculatedOffset, placement)

            var complete = function () {
                var prevHoverState = that.hoverState
                that.$element.trigger('shown.bs.' + that.type)
                that.hoverState = null

                if (prevHoverState == 'out') that.leave(that)
            }

            $.support.transition && this.$tip.hasClass('fade') ?
                $tip
                    .one('bsTransitionEnd', complete)
                    .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
                complete()
        }
    }

    Tooltip.prototype.applyPlacement = function (offset, placement) {
        var $tip   = this.tip()
        var width  = $tip[0].offsetWidth
        var height = $tip[0].offsetHeight

        // manually read margins because getBoundingClientRect includes difference
        var marginTop = parseInt($tip.css('margin-top'), 10)
        var marginLeft = parseInt($tip.css('margin-left'), 10)

        // we must check for NaN for ie 8/9
        if (isNaN(marginTop))  marginTop  = 0
        if (isNaN(marginLeft)) marginLeft = 0

        offset.top  += marginTop
        offset.left += marginLeft

        // $.fn.offset doesn't round pixel values
        // so we use setOffset directly with our own function B-0
        $.offset.setOffset($tip[0], $.extend({
            using: function (props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                })
            }
        }, offset), 0)

        $tip.addClass('in')

        // check to see if placing tip in new offset caused the tip to resize itself
        var actualWidth  = $tip[0].offsetWidth
        var actualHeight = $tip[0].offsetHeight

        if (placement == 'top' && actualHeight != height) {
            offset.top = offset.top + height - actualHeight
        }

        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

        if (delta.left) offset.left += delta.left
        else offset.top += delta.top

        var isVertical          = /top|bottom/.test(placement)
        var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
        var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

        $tip.offset(offset)
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
    }

    Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
        this.arrow()
            .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
            .css(isVertical ? 'top' : 'left', '')
    }

    Tooltip.prototype.setContent = function () {
        var $tip  = this.tip()
        var title = this.getTitle()

        $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
        $tip.removeClass('fade in top bottom left right')
    }

    Tooltip.prototype.hide = function (callback) {
        var that = this
        var $tip = $(this.$tip)
        var e    = $.Event('hide.bs.' + this.type)

        function complete() {
            if (that.hoverState != 'in') $tip.detach()
            that.$element
                .removeAttr('aria-describedby')
                .trigger('hidden.bs.' + that.type)
            callback && callback()
        }

        this.$element.trigger(e)

        if (e.isDefaultPrevented()) return

        $tip.removeClass('in')

        $.support.transition && $tip.hasClass('fade') ?
            $tip
                .one('bsTransitionEnd', complete)
                .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
            complete()

        this.hoverState = null

        return this
    }

    Tooltip.prototype.fixTitle = function () {
        var $e = this.$element
        if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
            $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
        }
    }

    Tooltip.prototype.hasContent = function () {
        return this.getTitle()
    }

    Tooltip.prototype.getPosition = function ($element) {
        $element   = $element || this.$element

        var el     = $element[0]
        var isBody = el.tagName == 'BODY'

        var elRect    = el.getBoundingClientRect()
        if (elRect.width == null) {
            // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
            elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
        }
        var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
        var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
        var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

        return $.extend({}, elRect, scroll, outerDims, elOffset)
    }

    Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
        return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
            placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
                placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
                    /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

    }

    Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
        var delta = { top: 0, left: 0 }
        if (!this.$viewport) return delta

        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
        var viewportDimensions = this.getPosition(this.$viewport)

        if (/right|left/.test(placement)) {
            var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
            if (topEdgeOffset < viewportDimensions.top) { // top overflow
                delta.top = viewportDimensions.top - topEdgeOffset
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
            }
        } else {
            var leftEdgeOffset  = pos.left - viewportPadding
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth
            if (leftEdgeOffset < viewportDimensions.left) { // left overflow
                delta.left = viewportDimensions.left - leftEdgeOffset
            } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
            }
        }

        return delta
    }

    Tooltip.prototype.getTitle = function () {
        var title
        var $e = this.$element
        var o  = this.options

        title = $e.attr('data-original-title')
            || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

        return title
    }

    Tooltip.prototype.getUID = function (prefix) {
        do prefix += ~~(Math.random() * 1000000)
        while (document.getElementById(prefix))
        return prefix
    }

    Tooltip.prototype.tip = function () {
        if (!this.$tip) {
            this.$tip = $(this.options.template)
            if (this.$tip.length != 1) {
                throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
            }
        }
        return this.$tip
    }

    Tooltip.prototype.arrow = function () {
        return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
    }

    Tooltip.prototype.enable = function () {
        this.enabled = true
    }

    Tooltip.prototype.disable = function () {
        this.enabled = false
    }

    Tooltip.prototype.toggleEnabled = function () {
        this.enabled = !this.enabled
    }

    Tooltip.prototype.toggle = function (e) {
        var self = this
        if (e) {
            self = $(e.currentTarget).data('bs.' + this.type)
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions())
                $(e.currentTarget).data('bs.' + this.type, self)
            }
        }

        if (e) {
            self.inState.click = !self.inState.click
            if (self.isInStateTrue()) self.enter(self)
            else self.leave(self)
        } else {
            self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
        }
    }

    Tooltip.prototype.destroy = function () {
        var that = this
        clearTimeout(this.timeout)
        this.hide(function () {
            that.$element.off('.' + that.type).removeData('bs.' + that.type)
            if (that.$tip) {
                that.$tip.detach()
            }
            that.$tip = null
            that.$arrow = null
            that.$viewport = null
        })
    }


    // TOOLTIP PLUGIN DEFINITION
    // =========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.tooltip')
            var options = typeof option == 'object' && option

            if (!data && /destroy|hide/.test(option)) return
            if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
            if (typeof option == 'string') data[option]()
        })
    }

    var old = $.fn.tooltip

    $.fn.tooltip             = Plugin
    $.fn.tooltip.Constructor = Tooltip


    // TOOLTIP NO CONFLICT
    // ===================

    $.fn.tooltip.noConflict = function () {
        $.fn.tooltip = old
        return this
    }

}(jQuery);

// DEPRECATED!!! Replaced by collapsible.js from Dogfalo/materialize

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
    'use strict';

    // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
    // ============================================================

    function transitionEnd() {
        var el = document.createElement('bootstrap')

        var transEndEventNames = {
            WebkitTransition: 'webkitTransitionEnd',
            MozTransition: 'transitionend',
            OTransition: 'oTransitionEnd otransitionend',
            transition: 'transitionend'
        }

        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {end: transEndEventNames[name]}
            }
        }

        return false // explicit for ie8 (  ._.)
    }

    // http://blog.alexmaccaw.com/css-transitions
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false
        var $el = this
        $(this).one('bsTransitionEnd', function () {
            called = true
        })
        var callback = function () {
            if (!called) $($el).trigger($.support.transition.end)
        }
        setTimeout(callback, duration)
        return this
    }

    $(function () {
        $.support.transition = transitionEnd()

        if (!$.support.transition) return

        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function (e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
            }
        }
    })

}(jQuery);
