import React, { Component } from 'react'
import { Router } from '../routes';
import { Form, Input, Message, Button } from 'semantic-ui-react'
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

export default class ContributeForm extends Component {
    state = {
        amount: 0,
        loading: false,
        errorMessage: ''
    };

    submitForm = async () => {
        event.preventDefault();
        const campaign = await Campaign(this.props.address)

        this.setState({loading: true, errorMessage: ''});

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.amount, 'ether')
            });

            this.setState({amount: 0, errorMessage: '', loading: false});
            Router.replaceRoute(`/campaign/${this.props.address}`);

        } catch (error) {
            this.setState({errorMessage: error.message, loading: false});
        }
    }

    render() {
        return (
            <Form onSubmit={this.submitForm} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Contribute to the Campaign ⛺️</label>
                    <Input label="Ether!" 
                        labelPosition="right"
                        placeholder="💰"
                        value={this.state.amount}
                        onChange={event => this.setState({amount: event.target.value})} />
                </Form.Field>

                <Message error header="Oops! 🙊" content={this.state.errorMessage} />

                <Button disabled={this.state.loading} loading={this.state.loading} color="blue">Contribute!</Button>
            </Form>
        )
    }
}
