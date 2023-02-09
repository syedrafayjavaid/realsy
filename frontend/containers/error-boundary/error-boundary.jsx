import React, {Component} from 'react';
import {LogglyLogger} from "api/logger";
import MainLayout from "layout/main-layout";
import Dimensions from "styles/dimensions";

export class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        LogglyLogger.push({ error, info });
    }

    render() {
        if (this.state.hasError) {
            return <MainLayout>
                <div style={{paddingTop: 20, paddingLeft: Dimensions.defaultPageMargin}}>
                    <h1>Whoops</h1>
                    <p>Something unexpected went wrong...</p>
                </div>
            </MainLayout>;
        }
        else {
            return this.props.children;
        }
    }
}
