define(['jquery', 'prototype'], function ($jQuery) {

    let componentForm = {
        subpremise: 'short_name',
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'long_name',
        country: 'short_name',
        postal_code: 'short_name',
        postal_code_suffix: 'short_name',
        postal_town: 'short_name',
        sublocality_level_1: 'short_name'
    };

    let billingForm = {
        street1: 'order-billing_address_street0',
        street2: 'order-billing_address_street1',
        city: 'order-billing_address_city',
        country: 'order-billing_address_country_id',
        region: 'order-billing_address_region_id',
        postcode: 'order-billing_address_postcode',
    };

    let shippingForm = {
        street1: 'order-shipping_address_street0',
        street2: 'order-shipping_address_street1',
        city: 'order-shipping_address_city',
        country: 'order-shipping_address_country_id',
        region: 'order-shipping_address_region_id',
        postcode: 'order-shipping_address_postcode',
    };

    function getValueFromAddressComponent(addressComponent, addressType){
        // addressComponent has short_name and long_name keys from which we can get values
        // the componentForm object is used to specify which key to use for the value from the addressComponent
        return addressComponent[componentForm[addressType]];
    }

    function getPlaceAddressBreakdown(autocomplete){
        let addressFieldBreakdown = {
            street1: '',
            street2: '',
            city: '',
            region: '',
            country: '',
            postcode: '',
            postcodeSuffix: '',
        };
        let streetNumberSubpremise = '';
        let streetNumber = '';
        let street = '';

        let place = autocomplete.getPlace();

        for (var i = 0; i < place.address_components.length; i++) {
            let addressType = place.address_components[i].types[0];
            let value = getValueFromAddressComponent(place.address_components[i], addressType);
            if (addressType === 'subpremise') {
                streetNumberSubpremise = value + '/';
            } else if (addressType === 'street_number') {
                streetNumber = value;
            } else if (addressType === 'route') {
                street = value;
            } else if (addressType === 'administrative_area_level_1') {
                addressFieldBreakdown.region = value;
            } else if (addressType === 'sublocality_level_1') {
                addressFieldBreakdown.city = value;
            } else if (addressType === 'postal_town') {
                addressFieldBreakdown.city = value;
            } else if (addressType === 'locality' && addressFieldBreakdown.city === '') {
                addressFieldBreakdown.city = value;
            } else if (addressType === 'postal_code') {
                addressFieldBreakdown.postcode = value;
            } else if (addressType === 'postal_code_suffix') {
                addressFieldBreakdown.postcodeSuffix = '-' + value;
            } else if (addressType === 'country') {
                addressFieldBreakdown.country = value;
            }
        }

        addressFieldBreakdown.street1 = streetNumberSubpremise + streetNumber + ' ' + street;
        return addressFieldBreakdown;
    }

    function fillFields(fields, addressBreakdown){
        $jQuery.each(fields, function(key, fieldId){
            if(key === 'region'){
                $jQuery('#' + fieldId + ' option:contains(' + addressBreakdown[key] + ')').attr('selected', 'selected');
            } else {
                $jQuery('#' + fieldId).val(addressBreakdown[key]);
            }

        });
    }

    function initReloadCallback(areaId, callback){
        let previousCallbackName = $(areaId).callback;
        let previousCallbackFunction = function(){};
        if(previousCallbackName){
            previousCallbackFunction = window.order[previousCallbackName];
        }
        let callbackName = 'beebots' + areaId + 'Callback';
        $(areaId).callback = callbackName;
        window.order[callbackName] = function(){
            previousCallbackFunction();
            callback();
        }.bind(this);
    }

    return {
        init: function () {
            this.initBillingAddress();
            this.initShippingAddress();
            initReloadCallback('order-shipping_address', this.initShippingAddress.bind(this));
        },

        initBillingAddress: function(){
            let billingAddressField = document.getElementById('order-billing_address_street0');
            if (billingAddressField) {
                let billingAutocomplete = new google.maps.places.Autocomplete(billingAddressField, {
                        componentRestrictions: {
                            country: ['us'],
                        },
                        fields: ['address_component'],
                        types: ['address']
                    }
                );
                billingAutocomplete.addListener('place_changed', this.fillBillingAddress.bind(this, billingAutocomplete));
            }
        },

        initShippingAddress: function(){
            let shippingAddressField = document.getElementById('order-shipping_address_street0');
            if (shippingAddressField && !shippingAddressField.dataset.autocomplete_initialized) {
                let shippingAutocomplete = new google.maps.places.Autocomplete(shippingAddressField, {
                        componentRestrictions: {
                            country: ['us'],
                        },
                        fields: ['address_component'],
                        types: ['address']
                    }
                );
                shippingAutocomplete.addListener('place_changed', this.fillShippingAddress.bind(this, shippingAutocomplete));
                shippingAddressField.dataset.autocomplete_initialized = 'true';
            }
        },

        fillBillingAddress: function (addressAutocomplete) {
            let addressBreakdown = getPlaceAddressBreakdown(addressAutocomplete);
            fillFields(billingForm, addressBreakdown);
            //if same billing/shipping checked, update shipping fields also
            if(this.useBillingForShipping()){
                fillFields(shippingForm, addressBreakdown);
            }
        },

        fillShippingAddress: function (addressAutocomplete) {
            let addressBreakdown = getPlaceAddressBreakdown(addressAutocomplete);
            fillFields(shippingForm, addressBreakdown);
        },

        useBillingForShipping: function(){
            return $jQuery('#order-shipping_same_as_billing').prop('checked');
        }
    }
});