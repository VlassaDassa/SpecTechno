import React from 'react';

import Header from '../../components/Header';
import Solutions from '../../components/Solutions';
import Services from '../../components/Services/Services';
import Feedback from '../../components/Feedback';
import Footer from '../../components/Footer';

import './index.scss';

const Index: React.FC = () => {
    return  (
        <>
            <Header />
            <main>
                <Solutions />
                <Services />
                <Feedback />
                <Footer />
            </main>
        </>
    )
}

export default Index;