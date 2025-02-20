import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/auth';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { Spinner } from "../";
import { BASE_URL } from '../../utils/fetchData';

const PrivateRoute = () => {
    const [ok, setOk] = useState(false);
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        const authCheck = async () => {
            try {
                // Add token to the Authorization header
                const res = await axios.get(`${BASE_URL}/api/v1/auth/user-auth`, {
                    headers: {
                        Authorization: `Bearer ${auth?.token}` // Include the token here
                    }
                });

                if (res.data.ok) {
                    setOk(true);
                } else {
                    setOk(false);
                }
            } catch (error) {
                console.error('Authentication check failed:', error);
                setOk(false);
            }
        };

        if (auth?.token) {
            authCheck();
        }
    }, [auth?.token]);

    return ok ? <Outlet /> : <Spinner />;
}

export default PrivateRoute;