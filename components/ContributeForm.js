
import React, { Component } from 'react';
import {Button, Form, Input, Message} from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';


class ContributeForm extends Component {

    state = {
        value: '',
        errorMessage: '',
        loading: false
    };

    onSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submittal behaviour

        // Any time we call a function, we use a try/catch to handle errors properly
        try {
            // set Button to loading spinner
            this.setState({ loading: true, errorMessage: '' });

            // Get accounts from Metamask
            const accounts = await web3.eth.getAccounts();
            // Get an instance of the campaign we want to contribute to
            // The address is passed in from the show component
            const campaign = Campaign(this.props.campaignAddress);
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });

            // Refresh the current campaign page
            // with replaceRoute instead of pushRoute, we avoid the situation where the user presses 'back'
            // and is taken to the same page.
            Router.replaceRoute(`/campaigns/${this.props.campaignAddress}`);

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        // set Button state to normal
        this.setState({ loading: false, value: '' });
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to contribute:</label>
                    <Input
                        label="ether"
                        labelPosition="right"
                        value={this.state.value}
                        onChange={event => this.setState({ value: event.target.value })}
                    />

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Contribute!</Button>
                </Form.Field>
            </Form>
        );
    }
}

export default ContributeForm;
