export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout sin Header ni Footer para páginas de autenticación
  return <>{children}</>;
}
