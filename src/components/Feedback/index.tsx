import React, { useState, useEffect, useRef} from 'react';

import profileIcon from './../../assets/images/profile-icon.svg';
import emailIcon from './../../assets/images/email-icon.svg';
import messageIcon from './../../assets/images/message-icon.svg'; 

import arrow from './../../assets/images/arrow.svg';
import messageRectangle from './../../assets/images/message.svg';
import rectangle from './../../assets/images/rectangle.svg';

import './index.scss';


type Errors = {
    name?: string;
    email?: string;
    message?: string;
}

const Feedback: React.FC = () => {
    const [counter, setCounter] = useState<number>(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    // Processing a hidden clone of textarea
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const shadowRef = useRef<HTMLDivElement>(null);

    // Form verification
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (isSubmitted) {
            validateForm();
        }
    };

    // Form verification
    const validateName = (value: string) => {
        if (value.trim().length < 4) {
            return 'Имя должно содержать минимум 4 символа';
        }
    };

    const validateEmail = (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Введите корректный email';
        }
    };

    const validateMessage = (value: string) => {
        if (value.trim().length < 10) {
            return 'Сообщение должно быть не менее 10 символов';
        }
    };

    const validateForm = () => {
        const name = nameRef.current?.value || '';
        const email = emailRef.current?.value || '';
        const message = textareaRef.current?.value || '';
    
        const newErrors: Errors = {
            name: validateName(name),
            email: validateEmail(email),
            message: validateMessage(message),
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(Boolean);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (!validateForm()) return;

        setShowSuccess(true);
        
        setFormData({
            name: '',
            email: '',
            message: ''
        });

        // Clear form
        setTimeout(() => {
            setIsSubmitted(false);
            setCounter(0);
            setShowSuccess(false);
        }, 5000);
        
        // Hide push
        setTimeout(() => {
            setShowSuccess(false);
        }, 5000);
        
        // sendDataToServer(formData);
    }

    const handleLiveValidation = () => {
        if (!isSubmitted) return;
        validateForm();
    }

    

    // Processing a hidden clone of textarea
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
                <form noValidate onSubmit={handleSubmit}>
                    <div className="fieldsContainer">

                        <div className="fieldWrapper">
                            <img src={profileIcon} alt="Имя" />
                            <input type="text" 
                                name="name" 
                                ref={nameRef}
                                className={`feedbackField ${errors.name ? 'errorField' : ''}`}
                                placeholder="Ваше имя"
                                onInput={handleLiveValidation}
                                onChange={handleChange}
                                value={formData.name}
                            />
                            {errors.name && <span className="errorMessage">{errors.name}</span>}
                        </div>

                        <div className="fieldWrapper">
                            <img src={emailIcon} alt="Почта" />
                            <input 
                                name="email" 
                                ref={emailRef}
                                type="email" 
                                className={`feedbackField ${errors.email ? 'errorField' : ''}`}
                                placeholder="Ваша почта"
                                onInput={handleLiveValidation}
                                onChange={handleChange}
                                value={formData.email}
                            />
                            {errors.email && <span className="errorMessage">{errors.email}</span>}
                        </div>

                        <div className="fieldWrapper">
                            <img src={messageIcon} alt="Сообщение" />
                            <textarea
                                ref={textareaRef}
                                name="message"
                                className={`feedbackField feedbackTextarea ${errors.message ? 'errorField' : ''}`}
                                placeholder="Ваше сообщение"
                                value={formData.message}
                                onInput={() => {
                                    handleInput();
                                    handleLiveValidation();
                                }}
                                onChange={handleChange}
                                maxLength={500}
                                style={{ overflow: 'hidden', resize: 'none', width: '100%' }}
                            />

                            {errors.message && <span className="errorMessage">{errors.message}</span>}

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

            <div className={`success-notification ${showSuccess ? 'show' : ''}`}>
                <div className="success-content">
                    <div className="success-icon">✓</div>
                    <div className="success-text">
                        <h3>Сообщение успешно отправлено!</h3>
                        <p>В течение 24 часов вам придёт ответ на указанную вами почту</p>
                    </div>
                    <button 
                        className="success-close"
                        onClick={() => setShowSuccess(false)}
                    >
                        x
                    </button>
                </div>
            </div>

        </section>
    )
}

export default Feedback;

