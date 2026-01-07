import React from 'react';

import Header from '../../components/Header';
import Solutions from '../../components/Solutions';
import Services from '../../components/Services/Services';

import './index.scss';

const Index: React.FC = () => {
    return  (
        <>
            <Header />
            <main>
                <Solutions />
                <Services />
            </main>
        </>
    )
}

export default Index;