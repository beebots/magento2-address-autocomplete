define([
    'jquery',
    'address-autocomplete-common',
    'uiComponent'
], function ($, addressAutocompleteCommon, Component) {

    'use strict';

    return Component.extend({

        initCount: 0,

        defaults: {
            template: 'BeeBots_AddressAutocomplete/autocomplete',
            street1: '',
            street2: '',
            city: '',
            country: '',
            region: '',
            postcode: '',
        },

        afterRender: function () {
            $.getScript(
                'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&libraries=places',
                this.init.bind(this)
            );
        },

        init: function () {
            this.initAddressAutocomplete();
        },

        initAddressAutocomplete: function () {
            let addressField = $(this.street1).get(0);
            if(!addressField){
                this.initCount++;
                if(this.initCount < 5){
                    setTimeout(this.initAddressAutocomplete.bind(this), 250);
                } else {
                    // give up
                }
            } else {
                addressAutocompleteCommon.initFieldAutocomplete(addressField, this.fillAddress.bind(this));
            }
        },

        fillAddress: function (addressAutocomplete) {
            let addressBreakdown = addressAutocompleteCommon.getPlaceAddressBreakdown(addressAutocomplete, this.street1);
            addressAutocompleteCommon.fillFields({
                'street1': this.street1,
                'street2': this.street2,
                'city': this.city,
                'country': this.country,
                'region': this.region,
                'postcode': this.postcode,
            }, addressBreakdown);
        },
    });
});
