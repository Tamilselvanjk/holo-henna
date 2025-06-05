const CORS_CONFIG = {
    allowedOrigins: [
        'http://localhost:3000',
        'https://holo-henna.onrender.com',
        'https://holo-henna-frontend.onrender.com',
        'https://holohenna-host.vercel.app'
    ],
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Host',
        'Host': 'holo-henna-frontend.onrender.com'
    }
};

export default CORS_CONFIG;