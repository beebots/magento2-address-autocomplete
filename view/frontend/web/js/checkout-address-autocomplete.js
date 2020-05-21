define([
    'jquery',
    'address-autocomplete-common',
    'uiComponent'
], function ($, addressAutocompleteCommon, Component) {

    'use strict';

    let shippingForm = {
        street1: '#shipping-new-address-form input[name="street[0]"]',
        street2: '#shipping-new-address-form input[name="street[1]"]',
        city: '#shipping-new-address-form input[name="city"]',
        country: '#shipping-new-address-form select[name="country_id"]',
        region: '#shipping-new-address-form select[name="region_id"]',
        postcode: '#shipping-new-address-form input[name="postcode"]',
    };

    return Component.extend({

        initCount: 0,

        afterRender: function () {
            $.getScript(
                'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&libraries=places',
                this.init.bind(this)
            );
        },

        init: function () {
            this.initShippingAddress();
        },

        initShippingAddress: function () {
            let shippingAddressField = $(shippingForm['street1']).get(0);
            if(!shippingAddressField){
                this.initCount++;
                if(this.initCount < 5){
                    setTimeout(this.initShippingAddress.bind(this), 250);
                } else {
                    // give up
                }
            } else {
                addressAutocompleteCommon.initFieldAutocomplete(shippingAddressField, this.fillShippingAddress.bind(this));
            }
        },

        fillShippingAddress: function (addressAutocomplete) {
            let addressBreakdown = addressAutocompleteCommon.getPlaceAddressBreakdown(addressAutocomplete, shippingForm.street1);
            addressAutocompleteCommon.fillFields(shippingForm, addressBreakdown);
        },
    });
});
