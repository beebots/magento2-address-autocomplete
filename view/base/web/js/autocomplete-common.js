define(['jquery'], function ($) {
    'use strict';

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

    function getValueFromAddressComponent(addressComponent, addressType) {
        // addressComponent has short_name and long_name keys from which we can get values
        // the componentForm object is used to specify which key to use for the value from the addressComponent
        return addressComponent[componentForm[addressType]];
    }

    function callCallbackWithAutocomplete(callback, autocomplete){
        callback(autocomplete);
    }

    return {
        getPlaceAddressBreakdown: function (autocomplete) {
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
        },

        fillFields: function (fields, addressBreakdown) {
            $.each(fields, function (key, fieldSelector) {
                if (key === 'region') {
                    $(fieldSelector + ' option:contains(' + addressBreakdown[key] + ')').attr('selected', 'selected');
                } else {
                    $(fieldSelector).val(addressBreakdown[key]);
                }
                $(fieldSelector).trigger('change');
            });
        },

        initFieldAutocomplete: function (addressField, callback) {
            try {
                if (addressField && !addressField.dataset.autocomplete_initialized) {
                    let addressAutocomplete = new google.maps.places.Autocomplete(addressField, {
                            componentRestrictions: {
                                country: ['us'],
                            },
                            fields: ['address_component'],
                            types: ['address']
                        }
                    );
                    addressAutocomplete.addListener('place_changed', callCallbackWithAutocomplete.bind(this, callback, addressAutocomplete));
                    addressField.dataset.autocomplete_initialized = 'true';
                }
            } catch (error) {
                // suppress exceptions in initializing address autocomplete
            }
        }
    }

});