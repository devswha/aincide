import Header from "@/components/Header";

export default function CommunityLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="max-w-4xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-safe">
        {children}
      </main>
    </>
  );
}
