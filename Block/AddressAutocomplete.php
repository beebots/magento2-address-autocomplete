<?php


namespace BeeBots\AddressAutocomplete\Block;

use BeeBots\AddressAutocomplete\Model\BeeBotsConfig;
use Magento\Framework\View\Element\Template;
use Magento\Framework\View\Element\Template\Context;

/**
 * Class AddressAutocomplete
 *
 * @package BeeBots\AddressAutocomplete\Block
 */
class AddressAutocomplete extends Template
{
    /** @var BeeBotsConfig */
    private $beeBotsConfig;

    /**
     * AddressAutocomplete constructor.
     *
     * @param BeeBotsConfig $beeBotsConfig
     * @param Context $context
     * @param array $data
     */
    public function __construct(BeeBotsConfig $beeBotsConfig, Context $context, array $data = [])
    {
        $this->beeBotsConfig = $beeBotsConfig;
        parent::__construct($context, $data);
    }

    public function getJsLayout()
    {
        $this->jsLayout['components']['address-autocomplete']['config']['apiKey'] = $this->beeBotsConfig->getApiKey();
        return parent::getJsLayout();
    }
}
