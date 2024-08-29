import Appbar from "@/components/Appbar";
import AuthLayout from "@/utils/AuthLayout";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AuthLayout>
        <Appbar />
        {children}
      </AuthLayout>
    </div>
  );
}
