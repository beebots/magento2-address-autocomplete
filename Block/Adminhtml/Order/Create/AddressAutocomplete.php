<?php


namespace BeeBots\AddressAutocomplete\Block\Adminhtml\Order\Create;

use Magento\Backend\Block\Template;
use Magento\Backend\Block\Template\Context;
use Magento\Framework\App\Config\ScopeConfigInterface;

/**
 * Class AddressAutocomplete
 *
 * @package BeeBots\AdminOrder\Block\Adminhtml\Order\Create
 */
class AddressAutocomplete extends Template
{
    /** @var ScopeConfigInterface */
    private $scopeConfig;

    /**
     * AddressAutocomplete constructor.
     *
     * @param ScopeConfigInterface $scopeConfig
     * @param Context $context
     * @param array $data
     */
    public function __construct(
        ScopeConfigInterface $scopeConfig,
        Context $context,
        array $data = []
    ) {
        $this->scopeConfig = $scopeConfig;
        parent::__construct($context, $data);
    }

    /**
     * Function: getApiKey
     */
    public function getApiKey()
    {
        return $this->scopeConfig->getValue('beebots/address_autocomplete/google_maps_api_key');
    }
}
