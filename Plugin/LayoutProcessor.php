<?php

namespace BeeBots\AddressAutocomplete\Plugin;

use BeeBots\AddressAutocomplete\Model\BeeBotsConfig;

/**
 * Class LayoutProcessor
 *
 * @package BeeBots\AddressAutocomplete\Plugin
 */
class LayoutProcessor
{
    /** @var BeeBotsConfig */
    private $beeBotsConfig;

    /**
     * LayoutProcessor constructor.
     *
     * @param BeeBotsConfig $beeBotsConfig
     */
    public function __construct(BeeBotsConfig $beeBotsConfig)
    {
        $this->beeBotsConfig = $beeBotsConfig;
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

        if (! $this->beeBotsConfig->isAutocompleteEnabled()) {
            unset(
                $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
                ['children']['shippingAddress']['children']['shippingAdditional']
                ['children']['addressAutocomplete']
            );
            return $jsLayout;
        }

        // Set the Google Places API Key for shipping address
        $jsLayout['components']['checkout']['children']['steps']['children']['shipping-step']
        ['children']['shippingAddress']['children']['shippingAdditional']
        ['children']['addressAutocomplete']['config'] = [
            'apiKey' => $this->beeBotsConfig->getApiKey(),
        ];

        return $jsLayout;
    }
}
