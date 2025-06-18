import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

function Signup() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState({ type: '', text: '' });
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const navigate = useNavigate();


    const handleSignup = async (e) => {
        e.preventDefault();
        setMsg({});
        try {
            console.log(name, email, password);
            await fetch(`${backendUrl}/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({ name, email, password })
            })
                .then(async (res) => {

                    const header = res.headers.get("Authorization")
                    console.log("Header",header);
                    const data = await res.json()
                    console.log("data",data);
                    setMsg({ type: 'success', text: 'Signup successful! You can now log in.' });
                    setName('');
                    setEmail('');
                    setPassword('');
                    localStorage.setItem('auth-key',header)
                    navigate('/')
                })
        } catch (err) {
            setMsg({ type: 'error', text: err.message });
            console.log(err);
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

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
                        Sign Up
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

                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link
                        to="/"
                        className="text-blue-600 hover:text-blue-800 font-medium transition-all"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Signup
