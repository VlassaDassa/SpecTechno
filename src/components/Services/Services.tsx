import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import CustomSpiral from './../Spiral';

import imageService1 from './../../assets/images/image-services1.png';
import imageService2 from './../../assets/images/image-services2.webp';
import imageService3 from './../../assets/images/image-services3.avif';

import nodeImage1 from './../../assets/images/nodeImage1.svg';
import nodeImage2 from './../../assets/images/nodeImage2.svg';

import './index.scss';



const Services: React.FC = () => {
    const isDesktop = useMediaQuery({ minWidth: 1281 });
    const [spiralConfig, setSpiralConfig] = useState({
        lineColor: '#BFF8E7',
        lineWidth: 7,
        lineDash: 'none',
        nodeColor: '#4A90E2',
        showNodes: false,
        sCurveStrength: 100,
        curveHeight: -2000,
        smoothness: 0.3,


        // Custom nodes
        customNodes: [
            {
                id: 'node-1',
                position: 0.21,
                radius: 13,
                content: (
                    <div className="node node2">
                        <img src={nodeImage1} className="nodeImage nodeImage1" />
                        <p className="nodeText text">Забота о клиентах</p>
                    </div>
                )
            },
            {
                id: 'node-2',
                position: 0.54,
                radius: 13,
                content: (
                    <div className="node node1">
                        <img src={nodeImage2} className="nodeImage nodeImage2" />
                        <p className="nodeText text">Опыт</p>
                    </div>
                )
            },
        ]
    });

    return (
        <section className="section container">
            <h2 className="subTitle">Услуги в области обеспечения пожарной безопасности</h2>

            <div className="services">
                {isDesktop && (
                    <CustomSpiral
                        blockSelector=".serviceNode"
                        config={spiralConfig}
                    />
                )}

                <div className="serviceItem serviceNode" id="service-1">
                    <div className="textWrapper">
                        <span className="number">1</span>
                        <div className="textContainer">
                            <h3 className="servicesTitle">Проведение огнезащитных работ</h3>
                            <p className="text serviceText">Проведение огнезащитных работ включает в себя нанесение специальных составов на конструкции здания для повышения их огнестойкости. </p>
                        </div>
                    </div>

                    <img src={imageService1} alt="Огнезищатные работы" className="serviceImage" />
                </div>

                <div className="serviceItem serviceNode" id="service-2">
                    <div className="textWrapper">
                        <span className="number">2</span>
                        <div className="textContainer">
                            <h3 className="servicesTitle">Пожарная сигнализация</h3>
                            <p className="text serviceText">Автоматическая пожарная сигнализация (АПС) — это «нервная система» противопожарной защиты. Она круглосуточно отслеживает малейшие признаки возгорания  и мгновенно оповещает.</p>
                        </div>
                    </div>

                    <img src={imageService2} alt="Огнезищатные работы" className="serviceImage" />
                </div>

                <div className="serviceItem serviceNode" id="service-3">
                    <div className="textWrapper">
                        <span className="number">3</span>
                        <div className="textContainer">
                            <h3 className="servicesTitle">Противопожарная защита</h3>
                            <p className="text serviceText">Проектирование, монтаж и обслуживание систем противопожарной защиты</p>
                        </div>
                    </div>

                    <img src={imageService3} alt="Огнезищатные работы" className="serviceImage" />
                </div>

                <button className="serviceNode serviceButton" id="service-4">Смотреть полный список</button>
            </div>
        </section>
    )
}

export default Services;