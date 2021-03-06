'use strict';
/* login redirect-to */
function getParameterByName(name)
{
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regexS = "[\\?&]" + name + "=([^&#]*)";
  var regex = new RegExp(regexS);
  var results = regex.exec(window.location.href);
  if(results === null) {
    return "";
  }
  else {
    return decodeURIComponent(results[1].replace(/\+/g, " "));
  }
}

$().ready(function(){



    /* POPOVERS */

    // Popover utility functions
    var popover = {
        open: function(p, trigger) {
            // display popover and focus its first input if present
            if (!$(p).hasClass('visible')) {
                p.addClass('visible');

                if (trigger)
                    trigger.addClass('active');

                var fields = p.children('input');
                if (fields) {
                    if (fields.length > 1) fields[0].focus();
                    else fields.focus();
                }
            }
        },

        close: function(p) {
            // if popover is visible and any parent form is not busy, then close this popover
            if ($(p).hasClass('visible') && !$(p).parents('form').hasClass('working')) {
                var popId = $(p).attr('data-popid');
                $('[data-popid='+popId+'].popover-trigger').removeClass('active');
                $(p).removeClass('visible');
            }
        }
    };

    // show popover when trigger clicked
    $('[data-popid].popover-trigger').click(function(event) {
        event.preventDefault();
        event.stopPropagation();

        var trigger = $(event.target);

        // get popover ID from trigger, used to identify other elements of _this_ popover
        var popId = trigger.attr('data-popid');
        var popoverElem = $('[data-popid='+popId+'].popover');

        // close any other open popovers
        $('.popover.visible').each(function(i, p) {
            if ($(p).attr('data-popid') !== popId)
                popover.close(p);
        });

        // if this trigger's popover is open, close it
        if (popoverElem.hasClass('visible'))
            popover.close(popoverElem);
        // else open the popover
        else
            popover.open(popoverElem, trigger);
    });

    // hide popover when clicked outside
    $('html').click(function(event) {
        // if click comes from inside or is a visible popover, DO NOT close (!)
        if ($('.popover.visible').find(event.target).length > 0 ||
            $('.popover.visible').is(event.target)) {
            return;
        }

        // else, remove visible popovers
        $('.popover').each(function(i, p){
            popover.close(p);
        });
    });

    // center popover
    $.fn.centerPopover = function() {
        this.each(function(i, element){
            element = $(element);

            // get popover ID from trigger, used to identify other elements of _this_ popover
            var popId = element.attr('data-popid');

            var trigger = $('[data-popid='+popId+'].popover-trigger');
            var popover = $('[data-popid='+popId+'].popover');
            var arrow = $('[data-popid='+popId+'].popover-direction');

            /*var*/ triggerWidth = trigger.outerWidth(),
                triggerXOffset = trigger.offset().left,
                triggerIntPosition = trigger.position().left;
                popoverWidth = popover.outerWidth(),
                popoverXOffset = trigger.offset().left,
                arrowWidth = arrow.outerWidth(),
                bodyWidth = $('body').innerWidth();


            // Center the popover over the button
            popover.css('right', ((triggerWidth + triggerIntPosition) - popoverWidth) / 2);
            arrow.css('right', ((triggerWidth + triggerIntPosition) - (arrowWidth/2)) / 2);

            // Correct if the popover goes outside the window
            if ((popoverXOffset + popoverWidth) > bodyWidth) {
                var overshot = (popoverXOffset + popoverWidth) - bodyWidth,
                    currentMargin = parseInt(popover.css('right')),
                    toMove = currentMargin + overshot;
                if (toMove >= 0) toMove = 0;
                popover.css('right', toMove);
            }
        });

        return this; // jquery chaining
    }
    // re-center as window resizes
    window.onresize = function(){
        $('.popover').centerPopover();
    };
    $('.popover').centerPopover(); // center once at DOM startup


    /* NEXT... FIELD (secondary email addresses) */
    var duplicate = function(){
        var toClone = $(this).prev().clone(true);
        if (toClone.children('label')) toClone.children('label').detach();
        if (toClone.hasClass('fail')) toClone.removeClass('fail');
        if (toClone.hasClass('inprogress')) toClone.removeClass('inprogress');
        toClone.children('input').attr('value', '');
        toClone.insertBefore(this).children('input').focus();
    }
    $('.multi-field .field.next').focusin(duplicate);
    $('.multi-field .field input').focusout(function(){
        numberOfFields = $('.multi-field .field').not('.next').length;
        if (numberOfFields > 1 && !$(this).val()) {
            var fieldLabel;
            if ($(this).parent().has('label').length > 0) fieldLabel = $(this).parent().children('label')
            $(this).parent().detach();
            if (fieldLabel) {
                fieldLabel.prependTo('.multi-field .field:first-child');
            }
        }
        else if (numberOfFields == 1 && !$(this).attr('value')) $('.multi-field .field.next').detach();
    });
    $('.multi-field .field:first-child').keydown(function(){
        if ($(this).children('input').attr('value') && $('.multi-field .field').length == 1) {
            var toClone = $(this).clone(true);
            if (toClone.children('label')) toClone.children('label').detach();
            toClone.addClass('next').children('input').attr('value', 'Next…').attr('name', '').siblings('.description').css('visibility', 'hidden');
            toClone.focusin(duplicate);
            toClone.insertAfter(this);
        }
    });


    // Bootstrap Popovers
    $('[data-toggle="popover"]').popover({html: true});
    $('script[data-target="popover"]').each(function(i, content) {
        var id = content.dataset.contentId;
        $('[data-toggle="popover"][data-content-id="' + id + '"]')[0]
            .dataset.content = $(this).html();

    })

});
