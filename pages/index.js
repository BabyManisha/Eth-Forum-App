import React, { Component } from 'react'
import chitti from '../ethereum/chitti';
import { Card, Button, Message, Form, Input, Progress, Image } from 'semantic-ui-react';
import Layout from '../components/Layout';
import { Router } from '../routes';
import web3 from '../ethereum/web3';
class Chitti extends Component{
    state = {
        topic: '',
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(){
        const topics = await chitti.methods.getTopic().call();
        console.log(topics)
        return { topics }
    }

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
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    renderNewTopic() {
        return (
            <Form onSubmit={this.createTopic} error={!!this.state.errorMessage}>
                <Form.Field>
                    <Input label={<Button disabled={this.state.loading} loading={this.state.loading} 
                        color='blue'>Create Topic</Button>}
                        labelPosition='right'
                        placeholder="Enter Topic Name!" 
                        required
                        onChange={event => this.setState({topic: event.target.value})}    
                    />
                </Form.Field>
                <Message error header="Oops!!" content={this.state.errorMessage} />
            </Form>
        )
    }

    changeRoute(i){
        event.preventDefault();
        Router.pushRoute(`/topic/${i}`);
    }

    renderTopics(){
        if(this.props.topics?.length){
            let tlen = this.props.topics.length-1;
            return (
                [...this.props.topics]?.reverse().map((t, i) => {
                    return(
                        <Card key={i} onClick={this.changeRoute.bind(this, tlen-i)}>
                            <Image src='https://previews.123rf.com/images/enterline/enterline1612/enterline161200522/66553750-the-word-topics-concept-and-theme-painted-in-watercolor-ink-on-a-white-paper-.jpg' wrapped ui={false} />
                            <Card.Content>
                                <Card.Header>{t[1]}</Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                Created by {t[0].substr(0,9)}
                            </Card.Content>
                        </Card>
                    )
                })
            )
        }
        return <Message info header="Okie! 🙆🏻‍♀️" content="No Topics!! Why don't you create one 👆" />
    }

    showProgressbar(){
        if(this.state.loading) {
            return (
                <Progress percent={100} size='tiny' indicating></Progress>
            )
        }else{
            return (
                <div className='progress-div-holder'></div>
            )
        }
    }
    
    render(){
        return (
            <div>
                {this.showProgressbar()}
                <Layout>
                    {this.renderNewTopic()}
                    <Card.Group itemsPerRow={2}>{this.renderTopics()}</Card.Group>
                </Layout>
            </div>
        )
    }
}

export default Chitti;
