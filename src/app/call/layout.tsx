export default function Layout({
  children,
}: {
  children: Readonly<React.ReactNode>;
}) {
  return <div className="h-screen bg-black">{children}</div>;
}
