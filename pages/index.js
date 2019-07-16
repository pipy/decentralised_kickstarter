import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/layout';
import { Link } from '../routes';

class CampaignIndex extends Component {

    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedCampaigns().call();

        return { campaigns }; // ES 2015 syntax magic ;)
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Live Campaigns</h3>

                    <Link route="/campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content="Create campaign"
                                icon="add"
                                primary
                            />
                        </a>
                    </Link>

                    {this.renderCampaigns()}
                </div>
            </Layout>
        );
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

}

// Next.js expects that you export a Component(or whatever)
// From any page in pages
export default CampaignIndex;

