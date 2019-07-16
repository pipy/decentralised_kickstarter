
import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const deployedFactoryAddress = '';  // Provide the address of the deployed CampaignFactory


// Export an instance of the CampaignFactory contract
const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    deployedFactoryAddress
);

export default instance;

