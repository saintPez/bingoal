import { useContext, useEffect } from 'react';
import userContext from 'context/userContext';

export default function Logout() {
    const { jwt, setJWT } = useContext(userContext);

    useEffect(function () {
        setJWT(false);
    });

    return (
        <>
            <h1>Logout</h1>
        </>
    );
}
