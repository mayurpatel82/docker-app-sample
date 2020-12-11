import * as React from 'react';
import { Container} from 'reactstrap';
import Navbar from './NavBar';
import "./style.css";

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <Container style={{ marginTop: "7em" }}>
            {props.children}
        </Container>
    </React.Fragment>
);
