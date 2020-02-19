define(['jquery'], function ($) {

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
        $.each(fields, function(key, fieldId){
            if(key === 'region'){
                $('#' + fieldId + ' option:contains(' + addressBreakdown[key] + ')').attr('selected', 'selected');
            } else {
                $('#' + fieldId).val(addressBreakdown[key]);
            }

        });
    }

    return {
        init: function () {
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

        fillBillingAddress: function (billingAutocomplete) {
            let addressBreakdown = getPlaceAddressBreakdown(billingAutocomplete);
            fillFields(billingForm, addressBreakdown);
        },


    }
});