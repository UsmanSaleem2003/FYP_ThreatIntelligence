import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState('Verifying your email...');
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const token = searchParams.get('token');

        const verify = async () => {
            if (!token) {
                setMessage('❌ Invalid verification link.');
                return;
            }

            try {
                const res = await axios.get(`http://localhost:8000/api/verify-email/?token=${token}`);
                if (res.status === 200) {
                    setMessage('✅ Your email is verified! Redirecting to login...');
                    const timer = setInterval(() => {
                        setCountdown((prev) => {
                            if (prev === 1) {
                                clearInterval(timer);
                                navigate('/login?verified=true');
                            }
                            return prev - 1;
                        });
                    }, 1000);
                }
            } catch (err) {
                console.error(err);
                setMessage('❌ Verification failed or link expired.');
            }
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <div className="verify-email-container">
            <div>
                <h2>{message}</h2>
                {message.includes('verified') && (
                    <p style={{ marginTop: '10px', fontSize: '16px', color: '#444' }}>
                        Redirecting in <strong>{countdown}</strong> seconds...
                    </p>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
