import React from 'react';
import Document, {Head, Main, Html, NextScript, DocumentContext} from 'next/document';
import jssPresetDefault from 'jss-preset-default';
import {jss, SheetsRegistry, JssProvider} from 'react-jss';
import App from "next/app";

jss.setup(jssPresetDefault());

/**
 * Custom document
 * This only runs server-side (does not run after initial load)
 * Required for JSS (styles break on refresh without this)
 */

type CustomDocumentProps = {
    sheets: SheetsRegistry,
}

export default class JssDocument extends Document<CustomDocumentProps> {
    static async getInitialProps(ctx: DocumentContext) {
        const sheets = new SheetsRegistry();

        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () => originalRenderPage({
            enhanceApp: App => props => (
                <JssProvider registry={sheets}>
                    <App {...props} />
                </JssProvider>
            ),
        });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            sheets,
        };
    }

    render() {
        return (
            <Html lang={'en'}>
                <Head>
                    {/*
                        Do not add a title element here, though it is marked as a required child of Head.
                        The title should be set on the app component (_app.page.jsx) and individual pages only.
                        (see https://github.com/vercel/next.js/blob/master/errors/no-document-title.md)
                    */}
                    <meta charSet="utf-8" />
                    <style
                        id="server-side-styles"
                        dangerouslySetInnerHTML={{
                            __html: this.props.sheets.toString()
                        }}
                    />
                    <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
                    <script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}/>
                    <script src={'/intercom.js'}/>
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
