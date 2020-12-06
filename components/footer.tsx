import { memo } from 'react';
import Image from 'next/image';
import styles from 'styles/Footer.module.scss';

export default memo(function Footer() {
	return (
		<footer className={styles.footer}>
			<a
				href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
				target="_blank"
				rel="noopener noreferrer"
			>
				Powered by{' '}
				<Image
					src="/vercel.svg"
					alt="Vercel Logo"
					width={70.75}
					height={16}
				/>
			</a>
		</footer>
	);
});
