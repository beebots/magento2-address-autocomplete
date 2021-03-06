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
            let streetShortName = '';
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
                    streetShortName = place.address_components[i]['short_name'];
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

            // Ignore the returned subpremise and street number. They are not reliable for new addresses.
            // Attempt to append what was in front of the street name in their selected option back in front of the returned street.
            let fullChosenLocationString = $(streetSelector).val();

            // If we found the street, then split on it and append what was there to the front
            if (fullChosenLocationString.indexOf(street) !== -1) {
                let originalCharactersBeforeStreet = fullChosenLocationString.split(street, 1);
                addressFieldBreakdown.street1 = String(originalCharactersBeforeStreet[0]) + street;
            }  else if (fullChosenLocationString.indexOf(streetShortName) !== -1) {
                // Try using the streetShortName instead
                let originalCharactersBeforeStreet = fullChosenLocationString.split(streetShortName, 1);
                addressFieldBreakdown.street1 = String(originalCharactersBeforeStreet[0]) + street;
            } else {
                // Fallback to the original logic using the sub-premise and the street number that were returned from google
                let concatendatedStreetAddress = streetNumberSubpremise + streetNumber + ' ' + street;
                addressFieldBreakdown.street1 = concatendatedStreetAddress.trim();
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
                $(addressField).keydown(function(e){
                    // https://stackoverflow.com/questions/11388251/google-autocomplete-enter-to-select
                    if (e.keyCode === 13 && $('.pac-container:visible').length) {
                        e.preventDefault();
                    }
                });
                if (addressField && !addressField.dataset.autocomplete_initialized && google) {
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
