import React from "react";

import './index.scss';

import particle1 from './../../assets/images/particle1.svg';
import particle2 from './../../assets/images/particle2.svg';
import camera from './../../assets/images/camera.png';
import wire from './../../assets/images/wire.png';


const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="container">
                <div className="headerWrapper">
                    <h1 className="title">
                        Спец<br />Технология
                    </h1>

                    <img className="particle particle1" src={particle1} alt="" />
                    <img className="particle particle2" src={particle2} alt="" />
                    
                    <img className="camera" src={camera} alt="" />

                    <div className="sun-container">
                        <img className="wire" src={wire} alt="" />
                        <div className="rays">
                            {[...Array(7)].map((_, i) => {
                            const angle = (i * 51.43);
                            return (
                                <div 
                                key={i}
                                className={`ray-${i + 1} ray`}
                                style={{ '--ray-angle': `${angle}deg` } as React.CSSProperties}
                                />
                            );
                            })}
                        </div>
                    </div>

                    <div className="decorateLabel-container">
                        <div className="bubble bubble-1" />
                        <div className="bubble bubble-2" />
                        <div className="bubble bubble-3" />
                        
                        <div className="decorateLabel">Идея</div> 
                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header;