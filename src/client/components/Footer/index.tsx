import Link from 'next/link';

export default function Footer() {
  return (
    <p>
      © {new Date().getFullYear()}
      {' · '}
      <Link href="/privacy">Privacy policy</Link>
      {' · '}
      <Link href="/terms">Terms of Service</Link>
    </p>
  );
}
