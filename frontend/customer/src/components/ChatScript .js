import React, { useEffect } from 'react';

const ChatScript = () => {
    useEffect(() => {
        // Tạo một thẻ <script>
        const script = document.createElement('script');
        script.src = "https://ahachat.com//customer-chats/customer_chat_VgIfgsvQ7s67531edbdef9f.js";
        script.type = "text/javascript";
        script.async = true;
        // Thêm script vào <footer> hoặc <body>
        document.body.appendChild(script);

        // Dọn dẹp khi Component bị hủy
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return null; // Không cần render gì cả
};
export default ChatScript;