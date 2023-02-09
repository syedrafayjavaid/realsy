import React from 'react';
import Link from 'next/link';
import RealsyLogo from "components/icons/realsy-logo";
import {ChatLauncher} from "components/chat-launcher";
import {arrayOf, shape, string} from "prop-types";
import {useMainFooterStyles} from 'layout/main-layout/main-footer/main-footer.styles';

/**
 * The main footer
 */
const MainFooter = props => {
    const styleClasses = useMainFooterStyles();

    return (
        <>
            <footer className={styleClasses.mainFooter}>
                <div className={styleClasses.links}>
                    <Link href={'/'}>
                        <a>
                            <RealsyLogo className={styleClasses.logo}/>
                        </a>
                    </Link>

                    <ul>
                        {props.menuItems.map(menuItem =>
                            <li key={menuItem.url}>
                                <Link
                                    href={menuItem.url}
                                    children={<a>{menuItem.text}</a>}
                                />
                            </li>
                        )}
                    </ul>

                    <ul>
                        {props.socialMenuItems.map(menuItem => {
                            let href = null;
                            let iconUrl = null;
                            let text = null;
                            let style = null;

                            switch (menuItem.type) {
                                case 'facebook':
                                    href = `https://facebook.com/${menuItem.slug}`;
                                    iconUrl = '/icon-facebook.svg';
                                    text = 'Facebook';
                                    style = {marginRight: 6, marginLeft: 4};
                                    break;
                                case 'twitter':
                                    href = `https://twitter.com/${menuItem.slug}`;
                                    iconUrl = '/icon-twitter.svg';
                                    text = 'Twitter';
                                    style = {marginRight: 3};
                                    break;
                                case 'instagram':
                                    href = `https://instagram.com/${menuItem.slug}`;
                                    iconUrl = '/icon-instagram.svg';
                                    text = 'Instagram';
                                    style = {marginRight: 5};
                                    break;
                            }

                            return (
                                <li key={menuItem.type}>
                                    <a target={'_new'} href={href}>
                                        <img alt={text} src={iconUrl} style={style}/> {text}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </footer>

            <ChatLauncher promptText={props.chatButtonText}/>
        </>
    );
};

MainFooter.propTypes = {
    menuItems: arrayOf(shape({
        text: string.isRequired,
        url: string.isRequired,
    })),
    socialMenuItems: arrayOf(shape({
        type: string.isRequired,
        slug: string,
    })),
    chatButtonText: string
};

MainFooter.defaultProps = {
    menuItems: [],
    socialMenuItems: [],
    chatButtonText: 'Chat with Us!'
};

export default MainFooter;
