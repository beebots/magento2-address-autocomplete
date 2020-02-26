<?php


namespace BeeBots\AddressAutocomplete\Block\Adminhtml\Order\Create;

use BeeBots\AddressAutocomplete\Model\BeeBotsConfig;
use Magento\Backend\Block\Template;
use Magento\Backend\Block\Template\Context;

/**
 * Class AddressAutocomplete
 *
 * @package BeeBots\AdminOrder\Block\Adminhtml\Order\Create
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
    public function __construct(
        BeeBotsConfig $beeBotsConfig,
        Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->beeBotsConfig = $beeBotsConfig;
    }

    /**
     * Function: getApiKey
     */
    public function getApiKey()
    {
        return $this->beeBotsConfig->getApiKey();
    }

    /**
     * Function: isAutocompleteEnabled
     *
     * @return mixed
     */
    public function isAutocompleteEnabled()
    {
        return $this->beeBotsConfig->isAutocompleteEnabled();
    }
}
