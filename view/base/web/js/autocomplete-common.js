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

    function findOptionElementByText(optionElements, optionTextToFind){
        let filteredOptionElements = optionElements.filter(function(optionElement){
            return optionElement.text.trim() === optionTextToFind;
        });
        return filteredOptionElements[0];
    }

    return {
        getPlaceAddressBreakdown: function (autocomplete, streetSelector) {
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

            // Ignore the subpremise and street number. Just append what was in front of the street name before back in front
            let fullChosenLocationString = $(streetSelector).val();
            let originalCharactersBeforeStreet = fullChosenLocationString.split(street, 1);
            if (originalCharactersBeforeStreet.length > 0) {
                addressFieldBreakdown.street1 = String(originalCharactersBeforeStreet[0]) + street;
            }

            return addressFieldBreakdown;
        },

        fillFields: function (fields, addressBreakdown) {
            $.each(fields, function (key, fieldSelector) {
                if (key === 'region') {
                    let regionOptionElements = $(fieldSelector + ' option').get();
                    let optionToSelect = findOptionElementByText(regionOptionElements, addressBreakdown[key]);
                    if (optionToSelect) {
                        $(optionToSelect).attr('selected', 'selected');
                    }
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
