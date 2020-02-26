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
    private $beebotsConfig;

    /**
     * AddressAutocomplete constructor.
     *
     * @param BeeBotsConfig $beebotsConfig
     * @param Context $context
     * @param array $data
     */
    public function __construct(
        BeeBotsConfig $beebotsConfig,
        Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
        $this->beebotsConfig = $beebotsConfig;
    }

    /**
     * Function: getApiKey
     */
    public function getApiKey()
    {
        return $this->beebotsConfig->getApiKey();
    }

    /**
     * Function: isAutocompleteEnabled
     *
     * @return mixed
     */
    public function isAutocompleteEnabled()
    {
        return $this->beebotsConfig->isAutocompleteEnabled();
    }
}
