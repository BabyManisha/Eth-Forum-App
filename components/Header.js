import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react'
import { Router } from '../routes';

export default class Header extends Component {
    state = {
        activeItem: 'topics',
    };

    handleItemClick = (e, {name}) => {
        this.setState({ activeItem: name });
        let routerMappings = {
            'topics': '/',
            'latest': '/latest',
            'trending': '/trending'
        }
        Router.pushRoute(`${routerMappings[name]}`);
    }

    render(){
        const { activeItem } = this.state
        return (
            <Menu vertical pointing inverted>
                <Menu.Item
                    name='topics'
                    active={activeItem === 'topics'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='latest'
                    active={activeItem === 'latest'}
                    onClick={this.handleItemClick}
                />
                <Menu.Item
                    name='trending'
                    active={activeItem === 'trending'}
                    onClick={this.handleItemClick}
                />
            </Menu>
        )
    }
}
