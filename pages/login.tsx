import { useContext, useState, FormEvent } from 'react';
import Link from 'next/link';
import userContext from 'context/userContext';
import login from 'services/login';
import styles from 'styles/Login.module.scss';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [value, setValue] = useState('');
    const { jwt, setJWT } = useContext(userContext);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await login(email, password);
        if (!res.success) return setValue('error');
        setJWT(res.token);
        setValue(res.token);
    };

    return (
        <main>
            <h1 className={styles.title}>Bingo</h1>

            <form onSubmit={handleSubmit} className={styles.card}>
                <p className={styles.description}>Login to Bingo</p>
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                />
                <input type="submit" value="Send" className={styles.button} />
            </form>
        </main>
    );
}
