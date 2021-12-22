import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Button, Grid, Icon, Form, Input, Message, Feed, Progress } from 'semantic-ui-react';
import chitti from '../../ethereum/chitti';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
export default class TopicShow extends Component {
    state = {
        chit: '',
        replyPostIndex: -1,
        editPostIndex: -1,
        errorMessage: '',
        loading: false
    };

    static async getInitialProps(props) {
        const chits = await chitti.methods.getChits(props.query.topicID).call();

        const topic = await chitti.methods.topics(props.query.topicID).call();

        return {
            topicID: props.query.topicID,
            topic: topic,
            chits: chits
        }
    }

    createChit = async() => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        try{
            const accounts = await web3.eth.getAccounts();
            if(this.state.replyPostIndex > -1){
                await chitti.methods.newChitReply(this.props.topicID, this.state.chit, this.state.replyPostIndex)
                .send({
                    from: accounts[0]
                });
            }else if(this.state.editPostIndex > -1){
                await chitti.methods.updateChit(this.props.topicID, this.state.editPostIndex, this.state.chit)
                .send({
                    from: accounts[0]
                });
            }else{
                await chitti.methods.newChit(this.props.topicID, this.state.chit)
                .send({
                    from: accounts[0]
                });
            }
            this.setState({replyPostIndex: -1, chit: '', editPostIndex: -1});
            Router.pushRoute(`/topic/${this.props.topicID}`);
        }catch (err) {
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    renderNewPost() {
        return (
            <Form onSubmit={this.createChit}>
                <Form.Field>
                    <Input label={<Button 
                        color='blue'>Post</Button>}
                        labelPosition='right'
                        placeholder="Enter Something!" 
                        required
                        value={this.state.chit}
                        onChange={event => this.setState({chit: event.target.value})}    
                    />
                </Form.Field>
            </Form>
        )
    }

    postReaction = async(data) => {
        event.preventDefault();
        this.setState({loading: true, errorMessage: ''});
        try{
            const accounts = await web3.eth.getAccounts();
            await chitti.methods.reactOnChit(this.props.topicID, data[0], data[1])
                .send({
                    from: accounts[0]
                });
            Router.pushRoute(`/topic/${this.props.topicID}`);
        }catch (err) {
            console.log(err)
            this.setState({errorMessage: err.message});
        }
        this.setState({loading: false});
    }

    getUTCTime(date){
        return new Date(date*1000).toUTCString();
    }

    isReply(index){
        if(index > -1){
            return (
                <sup className='reply-span'>
                    <Icon name='retweet' color='brown'/>
                    Reply for "{this.props.chits[index]?.message.substr(0,54)}..."
                </sup>
            )
        }
        return ''
    }

    replyPost(index){
        this.setState({editPostIndex: -1})
        if(index == this.state.replyPostIndex){
            this.setState({replyPostIndex: -1})
        }else{
            this.setState({replyPostIndex: index})
        }
    }

    editPost(index){
        this.setState({replyPostIndex: -1})
        if(index == this.state.editPostIndex){
            this.setState({editPostIndex: -1})
        }else{
            this.setState({editPostIndex: index})
        }
    }

    renderChits(){
        let clen = this.props.chits?.length-1;
        if(this.props.chits?.length) {
            return (
                [...this.props.chits].reverse().map((c, i) => {
                    return(
                        <Feed.Event key={`c-${i}`} className='feed-div'>
                            <Feed.Label>
                                <img src={`https://react.semantic-ui.com/images/avatar/small/elliot.jpg?${c.author}`} />
                            </Feed.Label>
                            <Feed.Content>
                                {this.isReply(c.reply_index)}
                                <Feed.Summary>
                                    <Feed.User>{c.author.substr(3,9)}</Feed.User> 
                                    <Feed.Date>{this.getUTCTime(c.created)}</Feed.Date>
                                </Feed.Summary>
                                <Feed.Extra text className='feed-text-large'>
                                    {c.message}
                                </Feed.Extra>
                                <Feed.Meta className='feed-meta-large'>
                                    <Grid columns='equal'>
                                        <Grid.Column>
                                            <Feed.Like>
                                                <span onClick={this.replyPost.bind(this, clen-i)}>
                                                    <Icon name='chat' color='teal' />
                                                    Reply
                                                </span>
                                            </Feed.Like>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Feed.Like>
                                                <span onClick={this.postReaction.bind(this, [clen-i, 1])}>
                                                    <Icon name='like' color='blue' />
                                                    {c.likes_count} Likes
                                                </span>
                                            </Feed.Like>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Feed.Like>
                                                <span onClick={this.postReaction.bind(this, [clen-i, 2])}>
                                                    <Icon name='thumbs down' color='black' />
                                                    {c.dislikes_count} Dislikes
                                                </span>
                                            </Feed.Like>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Feed.Like>
                                                <span onClick={this.editPost.bind(this, clen-i)}>
                                                    <Icon name='edit' color='grey' />
                                                    Edit
                                                </span>
                                            </Feed.Like>
                                        </Grid.Column>
                                    </Grid>
                                </Feed.Meta>
                                {(this.state.replyPostIndex == clen-i || this.state.editPostIndex == clen-i) > 0 ? this.renderNewPost() : ''}
                            </Feed.Content>
                        </Feed.Event>
                    )
                })
            )
        }
        return <Message info header="Okie! 🙆🏻‍♀️" content="No Posts!! Why don't you create one 👆" />
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

    showErrorMsg(){
        if(this.state.errorMessage) {
            return (
                <Message error header="Oops!!" content={this.state.errorMessage} />
            )
        }
    }

    render() {
        return (
            <div>
                {this.showProgressbar()}
                <Layout>
                    <h2>Posts of Topic "{this.props.topic.topic}"</h2>
                    {this.renderNewPost()}
                    {this.showErrorMsg()}
                    <Feed size='large'>
                        {this.renderChits()}
                    </Feed>
                </Layout>
            </div>
        )
    }
}
