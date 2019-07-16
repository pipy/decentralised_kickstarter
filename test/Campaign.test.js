const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

// create web3 actual instance
const web3 = new Web3(ganache.provider());

// get both contracts
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts; // eth accounts on the network
let factory; // deployed instance of the factory
let campaignAddress;
let campaign;

// before each following test do:
beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000' });

    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    // fancy 2016 way of doing the below
    // const addresses = await factory.methods.getDeployedCampaigns().call();
    // campaignAddress = addresses[0];
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );

});

// Tests
describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks a caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            from: accounts[1],
            value: 200
        });

        // Calling auto-generated approvers function
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: 90,
                from: accounts[1]
            });
            // force a fail
            assert(false);
        } catch(err) {
            // force a pass
            assert(err);
        }
    });

    it('allows a manager to make a payment request', async () => {
        await campaign.methods.createRequest(
            "Buy some batteries",
            99999,
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        const request = await campaign.methods.requests(0).call();

        assert.equal('Buy some batteries', request.description);
    })

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest(
            "Buy some batteries",
            web3.utils.toWei('5', 'ether'),
            accounts[1]
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.finaliseRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        // Check that the campaign paid out the request
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);
        // DEBUG
        assert(balance > 104);
    });
});