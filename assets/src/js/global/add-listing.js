// General Components
import '../public/components/directoristDropdown'
import '../public/components/directoristSelect';
import '../public/components/colorPicker';
import '../global/components/setup-select2';

/* eslint-disable */
const $ = jQuery;
const localized_data = directorist.add_listing_data;

/**
 * Join Query String
 *
 * @param string url
 * @param string queryString
 * @return string
 */
 function joinQueryString( url, queryString ) {
    return url.match( /[?]/ ) ? `${url}&${queryString}` : `${url}?${queryString}`;
}

function scrollTo(selector) {
    document.querySelector(selector)?.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
    });
}

/* Show and hide manual coordinate input field */
$(window).on('load', function () {
    if ($('input#manual_coordinate').length) {

        $('input#manual_coordinate').each((index, element) => {
            if (!$(element).is(':checked')) {
                $('#hide_if_no_manual_cor').hide();
                $('.directorist-map-coordinates').hide();
            }
        });
    }

    //initialize color picker
    if($('.directorist-color-field-js').length){
        $('.directorist-color-field-js').wpColorPicker().empty();
    }
});

$(document).ready(function () {
    $('body').on("click", "#manual_coordinate", function (e) {
        if ($('input#manual_coordinate').is(':checked')) {
            $('.directorist-map-coordinates').show();
            $('#hide_if_no_manual_cor').show();
        } else {
            $('.directorist-map-coordinates').hide();
            $('#hide_if_no_manual_cor').hide();
        }
    });

    // SOCIAL SECTION
    // Rearrange the IDS and Add new social field
    $('body').on('click', '#addNewSocial', function (e) {
        const social_wrap = $('#social_info_sortable_container'); // cache it
        const currentItems = $('.directorist-form-social-fields').length;
        const ID = `id=${currentItems}`; // eg. 'id=3'
        const iconBindingElement = jQuery('#addNewSocial');

        // arrange names ID in order before adding new elements
        $('.directorist-form-social-fields').each(function (index, element) {
            const e = $(element);
            e.attr('id', `socialID-${index}`);
            e.find('select').attr('name', `social[${index}][id]`);
            e.find('.atbdp_social_input').attr('name', `social[${index}][url]`);
            e.find('.directorist-form-social-fields__remove').attr('data-id', index);
        });

        // now add the new elements. we could do it here without using ajax but it would require more markup here.
        atbdp_do_ajax(iconBindingElement, 'atbdp_social_info_handler', ID, function (data) {
            social_wrap.append(data);
        });

        setTimeout(() => {
            let socialSelect = this.parentElement.querySelectorAll('.directorist-form-social-fields select');
            socialSelect.forEach(item => {
                if (item.value !== '') {
                    item.classList.remove('placeholder-item');
                }
                item.addEventListener('change', function () {
                    if (this.value !== '' && this.classList.contains('placeholder-item')) {
                        this.classList.remove('placeholder-item');
                    } else if (this.value === '') {
                        this.classList.add('placeholder-item');
                    }
                })
            })
        }, 300);

        
    });
    document.addEventListener('directorist-reload-plupload', function(){
        if($('.directorist-color-field-js').length){
            $('.directorist-color-field-js').wpColorPicker().empty();
        }
    })

    // remove the social field and then reset the ids while maintaining position
    $('body').on('click', '.directorist-form-social-fields__remove', function (e) {
        const id = $(this).data('id');
        const elementToRemove = $(`div#socialID-${id}`);
        /* Act on the event */
        swal({
                title: localized_data.i18n_text.confirmation_text,
                text: localized_data.i18n_text.ask_conf_sl_lnk_del_txt,
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: localized_data.i18n_text.confirm_delete,
                closeOnConfirm: false,
            },
            function (isConfirm) {
                if (isConfirm) {
                    // user has confirmed, no remove the item and reset the ids
                    elementToRemove.slideUp('fast', function () {
                        elementToRemove.remove();
                        // reorder the index
                        $('.directorist-form-social-fields').each(function (index, element) {
                            const e = $(element);
                            e.attr('id', `socialID-${index}`);
                            e.find('select').attr('name', `social[${index}][id]`);
                            e.find('.atbdp_social_input').attr(
                                'name',
                                `social[${index}][url]`
                            );
                            e.find('.directorist-form-social-fields__remove').attr('data-id', index);
                        });
                    });

                    // show success message
                    swal({
                        title: localized_data.i18n_text.deleted,
                        // text: "Item has been deleted.",
                        type: 'success',
                        timer: 200,
                        showConfirmButton: false,
                    });
                }
            }
        );
    });

    /* This function handles all ajax request */
    function atbdp_do_ajax(ElementToShowLoadingIconAfter, ActionName, arg, CallBackHandler) {
        let data;
        if (ActionName) data = `action=${ActionName}`;
        if (arg) data = `${arg}&action=${ActionName}`;
        if (arg && !ActionName) data = arg;
        // data = data ;

        const n = data.search(localized_data.nonceName);

        if (n < 0) {
            const nonce = ( typeof directorist !== 'undefined' ) ? directorist.directorist_nonce : directorist_admin.directorist_nonce;
            data = `${data}&${'directorist_nonce'}=${nonce}`;
        }

        jQuery.ajax({
            type: 'post',
            url: localized_data.ajaxurl,
            data,
            beforeSend() {
                jQuery("<span class='atbdp_ajax_loading'></span>").insertAfter(
                    ElementToShowLoadingIconAfter
                );
            },
            success(data) {
                jQuery('.atbdp_ajax_loading').remove();
                CallBackHandler(data);
            },
        });
    }

    // Select2 js code
    if (!localized_data.is_admin) {
        // Location
        const createLoc = $('#at_biz_dir-location').attr("data-allow_new");
        let maxLocationLength = $('#at_biz_dir-location').attr("data-max");
        if (createLoc) {
            $("#at_biz_dir-location").select2({
                tags: true,
                maximumSelectionLength: maxLocationLength,
                language: {
                    maximumSelected: function () {
                        return localized_data.i18n_text.max_location_msg;
                    }
                },
                tokenSeparators: [","],
            });
        } else {
            $("#at_biz_dir-location").select2({
                allowClear: true,
                tags: false,
                maximumSelectionLength: maxLocationLength,
                tokenSeparators: [","],
            });
        }

        // Tags
        const createTag = $('#at_biz_dir-tags').attr("data-allow_new");
        let maxTagLength = $('#at_biz_dir-tags').attr("data-max");
        if (createTag) {
            $('#at_biz_dir-tags').select2({
                tags: true,
                maximumSelectionLength: maxTagLength,
                tokenSeparators: [','],
            });
        } else {
            $('#at_biz_dir-tags').select2({
                allowClear: true,
                maximumSelectionLength: maxTagLength,
                tokenSeparators: [','],
            });
        }

        //Category
        const createCat = $('#at_biz_dir-categories').attr("data-allow_new");
        let maxCatLength = $('#at_biz_dir-categories').attr("data-max");
        if (createCat) {
            $('#at_biz_dir-categories').select2({
                allowClear: true,
                tags: true,
                maximumSelectionLength: maxCatLength,
                tokenSeparators: [','],
            });
        } else {
            $('#at_biz_dir-categories').select2({
                maximumSelectionLength: maxCatLength,
                allowClear: true,
            });
        }

    }

    /**
     * Price field.
     */
    function getPriceTypeInput(typeId) {
        return $(`#${$(`[for="${typeId}"]`).data('option')}`);
    }

    $( '.directorist-form-pricing-field__options' ).on( 'change', 'input', function() {
        const $otherOptions = $(this).parent().siblings('.directorist-checkbox').find( 'input' );

        $otherOptions.prop( 'checked', false );
        getPriceTypeInput( $otherOptions.attr('id') ).hide();

        if ( this.checked ) {
            getPriceTypeInput( this.id ).show();
        } else {
            getPriceTypeInput( this.id ).hide();
        }
    } );

    if ( $( '.directorist-form-pricing-field' ).hasClass( 'price-type-both' ) ) {
        $( '#price_range, #price' ).hide();

        const $selectedPriceType = $( '.directorist-form-pricing-field__options input:checked' );

        if ( $selectedPriceType.length ) {
            getPriceTypeInput( $selectedPriceType.attr( 'id' ) ).show();
        } else {
            $( $( '.directorist-form-pricing-field__options input' ).get(0) )
                .prop( 'checked', true )
                .trigger( 'change' );
        }
    }

    const has_tagline = $('#has_tagline').val();
    const has_excerpt = $('#has_excerpt').val();
    if (has_excerpt && has_tagline) {
        $('.atbd_tagline_moto_field').fadeIn();
    } else {
        $('.atbd_tagline_moto_field').fadeOut();
    }

    $('#atbd_optional_field_check').on('change', function () {
        $(this).is(':checked') ?
            $('.atbd_tagline_moto_field').fadeIn() :
            $('.atbd_tagline_moto_field').fadeOut();
    });

    // it shows the hidden term and conditions
    $('#listing_t_c').on('click', function (e) {
        e.preventDefault();
        $('#tc_container').toggleClass('active');
    });



    // Load custom fields of the selected category in the custom post type "atbdp_listings"
    const qs = (function (a) {
        if (a == '') return {};
        const b = {};
        for (let i = 0; i < a.length; ++i) {
            const p = a[i].split('=', 2);
            if (p.length == 1) b[p[0]] = '';
            else b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    function render_category_based_fields() {

        if ( directorist.is_admin ) {

            var directory_type = $('select[name="directory_type"]').val();
            var from_single_directory = $('input[name="directory_type"]').val();
            directory_type = directory_type ? directory_type : from_single_directory;

            var length = $('#at_biz_dir-categorychecklist input:checked');
            var id = [];

            if (length) {
                length.each((el, index) => {
                    id.push($(index).val());
                });
            }

            var post_id = $('#post_ID').val();

        } else {
            var directory_type = $('input[name="directory_type"]').val();
            var length = $('#at_biz_dir-categories option:selected');
            var id = [];
            length.each((el, index) => {
                id.push($(index).val());
            });

            var post_id = $('input[name="listing_id"]').val();
        }

        const data = {
            action: 'atbdp_custom_fields_listings',
            directorist_nonce: directorist.directorist_nonce,
            post_id: post_id,
            term_id: id,
            directory_type: directory_type
        };

        $.post(localized_data.ajaxurl, data, function (response) {
            if (response) {
                $('.atbdp_category_custom_fields').empty();
                $.each(response, function( id, content ) {
                    let $newMarkup  = $(content);
                    if($newMarkup.find('.directorist-form-element')[0] !== undefined){
                        $newMarkup.find('.directorist-form-element')[0].setAttribute('data-id', `${id}`);
                    }
                    if($($newMarkup[0]).find('.directorist-radio input, .directorist-checkbox input').length){
                        $($newMarkup[0]).find('.directorist-radio input, .directorist-checkbox input').each((i, item)=>{
                            $(item).attr('id', `directorist-cf-${id}-${i}`);
                            $(item).attr('data-id', `directorist-cf-${id}-${i}`);
                            $(item).addClass('directorist-form-checks');
                        })
                        $($newMarkup[0]).find('.directorist-radio label, .directorist-checkbox label').each((i, item)=>{
                            $(item).attr('for', `directorist-cf-${id}-${i}`);
                        })
                    }

                    $('.atbdp_category_custom_fields').append($newMarkup);
                });
                $('.atbdp_category_custom_fields-wrapper').show();

                customFieldSeeMore();

                formData.forEach(item =>{
                    let fieldSingle = document.querySelector(`[data-id="${item.id}"]`);
                    if(fieldSingle !== null && fieldSingle.classList.contains('directorist-form-element') ){
                        fieldSingle.value = item.value;
                    }
                    if(fieldSingle !== null && !fieldSingle.classList.contains('directorist-form-element')){
                        fieldSingle.checked = item.checked;
                    }
                })
            } else {
                $('.atbdp_category_custom_fields').empty();
                $('.atbdp_category_custom_fields-wrapper').hide();
            }
        });
    }

    // Create container div after category (in frontend)
    $('.directorist-form-categories-field').after('<div class="atbdp_category_custom_fields"></div>');

    // Render category based fields in first load
    render_category_based_fields();

    /* Store custom fields data */
    let formData = [];
    function storeCustomFieldsData(){
        let customFields = document.querySelectorAll(`.atbdp_category_custom_fields .directorist-form-element`);
        let checksField = document.querySelectorAll('.atbdp_category_custom_fields .directorist-form-checks');
        if(customFields.length){
            customFields.forEach(elm=>{
                let elmValue = elm.value;
                let elmId = elm.getAttribute('data-id');
                formData.push({"id": elmId, "value": elmValue});
            });
        }
        if(checksField.length){
            checksField.forEach(elm=>{
                let elmChecked = elm.checked;
                let elmId = elm.getAttribute('id');
                formData.push({"id": elmId, "checked": elmChecked});
            });
        }
    }

    // Render category based fields on category change (frontend)
    $('#at_biz_dir-categories').on('change', function () {
        render_category_based_fields();
        storeCustomFieldsData();
    });

    // Render category based fields on category change (backend)
    $('#at_biz_dir-categorychecklist').on('change', function (event) {
        render_category_based_fields();
        storeCustomFieldsData();
    });

    function atbdp_element_value(element) {
        const field = $(element);
        if (field.length) {
            return field.val();
        }
        return '';
    }

    let mediaUploaders = [];
    if (localized_data.media_uploader) {
        for (let uploader of localized_data.media_uploader) {
            if ($('.' + uploader.element_id).length) {
                const EzUploader = new EzMediaUploader({
                    containerClass: uploader.element_id,
                });

                mediaUploaders.push({
                    media_uploader: EzUploader,
                    uploaders_data: uploader,
                });

                EzUploader.init();
                // mediaUploaders[i].media_uploader.init();
            }
        }
    }

    let on_processing = false;
    let has_media = true;
    let quick_login_modal__success_callback = null;
    const $notification = $('#listing_notifier');

    // -----------------------------
    // Submit The Form
    // -----------------------------
    let uploadedImages = [];

    $('body').on('submit', '#directorist-add-listing-form', function (e) {
        e.preventDefault();

        const $form       = $(e.target);
        let   error_count = 0;
        const err_log     = {};
        const $submitButton = $('.directorist-form-submit__btn');

        if (on_processing) {
            return;
        }

        function disableSubmitButton() {
            on_processing = true;
            $submitButton.addClass('atbd_loading').attr('disabled', true);
        }

        function enableSubmitButton() {
            on_processing = false;
            $submitButton.removeClass('atbd_loading').attr('disabled', false);
        }

        // images
        let selectedImages = [];

        if (mediaUploaders.length) {
            for (var uploader of mediaUploaders) {
                if (!uploader.media_uploader || $(uploader.media_uploader.container).parents('form').get(0) !== $form.get(0)) {
                    continue;
                }

                if (!uploader.media_uploader.hasValidFiles()) {
                    $submitButton.removeClass('atbd_loading');

                    err_log.listing_gallery = {
                        msg: uploader.uploaders_data['error_msg']
                    };

                    error_count++;
                    scrollTo('.' + uploader.uploaders_data.element_id);
                    break;
                }

                selectedImages = uploader.media_uploader.getTheFiles();
            }
        }

        if ( selectedImages.length ) {
            let counter = 0;

            function uploadImage() {
                const formData = new FormData();

                formData.append( 'action', 'directorist_upload_listing_image' );
                formData.append( 'directorist_nonce', directorist.directorist_nonce );
                formData.append( 'image', selectedImages[ counter ] );

                $.ajax( {
                    method: 'POST',
                    processData: false,
                    contentType: false,
                    url: localized_data.ajaxurl,
                    data: formData,
                    beforeSend() {
                        disableSubmitButton();

                        const totalImages = selectedImages.length;
                        if ( totalImages === 1 ) {
                            $notification
                                .show()
                                .html(`<span class="atbdp_success">${localized_data.i18n_text.image_uploading_msg}</span>`);
                        } else {
                            const completedPercent = Math.ceil( ( ( counter === 0 ? 1 : counter ) * 100 ) / totalImages );
                            $notification
                                .show()
                                .html(`<span class="atbdp_success">${localized_data.i18n_text.image_uploading_msg} (${completedPercent}%)</span>`);
                        }
                    },
                    success( response ) {
                        if ( ! response.success ) {
                            enableSubmitButton()

                            $notification.show().html(`<span class="atbdp_error">${response.data}</span>`);

                            return;
                        }

                        uploadedImages.push( response.data );

                        counter++;

                        if ( counter < selectedImages.length ) {
                            uploadImage();
                        } else {
                            submitForm( $form, uploadedImages );
                        }
                    },
                    error(response) {
                        enableSubmitButton();

                        $notification.html(`<span class="atbdp_error">${response.responseJSON.data}</span>`);
                    }
                } );
            }

            if ( uploadedImages.length === selectedImages.length ) {
                submitForm( $form, uploadedImages );
            } else {
                uploadImage();
            }
        } else {
            submitForm( $form );
        }

        function submitForm( $form, uploadedImages = [] ) {
            var error_count = 0;
            var err_log     = {};
            let form_data   = new FormData();

            form_data.append('action', 'add_listing_action');
            form_data.append('directorist_nonce', directorist.directorist_nonce);
            form_data.append('listing_img', uploadedImages );

            disableSubmitButton();

            const fieldValuePairs = $form.serializeArray();

            // Append Form Fields Values
            for ( const field of fieldValuePairs ) {
                form_data.append( field.name, field.value );
            }

            //images
            if (mediaUploaders.length) {
                for (var uploader of mediaUploaders) {
                    if (!uploader.media_uploader || $(uploader.media_uploader.container).parents('form').get(0) !== $form.get(0)) {
                        continue;
                    }

                    if (uploader.media_uploader.hasValidFiles()) {
                        var files_meta = uploader.media_uploader.getFilesMeta();
                        if (files_meta) {
                            for (var i = 0; i < files_meta.length; i++) {
                                form_data.append(`listing_img_old[${i}]`, files_meta[i].attachmentID);
                            }
                        }
                    } else {
                        err_log.listing_gallery = {
                            msg: uploader.uploaders_data['error_msg']
                        };

                        error_count++;

                        if ($('.' + uploader.uploaders_data.element_id).length) {
                            scrollTo('.' + uploader.uploaders_data.element_id);
                        }
                    }
                }
            }

            // categories
            const categories = $form.find('#at_biz_dir-categories').val();
            if ( Array.isArray( categories ) && categories.length ) {
                for ( let key in categories ) {
                    form_data.append('tax_input[at_biz_dir-category][]', categories[key]);
                }
            }

            if ( typeof categories === 'string' ) {
                form_data.append('tax_input[at_biz_dir-category][]', categories);
            }

            if( form_data.has( 'admin_category_select[]') ) {
                form_data.delete( 'admin_category_select[]' );
            }

            if( form_data.has( 'directory_type') ) {
                form_data.delete( 'directory_type' );
            }

            var form_directory_type = $form.find( "input[name='directory_type']" );

            var form_directory_type_value = form_directory_type !== undefined ? form_directory_type.val() : '';
            var directory_type = qs.directory_type ? qs.directory_type : form_directory_type_value;

            form_data.append('directory_type', directory_type);

            if (qs.plan) {
                form_data.append('plan_id', qs.plan);
            }

            if (error_count) {
                enableSubmitButton();

                console.log('Form has invalid data');
                console.log(error_count, err_log);
                return;
            }

            $.ajax({
                method: 'POST',
                processData: false,
                contentType: false,
                url: localized_data.ajaxurl,
                data: form_data,
                beforeSend() {
                    disableSubmitButton();

                    $notification
                        .show()
                        .html(`<span class="atbdp_success">${localized_data.i18n_text.submission_wait_msg}</span>`);
                },
                success(response) {
                    var redirect_url = ( response && response.redirect_url ) ? response.redirect_url : '';
                    redirect_url = ( redirect_url && typeof redirect_url === 'string' ) ? response.redirect_url.replace( /:\/\//g, '%3A%2F%2F' ) : '';

                    if (response.error === true) {
                        enableSubmitButton();

                        $notification.show().html(`<span>${response.error_msg}</span>`);

                        if (response.quick_login_required) {
                            var modal = $('#directorist-quick-login');
                            var email = response.email;

                            // Prepare fields
                            modal.find('input[name="email"]').val(email);
                            modal.find('input[name="email"]').prop('disabled', true);

                            // Show alert
                            var alert = '<div class="directorist-alert directorist-alert-info directorist-mb-10 atbd-text-center directorist-mb-10">' + response.error_msg + '</div>';
                            modal.find('.directorist-modal-alerts-area').html(alert);

                            // Show the modal
                            modal.addClass('show');

                            quick_login_modal__success_callback = function (args) {
                                $('#guest_user_email').prop('disabled', true);
                                $notification.hide().html('');

                                args.elements.submit_button.remove();

                                var form_actions = args.elements.form.find('.directorist-form-actions');
                                form_actions.find('.directorist-toggle-modal').removeClass('directorist-d-none');
                            }
                        }
                    } else {
                        // preview on and no need to redirect to payment
                        if (response.preview_mode === true && response.need_payment !== true) {
                            if (response.edited_listing !== true) {
                                $notification
                                    .show()
                                    .html(`<span class="atbdp_success">${response.success_msg}</span>`);

                                window.location.href = joinQueryString( response.preview_url, `preview=1&redirect=${redirect_url}` );

                            } else {
                                $notification
                                    .show()
                                    .html(`<span class="atbdp_success">${response.success_msg}</span>`);
                                if (qs.redirect) {
                                    window.location.href = joinQueryString( response.preview_url, `post_id=${response.id}&preview=1&payment=1&edited=1&redirect=${qs.redirect}` );
                                } else {
                                    window.location.href = joinQueryString( response.preview_url, `preview=1&edited=1&redirect=${redirect_url}` );
                                }
                            }
                            // preview mode active and need payment
                        } else if (response.preview_mode === true && response.need_payment === true) {
                            window.location.href = joinQueryString( response.preview_url, `preview=1&payment=1&redirect=${redirect_url}` );
                        } else {
                            const is_edited = response.edited_listing ? `listing_id=${response.id}&edited=1` : '';

                            if (response.need_payment === true) {
                                $notification.show().html(`<span class="atbdp_success">${response.success_msg}</span>`);
                                window.location.href = decodeURIComponent(redirect_url);
                            } else {
                                $notification.show().html(`<span class="atbdp_success">${response.success_msg}</span>`);
                                window.location.href = joinQueryString( response.redirect_url, is_edited );
                            }
                        }
                    }
                },
                error(error) {
                    enableSubmitButton();

                    console.log(error);
                },
            });
        }
    } );

    // Custom Field Checkbox Button More
    function customFieldSeeMore() {
        if ($('.directorist-custom-field-btn-more').length) {
            $('.directorist-custom-field-btn-more').each((index, element) => {
                let fieldWrapper = $(element).closest('.directorist-custom-field-checkbox, .directorist-custom-field-radio');
                let customField = $(fieldWrapper).find('.directorist-checkbox, .directorist-radio');
                $(customField).slice(20, customField.length).hide();

                if (customField.length <= 20) {
                    $(element).hide();
                }
            });
        }
    }
    $(window).on('load', function () {
        customFieldSeeMore();
    });

    $('body').on('click', '.directorist-custom-field-btn-more', function (event) {
        event.preventDefault();
        let fieldWrapper = $(this).closest('.directorist-custom-field-checkbox, .directorist-custom-field-radio');
        let customField = $(fieldWrapper).find('.directorist-checkbox, .directorist-radio');
        $(customField).slice(20, customField.length).slideUp();

        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            $(this).text(localized_data.i18n_text.see_less_text);
            $(customField).slice(20, customField.length).slideDown();
        } else {
            $(this).text(localized_data.i18n_text.see_more_text);
            $(customField).slice(20, customField.length).slideUp();
        }

    });

    // ------------------------------
    // Quick Login
    // ------------------------------
    $('#directorist-quick-login .directorist-toggle-modal').on("click", function (e) {
        e.preventDefault();
        $("#directorist-quick-login").removeClass("show");
    });

    $('#quick-login-from-submit-btn').on('click', function (e) {
        e.preventDefault();

        var form_id = $(this).data('form');
        var modal_id = $(this).data('form');

        var modal = $(modal_id);
        var form = $(form_id);
        var form_feedback = form.find('.directorist-form-feedback');

        var email = $(form).find('input[name="email"]');
        var password = $(form).find('input[name="password"]');
        var security = $(form).find('input[name="directorist-quick-login-security"]');

        var form_data = {
            action: 'directorist_ajax_quick_login',
            username: email.val(),
            password: password.val(),
            rememberme: false,
            ['directorist-quick-login-security']: security.val(),
        };

        var submit_button = $(this);
        var submit_button_default_html = submit_button.html();

        $.ajax({
            method: 'POST',
            url: directorist.ajaxurl,
            data: form_data,
            beforeSend: function () {
                form_feedback.html('');
                submit_button.prop('disabled', true);
                submit_button.prepend('<i class="fas fa-circle-notch fa-spin"></i> ');
            },
            success: function (response) {
                submit_button.html(submit_button_default_html);

                if (response.loggedin) {
                    password.prop('disabled', true);
                    var message = 'Successfully logged in, please continue to the listing submission';
                    var msg = '<div class="directorist-alert directorist-alert-success directorist-text-center directorist-mb-20">' + message + '</div>';
                    form_feedback.html(msg);

                    if (quick_login_modal__success_callback) {
                        var args = {
                            elements: {
                                modal_id,
                                form,
                                email,
                                password,
                                submit_button
                            }
                        };
                        quick_login_modal__success_callback(args);
                    }
                } else {
                    var msg = '<div class="directorist-alert directorist-alert-danger directorist-text-center directorist-mb-20">' + response.message + '</div>';
                    form_feedback.html(msg);
                    submit_button.prop('disabled', false);
                }
            },
            error: function (error) {
                console.log({
                    error
                });
                submit_button.prop('disabled', false);
                submit_button.html(submit_button_default_html);
            },
        });
    });

    // Sticky Navigation on Add Listing
    function addSticky () {
        $(window).scroll(function() {
            var windowWidth = $(window).width();
            var sidebarWidth = $(".multistep-wizard__nav").width();
            var sidebarHeight = $(".multistep-wizard__nav").height();
            var multiStepWizardOffset = $(".multistep-wizard").offset() && $(".multistep-wizard").offset().top;
            var multiStepWizardHeight = $(".multistep-wizard").outerHeight();
            
            if (windowWidth > 991) {
                var scrollPos = $(window).scrollTop();
        
                // Check if the user has scrolled down to the container position
                if (scrollPos >= multiStepWizardOffset) {
                    $(".multistep-wizard__nav").addClass("sticky");
                    $(".multistep-wizard__content").css("padding-left", sidebarWidth + 30 + 'px')
                    // Check if the user has fully scrolled the container
                    if (scrollPos >= (multiStepWizardOffset + multiStepWizardHeight) - sidebarHeight) {
                        $(".multistep-wizard__nav").removeClass("sticky");
                        $(".multistep-wizard__content").css("padding-left", '0px')
                    } else {
                        $(".multistep-wizard__nav").addClass("sticky");
                        $(".multistep-wizard__content").css("padding-left", sidebarWidth + 30 + 'px')
                    }
                } else {
                    $(".multistep-wizard__nav").removeClass("sticky");
                    $(".multistep-wizard__content").css("padding-left", '0px')
                }
            } else {
                $(".multistep-wizard__nav").removeClass("sticky");
                $(".multistep-wizard__content").css("padding-left", '0px')
            }
        });

    }

    addSticky ();

    multiStepWizard();

    defaultAddListing()
    
})

// MultiStep Wizard
function multiStepWizard() {
    let defaultAddListing = document.querySelector('.multistep-wizard.default-add-listing');
    if(!defaultAddListing) {
        let totalStep = document.querySelectorAll('.multistep-wizard .multistep-wizard__nav__btn');
        let totalWizard = document.querySelectorAll('.multistep-wizard .multistep-wizard__single');
        let totalWizardCount = document.querySelector('.multistep-wizard .multistep-wizard__count__total');
        let currentWizardCount = document.querySelector('.multistep-wizard .multistep-wizard__count__current');
        let progressWidth = document.querySelector('.multistep-wizard .multistep-wizard__progressbar__width');

        let stepCount = 1;

        let progressPerStep = 100 / totalWizard.length;

        // Initialize Wizard Count & Progressbar
        if(currentWizardCount) {
            currentWizardCount.innerHTML = stepCount;
        }
        if(totalWizardCount) {
            totalWizardCount.innerHTML = totalWizard.length;
        }
        if(progressWidth) {
            progressWidth.style.width= progressPerStep + '%';
        }

        // Set data-id on Wizards
        totalWizard.forEach(function(item, index){
            item.setAttribute('data-id' , index); 
            item.style.display = 'none';
            if (index === 0) {
                item.style.display = 'block';
                item.classList.add('active');
            }
        })

        // Set data-step on Nav Items
        totalStep.forEach(function(item, index){
            item.setAttribute('data-step' , index); 
            if (index === 0) {
                item.classList.add('active');
            }
        })

        // Go Previous Step
        $('.multistep-wizard__btn--prev').on('click', function (e) {
            e.preventDefault();
            if(stepCount > 1) {
                stepCount--
                activeWizard(stepCount);
                if(stepCount <= 1) {
                    this.setAttribute('disabled' , true); 
                }
            } 
        });

        // Go Next Step
        $('.multistep-wizard__btn--next').on('click', function (e) {
            e.preventDefault();
            if(stepCount < totalWizard.length) {
                stepCount++
                activeWizard(stepCount);
            }
        });

        // Go Random Step
        $('.multistep-wizard__nav__btn').on('click', function (e) {
            e.preventDefault()
            if (this.classList.contains('completed')) {
                let currentStep = Number(this.attributes[3].value) + 1;
                stepCount = currentStep;
                activeWizard(stepCount);
            }

            if(stepCount<=1) {
                $('.multistep-wizard__btn--prev').attr('disabled', true);
            }
        });

        // Active Wizard
        function activeWizard (value) {
            // Add Active Class
            totalWizard.forEach(function(item, index){
                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.style.display = 'none';
                } else if (value - 1 === index)  {
                    item.classList.add('active');
                    item.style.display = 'block';
                }
            })

            // Add Completed Class
            totalStep.forEach(function(item, index){
                if(index + 1 < value) {
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }

                if (item.classList.contains('active')) {
                    item.classList.remove('active');
                } else if (value - 1 === index)  {
                    item.classList.add('active');
                }
                
            })

            // Enable Previous Button
            if(value > 1) {
                $('.multistep-wizard__btn--prev').removeAttr('disabled');
            } 

            // Change Button Text on Last Step
            let nextBtn = document.querySelector('.multistep-wizard__btn--next');
            let previewBtn = document.querySelector('.multistep-wizard__btn--save-preview');
            let submitBtn = document.querySelector('.multistep-wizard__btn--skip-preview');
            if(value === totalWizard.length) {
                nextBtn.style.cssText = "display:none; width: 0; height: 0; opacity: 0; visibility: hidden;";
                previewBtn.style.cssText = "height: 54px; flex: unset; opacity: 1; visibility: visible;";
                submitBtn.style.cssText = "height: 54px; opacity: 1; visibility: visible;";
            } else {
                nextBtn.style.cssText = "display:inline-flex; width: 200px; height: 54px; opacity: 1; visibility: visible;";
                previewBtn.style.cssText = "height: 0; flex: 0 0 100%; opacity: 0; visibility: hidden;";
                submitBtn.style.cssText = "height: 0; opacity: 0; visibility: hidden;";
            }

            // Update Wizard Count & Progressbar
            currentWizardCount.innerHTML = value;
            progressWidth.style.width= progressPerStep * value + '%';
            progressWidth.style.transition = "0.5s ease";
        }
    } 
}

// Default Add Listing
function defaultAddListing() {
    const navLinks = document.querySelectorAll(".default-add-listing .multistep-wizard__nav .multistep-wizard__nav__btn");
    
    // Function to determine which section is currently in view
    function getCurrentSectionInView() {
        let currentSection = null;
        const sections = document.querySelectorAll(".default-add-listing .multistep-wizard__content .multistep-wizard__single");
        
        if(sections) {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 50 && rect.bottom >= 50) {
                    currentSection = section.getAttribute("id");
                }
            });
        }
        
        return currentSection;
    }

    // Function to update active class on navigation items
    function updateActiveNav() {
        const currentSection = getCurrentSectionInView();
        if ( currentSection == null) {
            navLinks[0].classList.add("active");
        } else {
            if(navLinks[0].classList.contains("active")){
                navLinks[0].classList.remove("active");
            }
            navLinks.forEach((link) => {
                if (link.getAttribute("href") === `#${currentSection}`) {
                    link.classList.add("active");
                } else {
                    link.classList.remove("active");
                }
            });
        }
        
    }

    // Function to scroll smoothly to the target section
    function smoothScroll(targetSection) {
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Initial update and update on scroll
    if(navLinks.length > 0) {
        updateActiveNav();
        window.addEventListener("scroll", updateActiveNav);
    }

    // Add smooth scroll to navigation links
    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute("href").substring(1);
            smoothScroll(targetSection);
        });
    });
}

// Add Listing Accordion
function addListingAccordion() {
    $('body').on('click', '.directorist-add-listing-form .directorist-content-module__title', function (e) {
        e.preventDefault();

        let windowScreen = window.innerWidth ;

        if(windowScreen <= 480) {
            $(this).toggleClass('opened');
            $(this).next('.directorist-content-module__contents').toggleClass('active');
        }
        
    })
}

addListingAccordion()


// Multistep Add Listing on Elementor EditMode 
$(window).on('elementor/frontend/init', function () {
    setTimeout(function() {
        if ($('body').hasClass('elementor-editor-active')) {
            multiStepWizard();
        }
    }, 3000);

});

$('body').on('click', function (e) {
    if ($('body').hasClass('elementor-editor-active')  && (e.target.nodeName !== 'A' && e.target.nodeName !== 'BUTTON')) {
        multiStepWizard();
    }
});


