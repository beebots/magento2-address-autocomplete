define([
        'jquery',
        'address-autocomplete-common',
        'order-reload-helper',
        'Magento_Sales/order/create/form'
    ],
    function ($, addressAutocompleteCommon, orderReloadHelper) {
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

        return {
            init: function () {
                this._initBillingAddress();
                this._initShippingAddress();
                this._initShippingReload();
                orderReloadHelper.onReloadAreas('beeAutocompleteShipping', this._initShippingAddress.bind(this));
                orderReloadHelper.onReloadAreas('beeAutocompleteShippingReload', this._initShippingReload.bind(this));
                orderReloadHelper.onReloadAreas('beeAutocompleteBilling', this._initBillingAddress.bind(this));
            },

            _initBillingAddress: function () {
                let billingAddressField = $(billingForm['street1']).get(0);
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

            _initShippingAddress: function () {
                let shippingAddressField = $(shippingForm['street1']).get(0);
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

            _initShippingReload: function(){
                orderReloadHelper.initAreaReloadCallback('beeAutocompleteInit', 'order-shipping_address', this._initShippingAddress.bind(this));
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
                return $('#order-shipping_same_as_billing').prop('checked');
            }
        }
    }
);
