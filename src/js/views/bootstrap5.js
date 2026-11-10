/**
 * Bootstrap 5 Theme ("bootstrap5")
 *
 * Defines the Alpaca theme for Bootstrap v5.
 *
 * The views are:
 *
 *    bootstrap5-display
 *    bootstrap5-display-horizontal
 *    bootstrap5-edit
 *    bootstrap5-edit-horizontal
 *    bootstrap5-create
 *    bootstrap5-create-horizontal
 *
 * This theme can also be selected by specifying the following view:
 *
 *    {
 *       "ui": "bootstrap5",
 *       "type": "display" | "edit" | "create"
 *    }
 *
 */
(function($) {

    var Alpaca = $.alpaca;

    // custom styles
    var styles = {};
    styles["button"] = "btn btn-secondary";
    styles["smallButton"] = "btn btn-outline-secondary btn-sm";
    styles["table"] = "table table-striped table-bordered table-hover align-middle";

    // Icons: Use Bootstrap Icons classes with sensible fallbacks
    styles["addIcon"] = "bi bi-plus-lg";
    styles["removeIcon"] = "bi bi-dash-lg";
    styles["upIcon"] = "bi bi-chevron-up";
    styles["downIcon"] = "bi bi-chevron-down";
    styles["expandedIcon"] = "bi bi-chevron-down";
    styles["collapsedIcon"] = "bi bi-chevron-right";
    styles["editIcon"] = "bi bi-pencil";

    // custom callbacks
    var callbacks = {};
    callbacks["required"] = function()
    {
        var fieldEl = this.getFieldEl();
        var label = $(fieldEl).find("label.alpaca-control-label");
        if ($(label).length > 0)
        {
            $(label).append("<span class='alpaca-required-indicator'>(required)</span>");
        }
    };

    callbacks["invalid"] = function()
    {
        // Add .is-invalid to the input control element
        var controlEl = this.getControlEl ? this.getControlEl() : null;
        if (controlEl && $(controlEl).length > 0)
        {
            $(controlEl).addClass('is-invalid');
        }
        else
        {
            $(this.getFieldEl()).find("input, select, textarea").addClass('is-invalid');
        }
    };

    callbacks["valid"] = function()
    {
        // Remove .is-invalid from the control element
        var controlEl = this.getControlEl ? this.getControlEl() : null;
        if (controlEl && $(controlEl).length > 0)
        {
            $(controlEl).removeClass('is-invalid');
        }
        else
        {
            $(this.getFieldEl()).find("input, select, textarea").removeClass('is-invalid');
        }
    };

    callbacks["control"] = function()
    {
        var fieldEl = this.getFieldEl();
        var controlEl = this.getControlEl ? this.getControlEl() : null;

        // Apply .form-control to text inputs and textareas
        $(fieldEl).find("input").addClass("form-control");
        $(fieldEl).find("textarea").addClass("form-control");

        // Apply .form-select to <select> elements (not .form-control)
        $(fieldEl).find("select").removeClass("form-control").addClass("form-select");

        // Input type specific classes
        $(fieldEl).find("input[type=checkbox]").removeClass("form-control").addClass("form-check-input");
        $(fieldEl).find("input[type=radio]").removeClass("form-control").addClass("form-check-input");
        $(fieldEl).find("input[type=file]").removeClass("form-control");

        // Apply .form-control-color to input[type="color"]
        $(fieldEl).find("input[type=color]").addClass("form-control-color");

        // Apply .form-range to input[type="range"]
        $(fieldEl).find("input[type=range]").removeClass("form-control").addClass("form-range");

        // Wrap or ensure checkbox/radio parents have form-check
        $(fieldEl).find("input[type=checkbox]").each(function() {
            var parent = $(this).parent();
            if (!parent.hasClass("form-check")) {
                parent.addClass("form-check");
            }
            parent.find("label").addClass("form-check-label");
        });

        $(fieldEl).find("input[type=radio]").each(function() {
            var parent = $(this).parent();
            if (!parent.hasClass("form-check")) {
                parent.addClass("form-check");
            }
            parent.find("label").addClass("form-check-label");
        });

        // Apply .form-label to control labels
        $(fieldEl).find("label.alpaca-control-label").addClass("form-label");

        // Horizontal Mode
        if (this.view.horizontal)
        {
            $(fieldEl).addClass("row mb-3");
            $(fieldEl).find("label.alpaca-control-label").removeClass("form-label").addClass("col-sm-3 col-form-label");

            // align helper text with input
            $(fieldEl).find(".form-text, .help-block").addClass("col-sm-9 offset-sm-3");

            if (controlEl)
            {
                var wrapper = $("<div></div>").addClass("col-sm-9");
                $(controlEl).after(wrapper);
                wrapper.append(controlEl);
            }
        }
    };

    callbacks["container"] = function()
    {
    };

    callbacks["form"] = function()
    {
    };

    callbacks["enableButton"] = function(button)
    {
        $(button).removeAttr("disabled");
    };

    callbacks["disableButton"] = function(button)
    {
        $(button).attr("disabled", "disabled");
    };

    callbacks["collapsible"] = function()
    {
        var fieldEl = this.getFieldEl();
        var legendEl = $(fieldEl).find("legend").first();
        var anchorEl = $("[data-bs-toggle='collapse'], [data-toggle='collapse']", legendEl);
        if ($(anchorEl).length > 0)
        {
            var containerEl = this.getContainerEl();

            // container id
            var id = $(containerEl).attr("id");
            if (!id) {
                id = Alpaca.generateId();
                $(containerEl).attr("id", id);
            }

            // set up container to be collapsible
            $(containerEl).addClass("collapse");
            if (!this.options.collapsed)
            {
                $(containerEl).addClass("show");
            }

            // set up legend anchor with BS5 attributes
            $(anchorEl).attr("data-bs-toggle", "collapse");
            if (!$(anchorEl).attr("data-bs-target") && !$(anchorEl).attr("data-target")) {
                $(anchorEl).attr("data-bs-target", "#" + id);
            } else if ($(anchorEl).attr("data-target") && !$(anchorEl).attr("data-bs-target")) {
                $(anchorEl).attr("data-bs-target", $(anchorEl).attr("data-target"));
            }

            $(anchorEl).mouseover(function(e) {
                $(this).css("cursor", "pointer");
            });
        }
    };

    // table-control callbacks
    callbacks["tableHeaderRequired"] = function(schema, options, domEl)
    {
        $('<span class="alpaca-icon-required bi bi-star"></span>').prependTo(domEl);
    };

    callbacks["tableHeaderOptional"] = function(schema, options, domEl)
    {
    };

    Alpaca.registerView({
        "id": "bootstrap5-display",
        "parent": "web-display",
        "type": "display",
        "ui": "bootstrap5",
        "title": "Display View for Bootstrap 5",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "bootstrap5-display-horizontal",
        "parent": "bootstrap5-display",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "bootstrap5-edit",
        "parent": "web-edit",
        "type": "edit",
        "ui": "bootstrap5",
        "title": "Edit View for Bootstrap 5",
        "displayReadonly": true,
        "callbacks": callbacks,
        "styles": styles,
        "templates": {}
    });

    Alpaca.registerView({
        "id": "bootstrap5-edit-horizontal",
        "parent": "bootstrap5-edit",
        "horizontal": true
    });

    Alpaca.registerView({
        "id": "bootstrap5-create",
        "parent": "bootstrap5-edit",
        "title": "Create View for Bootstrap 5",
        "type": "create",
        "displayReadonly": false
    });

    Alpaca.registerView({
        "id": "bootstrap5-create-horizontal",
        "parent": "bootstrap5-create",
        "horizontal": true
    });

})(jQuery);
