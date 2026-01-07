import React, { useState, useEffect, useRef} from 'react';

import profileIcon from './../../assets/images/profile-icon.svg';
import emailIcon from './../../assets/images/email-icon.svg';
import messageIcon from './../../assets/images/message-icon.svg'; 

import arrow from './../../assets/images/arrow.svg';
import messageRectangle from './../../assets/images/message.svg';
import rectangle from './../../assets/images/rectangle.svg';

import './index.scss';

const Feedback: React.FC = () => {
    const [counter, setCounter] = useState<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);


    const handleInput = () => {
        const textarea = textareaRef.current;
        const shadow = shadowRef.current;
        if (!textarea || !shadow) return;

        shadow.textContent = textarea.value || textarea.placeholder;
        
        textarea.style.height = 'auto';
        textarea.style.height = shadow.scrollHeight + 'px';

        // Text counter
        setCounter(textareaRef.current?.value.length || 0)
    };

    useEffect(() => {
        handleInput();
    }, []);

    return (
        <section className="feedback section">
            <svg
                className="wave-svg"
                viewBox="0 0 1440 320"
                preserveAspectRatio="none"
            >
                <path
                    d="M0,160 C360,240 1080,80 1440,160 L1440,320 L0,320 Z"
                    className="wave-path"
                />
            </svg>

            <div className="feedbackForm">
                <h2 className="feedbackTitle">Обратная связь</h2>
                <form action="#">
                    <div className="fieldsContainer">

                        <div className="fieldWrapper">
                            <img src={profileIcon} alt="Имя" />
                            <input type="text"  
                                className="feedbackField" 
                                placeholder="Ваше имя" 
                            />
                        </div>

                        <div className="fieldWrapper">
                            <img src={emailIcon} alt="Почта" />
                            <input 
                                type="email" 
                                className="feedbackField" 
                                placeholder="Ваша почта" 
                            />
                        </div>

                        <div className="fieldWrapper">
                            <img src={messageIcon} alt="Сообщение" />
                            <textarea
                                ref={textareaRef}
                                className="feedbackField feedbackTextarea"
                                placeholder="Ваше сообщение"
                                onInput={handleInput}
                                maxLength={500}
                                style={{ overflow: 'hidden', resize: 'none', width: '100%' }}
                            />

                            <div
                                className={'textareaClone'}
                                ref={shadowRef}
                                style={{
                                    visibility: 'hidden',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    width: '100%',
                                    fontSize: '20px',
                                    fontWeight: 400,
                                    lineHeight: '30px',
                                    padding: '10px 10px 10px 35px',
                                    boxSizing: 'border-box',
                                }}
                            />

                            <span className={`feedbackCounter ${counter>=500 ? 'errorText' : '' }`}>{counter}/500</span>
                        </div>

                    </div>
                    <button type="submit" className="submitBtn">Отправить</button>
                </form>
            </div>

            <div className="arrowLeftWrapper">
                <p className="arrowText arrowTextLeft">ВОПРОСЫ?</p>
                <img src={arrow} className="arrowLeft" />
            </div>

            <div className="arrowRightWrapper">
                <p className="arrowText arrowTextRight">ПРЕДЛОЖЕНИЯ?</p>
                <img src={arrow} className="arrowRight" />
            </div>

            <img src={rectangle} className="rectangle rectangle1" />
            <img src={rectangle} className="rectangle rectangle2" />
            <img src={rectangle} className="rectangle rectangle3" />
            <img src={rectangle} className="rectangle rectangle4" />
            
            <img src={messageRectangle} className="messageRectangle messageRectangle1" />
            <img src={messageRectangle} className="messageRectangle messageRectangle2" />

        </section>
    )
}

export default Feedback;

