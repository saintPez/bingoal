import Header from 'components/header';
import Footer from 'components/footer';
import styles from 'styles/App.module.scss';
import 'styles/globals.scss';

export default function App({ Component, pageProps }) {
    return (
        <div className={styles.container}>
            <Header />
            <div className={styles.layout}>
                <Component {...pageProps} />
            </div>
            <Footer />
        </div>
    );
}
