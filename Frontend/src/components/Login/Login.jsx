import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg({});

        try {
            console.log(email, password);
            await fetch(`${backendUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            })
                .then(async (res) => {

                    const header = res.headers.get("Authorization")
                    console.log("Header", header);

                    if (header === null) {
                        setMsg({ type: 'error', text: 'Invalid credentials' });
                        return;
                    }
                    else {
                        const data = await res.json()
                        console.log("data", data);
                        setMsg({ type: 'success', text: 'Signup successful! You can now log in.' });
                        setEmail('');
                        setPassword('');
                        localStorage.setItem('auth-key', header)
                        navigate('/')
                    }
                })
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
            console.log(err);
        }
    };

    return (
        <div className="flex items-center flex-col justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Login
                    </button>

                    {msg.text && (
                        <p
                            className={`text-sm text-center mt-2 ${msg.type === 'success' ? 'text-green-600' : 'text-red-500'
                                }`}
                        >
                            {msg.text}
                        </p>
                    )}
                </form>
            </div>

            <p className="text-center text-sm text-gray-600 mt-6">
                Don’t have an account?{' '}
                <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-800 font-medium transition-all"
                >
                    Sign up
                </Link>
            </p>
        </div>
    )
}

export default Login
