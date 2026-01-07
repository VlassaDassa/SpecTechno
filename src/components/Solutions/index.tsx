import React from "react";

import solutionImage1 from './../../assets/images/camera2.jpg';
import solutionImage2 from './../../assets/images/solution-image1.png';
import solutionImage3 from './../../assets/images/solution-image2.png';
import solutionImage4 from './../../assets/images/solution-imaage3.webp';
import solutionImage5 from './../../assets/images/solution-image4.png';

import './index.scss';


const Solutions: React.FC = () => {
    return (
        <section className="container section">
            <h2 className="subTitle">Чем мы занимаемся</h2>

            <div className="solutions">
                
                {/* Цикл */}
                <div className="solutionItem">
                    <div className="imgWrapper">
                        <img src={solutionImage2} alt="Противопожарные системы" className="image" />
                    </div>
                    <p className="text">Комплексные решения противопожарной защиты объектов</p>
                </div>

                <div className="solutionItem">
                    <div className="imgWrapper">
                        <img src={solutionImage3} alt="Модернизация инженерных систем" className="image" />
                    </div>
                    <p className="text">Реконструкция и модернизация инженерных систем и жизнеобеспечения</p>
                </div>

                <div className="solutionItem">
                    <div className="imgWrapper">
                        <img src={solutionImage4} alt="Оснащение инженерной инфраструктурой" className="image" />
                    </div>
                    <p className="text">Комплексное оснащение инженерной инфраструктурой, системами автоматизации и диспетчеризации зданий</p>
                </div>

                <div className="solutionItem">
                    <div className="imgWrapper">
                        <img src={solutionImage5} alt="Энергоснабжение, освещение, автоматика" className="image" />
                    </div>
                    <p className="text">Энергоснабжение, освещение, автоматика</p>
                </div>

                <div className="solutionItem">
                    <div className="imgWrapper">
                        <img src={solutionImage1} alt="Системы видеонаблюдей, контроля доступа, TV, связи" className="image" />
                    </div>
                    <p className="text">Системы видеонаблюдей, контроля доступа, TV, связи</p>
                </div>

            </div>
        </section>
    )
}

export default Solutions;