import React from 'react';

import './index.scss';


const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="container footerWrapper">
                <p className="text">info@spectechno.com</p>
                <p className="text">101000, Россия, г.Москва, Милютинский пер,. д.9, стр.2</p>
                <p className="text">(+7 495) 22-770-308</p>
            </div>
        </footer>
    )
}

export default Footer;