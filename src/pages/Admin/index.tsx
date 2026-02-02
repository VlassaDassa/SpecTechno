import React from 'react';

import './index.scss';

import messageIcon from './../../assets/images/userMessage.avif';
import userIcon from './../../assets/images/userIcon.jpg';


const Admin: React.FC = () => {
    return (
        <main className="adminPage">
            <div className="adminHeader">
                <div className="burger">
                    <div className="burger-element"></div>
                    <div className="burger-element"></div>
                    <div className="burger-element"></div> 
                </div>
            </div>

            <div className="twoElementContainer">
                <div className="adminElement">
                    <div className="elementImgWrapper">
                        <img src={messageIcon} className="elementImage" />
                    </div>

                    <div className="textWrapper">
                        <p className="elementLabel">Новые сообщения</p>
                        <p className="elementCount">5</p>
                    </div>
                </div>

                <div className="adminElement">
                    <div className="elementImgWrapper">
                        <img src={userIcon} className="elementImage" />
                    </div>

                    <div className="textWrapper">
                        <p className="elementLabel">Новые посетители</p>
                        <p className="elementCount">24</p>
                    </div>
                </div>

            </div>
        </main>
        
    )
}

export default Admin; 