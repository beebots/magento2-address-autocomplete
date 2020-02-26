<?php


namespace BeeBots\AddressAutocomplete\Model;

use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * Class BeeBotsConfig
 *
 * @package BeeBots\AddressAutocomplete\Model
 */
class BeeBotsConfig
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
     * Function: getApiKey
     */
    public function getApiKey()
    {
        return $this->scopeConfig->getValue('beebots/address_autocomplete/google_maps_api_key');
    }

    /**
     * Function: isAutocompleteEnabled
     *
     * @return mixed
     */
    public function isAutocompleteEnabled()
    {
        return $this->scopeConfig->getValue('beebots/address_autocomplete/enabled');
    }
}
