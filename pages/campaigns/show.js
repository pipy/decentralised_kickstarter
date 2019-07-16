
import React, { Component } from 'react';
import Layout from '../../components/layout';
import Campaign from '../../ethereum/campaign';
import { Grid, Card, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';


class CampaignShow extends Component {

    // This will get executed before the component is rendered
    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);

        // Get details from the campaign instance
        const summary = await campaign.methods.getSummary().call();

        console.log(summary); // DEBUG ********

        return {
            campaignAddress: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestsCount: summary[2],
            approversCount: summary[3],
            managerAddress: summary[4]
        };
    }

    renderCards() {
        const {
            balance,
            managerAddress,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: managerAddress,
                meta: 'Address of the campaign manager',
                description: 'The campaign manager is the creator of the campaign, ' +
                    'and can create requests on it to withdraw money, for approval by contributors',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description:
                    'Amount in Wei that must be contributed to become an approver'
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description:
                    'Requests to withdraw money from the contract. Requests require majority approval(by the approvers)'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description:
                    'Number of people who have contributed the minimum contribution or more'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description:
                    'The amount of money available to this campaign, to be withdrawn by Requests.'
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <h3>Campaign Details</h3>

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={10}>
                            {this.renderCards()}
                        </Grid.Column>

                        <Grid.Column width={6}>
                            <ContributeForm campaignAddress={this.props.campaignAddress} />
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column>
                            <Link route={`/campaigns/${this.props.campaignAddress}/requests`}>
                                <a>
                                    <Button primary>
                                        View Requests
                                    </Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>

                </Grid>
            </Layout>
        );
    }
}

export default CampaignShow;
