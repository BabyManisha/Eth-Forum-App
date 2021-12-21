import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Form, Input, Message } from 'semantic-ui-react';
import chitti from '../../ethereum/chitti';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

export default class TopicNew extends Component {
    state = {
        topic: '',
        errorMessage: '',
        loading: false
    };

    createTopic = async() => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        try{
            const accounts = await web3.eth.getAccounts();
            await chitti.methods.newTopic(this.state.topic)
                .send({
                    from: accounts[0]
                });
            Router.pushRoute('/');
        }catch (err) {
            this.setState({errorMessage: err});
        }
        this.setState({loading: false});
    }

    render() {
        return (
            <Layout>
                <h1>New Topic!</h1>

                <Form onSubmit={this.createTopic} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Topic Name</label>
                        <Input label="Topic!"
                            labelPosition='right'
                            placeholder="Enter Topic Details" 
                            onChange={event => this.setState({topic: event.target.value})}    
                        />
                    </Form.Field>

                    <Message error header="Oops!!" content={this.state.errorMessage} />

                    <Button disabled={this.state.loading} loading={this.state.loading} color="blue">Create Topic</Button>
                </Form>
            </Layout>
        )
    }
}
