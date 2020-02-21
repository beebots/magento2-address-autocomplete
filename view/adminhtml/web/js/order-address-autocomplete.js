define([
        'jquery',
        'address-autocomplete-common',
        'Magento_Sales/order/create/form',
        'prototype'
    ],
    function ($jQuery, addressAutocompleteCommon) {
        'use strict';

        let billingForm = {
            street1: '#order-billing_address_street0',
            street2: '#order-billing_address_street1',
            city: '#order-billing_address_city',
            country: '#order-billing_address_country_id',
            region: '#order-billing_address_region_id',
            postcode: '#order-billing_address_postcode',
        };

        let shippingForm = {
            street1: '#order-shipping_address_street0',
            street2: '#order-shipping_address_street1',
            city: '#order-shipping_address_city',
            country: '#order-shipping_address_country_id',
            region: '#order-shipping_address_region_id',
            postcode: '#order-shipping_address_postcode',
        };

        function initReloadCallback(areaId, callback) {
            let previousCallbackName = $(areaId).callback;
            let previousCallbackFunction = function () {
            };
            if (previousCallbackName) {
                previousCallbackFunction = window.order[previousCallbackName];
            }
            let callbackName = 'beebots' + areaId + 'Callback';
            $(areaId).callback = callbackName;
            window.order[callbackName] = function () {
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

            initBillingAddress: function () {
                let billingAddressField = $jQuery(billingForm['street1']).get(0);
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

            initShippingAddress: function () {
                let shippingAddressField = $jQuery(shippingForm['street1']).get(0);
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
                let addressBreakdown = addressAutocompleteCommon.getPlaceAddressBreakdown(addressAutocomplete);
                addressAutocompleteCommon.fillFields(billingForm, addressBreakdown);
                //if same billing/shipping checked, update shipping fields also
                if (this.useBillingForShipping()) {
                    addressAutocompleteCommon.fillFields(shippingForm, addressBreakdown);
                }
            },

            fillShippingAddress: function (addressAutocomplete) {
                let addressBreakdown = addressAutocompleteCommon.getPlaceAddressBreakdown(addressAutocomplete);
                addressAutocompleteCommon.fillFields(shippingForm, addressBreakdown);
            },

            useBillingForShipping: function () {
                return $jQuery('#order-shipping_same_as_billing').prop('checked');
            }
        }
    }
);