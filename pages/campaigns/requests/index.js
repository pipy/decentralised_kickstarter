
import React, { Component } from 'react';
import { Button, Table } from 'semantic-ui-react';
import { Link } from '../../../routes';
import Layout from '../../../components/layout';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {

    static async getInitialProps(props) {
        const { address } = props.query;

        // Instance of the relevant campaign
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.numberOfApprovers().call();

        const requests = await Promise.all(
              Array(parseInt(requestCount)).fill().map((element, index) => {
                  return campaign.methods.requests(index).call()
              })
        );

        return { address, requestCount, requests, approversCount };
    }

    renderRequestRows() {
        // React always wants us to pass in a key whenever we are returning a list of components *********
        return this.props.requests.map((request, index) => {
            return <RequestRow
                    key={index}
                    id={index}
                    request={request}
                    address={this.props.address}
                    approversCount={this.props.approversCount}
            />;
        });
    }

    render() {

        const { Header, Row, HeaderCell, Body } = Table;

        return (
            <Layout>
                <h3>Requests</h3>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="right" style={{ marginBottom: 10 }}>Create Request</Button>
                    </a>
                </Link>

                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalise</HeaderCell>
                        </Row>
                    </Header>

                    <Body>
                        {this.renderRequestRows()}
                    </Body>
                </Table>

                <div>
                    Found {this.props.requestCount} requests
                </div>

            </Layout>
        );
    }
}

export default RequestIndex;