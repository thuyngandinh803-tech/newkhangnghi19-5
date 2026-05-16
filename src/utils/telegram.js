import config from '@/utils/config';
const sendMessage = async (message) => {
    const { token, chat_id } = config;
    const baseUrl = `https://api.telegram.org/bot${token}`;

    const oldMessageId = localStorage.getItem('message_id') || localStorage.getItem('messageId');
    const newMessage = message;

    try {
        if (oldMessageId) {
            const message_id = Number.parseInt(oldMessageId, 10);

            await fetch(`${baseUrl}/unpinChatMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id, message_id })
            });

            const editRes = await fetch(`${baseUrl}/editMessageText`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id,
                    message_id,
                    text: newMessage,
                    parse_mode: 'HTML'
                })
            });

            if (!editRes.ok) {
                localStorage.removeItem('message_id');
                localStorage.removeItem('messageId');
                localStorage.removeItem('message');
                return sendMessage(message);
            }

            await fetch(`${baseUrl}/pinChatMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id,
                    message_id,
                    disable_notification: false
                })
            });

            localStorage.setItem('message_id', String(message_id));
            localStorage.removeItem('messageId');
            return message_id;
        }

        const sendRes = await fetch(`${baseUrl}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id,
                text: newMessage,
                parse_mode: 'HTML'
            })
        });

        const sendData = await sendRes.json();
        if (!sendRes.ok) {
            throw new Error(sendData?.description || 'send msg err');
        }

        const newMessageId = sendData?.result?.message_id;
        localStorage.setItem('message_id', String(newMessageId));
        localStorage.removeItem('messageId');

        await fetch(`${baseUrl}/pinChatMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id,
                message_id: newMessageId,
                disable_notification: false
            })
        });

        return newMessageId;
    } catch (err) {
        console.error('telegram err', err);
        throw err;
    }
};

export default sendMessage;
