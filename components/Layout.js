import React from 'react'
import { Container, Grid} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Header from './Header';

const Layout = props => {
    return (
        <Container>
            <Grid>
                <Grid.Column width={4}>
                    <Header/>
                </Grid.Column>
                <Grid.Column width={8}>
                    {props.children}
                </Grid.Column>
            </Grid>
        </Container>
    )
}
export default Layout;
