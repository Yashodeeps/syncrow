import Appbar from "@/components/Appbar";
import AuthLayout from "@/utils/AuthLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AuthLayout>
    <>
      <Appbar />
      {children}
    </>
    // </AuthLayout>
  );
}
