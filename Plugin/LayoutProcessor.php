<?php

namespace BeeBots\AddressAutocomplete\Plugin;

use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * Class LayoutProcessor
 *
 * @package BeeBots\AddressAutocomplete\Plugin
 */
class LayoutProcessor
{
    /** @var ScopeConfigInterface */
    private $scopeConfig;

    /**
     * LayoutProcessor constructor.
     *
     * @param ScopeConfigInterface $scopeConfig
     */
    public function __construct(ScopeConfigInterface $scopeConfig)
    {
        $this->scopeConfig = $scopeConfig;
    }

    /**
     * Function: afterProcess
     *
     * @param \Magento\Checkout\Block\Checkout\LayoutProcessor $subject
     * @param array $jsLayout
     *
     * @return array
     */
    public function afterProcess(
        \Magento\Checkout\Block\Checkout\LayoutProcessor $subject,
        array $jsLayout
    ) {
        // Set the Google Places API Key for shipping address
        $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
            ['children']['shippingAddress']['children']['shippingAdditional']
            ['children']['addressAutocomplete']['config'] = [
                'apiKey' => $this->getApiKey()
            ];

//        $jsLayout['components']['checkout']['children']['steps']['children']['billing-step']
//        ['children']['payment']['children']['afterMethods']
//        ['children']['addressAutocomplete']['config'] = [
//            'apiKey' => $this->getApiKey()
//        ];

        return $jsLayout;
    }

    /**
     * Function: getApiKey
     */
    private function getApiKey()
    {
        return $this->scopeConfig->getValue('beebots/address_autocomplete/google_maps_api_key');
    }
}
