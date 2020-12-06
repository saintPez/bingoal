import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from 'styles/Header.module.scss';

export default memo(function Nav() {
	const handleClick = () => {
		const a = document.getElementById('ul').classList.toggle(styles.active);
	};

	return (
		<header className={styles.header}>
			<Link href="/">
				<a>Bingo</a>
			</Link>
			<nav>
				<Link href="/">
					<a>Home</a>
				</Link>
				<Link href="/faq">
					<a>Faq</a>
				</Link>
				<Link href="/play">
					<a>Play</a>
				</Link>
				<button onClick={handleClick} className={styles.profile}>
					<Image src="/profile.jpg" width={28} height={28} />
					<span className={styles.username}>ThePez</span>
					<ul id="ul" className={styles.active}>
						<li>
							<a>
								<Image
									src="/profile.jpg"
									width={28}
									height={28}
								/>
								<span>Santiago Lopez</span>
							</a>
						</li>
						<li>
							<a>Salir</a>
						</li>
					</ul>
				</button>
			</nav>
		</header>
	);
});
