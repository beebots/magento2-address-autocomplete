define(['jquery', 'address-autocomplete-common', 'uiComponent'], function ($, addressAutocompleteCommon, Component) {

    'use strict';

    // let billingForm = {
    //     street1: '.payment-method.payment-method-subscribe_pro input[name="street[0]"]',
    //     street2: '.payment-method.payment-method-subscribe_pro input[name="street[1]"]',
    //     city: '.payment-method.payment-method-subscribe_pro input[name="city"]',
    //     country: '.payment-method.payment-method-subscribe_pro select[name="country_id"]',
    //     region: '.payment-method.payment-method-subscribe_pro select[name="region_id"]',
    //     postcode: '.payment-method.payment-method-subscribe_pro input[name="postcode"]',
    // };

    let shippingForm = {
        street1: '#shipping-new-address-form input[name="street[0]"]',
        street2: '#shipping-new-address-form input[name="street[1]"]',
        city: '#shipping-new-address-form input[name="city"]',
        country: '#shipping-new-address-form select[name="country_id"]',
        region: '#shipping-new-address-form select[name="region_id"]',
        postcode: '#shipping-new-address-form input[name="postcode"]',
    };

    return Component.extend({
        afterRender: function(){
            $.getScript(
                'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&libraries=places',
                this.init.bind(this)
            );
        },

        init: function () {
            // this.initBillingAddress();
            this.initShippingAddress();
        },

        initBillingAddress: function(){
            let billingAddressField = $(billingForm['street1']).get(0);
            addressAutocompleteCommon.initFieldAutocomplete(billingAddressField, this.fillBillingAddress.bind(this));
        },

        initShippingAddress: function(){
            let shippingAddressField = $(shippingForm['street1']).get(0);
            addressAutocompleteCommon.initFieldAutocomplete(shippingAddressField, this.fillShippingAddress.bind(this));
        },

        // fillBillingAddress: function (addressAutocomplete) {
        //     let addressBreakdown = addressAutocompleteCommon.getPlaceAddressBreakdown(addressAutocomplete);
        //     addressAutocompleteCommon.fillFields(billingForm, addressBreakdown);
        //     //if same billing/shipping checked, update shipping fields also
        //     if(this.useBillingForShipping()){
        //         addressAutocompleteCommon.fillFields(shippingForm, addressBreakdown);
        //     }
        // },

        fillShippingAddress: function (addressAutocomplete) {
            let addressBreakdown = addressAutocompleteCommon.getPlaceAddressBreakdown(addressAutocomplete);
            addressAutocompleteCommon.fillFields(shippingForm, addressBreakdown);
        },

        // useBillingForShipping: function(){
        //     return $jQuery('#order-shipping_same_as_billing').prop('checked');
        // }
    });
});