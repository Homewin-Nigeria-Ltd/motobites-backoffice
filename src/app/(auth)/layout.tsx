export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-muted p-4 sm:p-8">
      {children}
    </div>
  )
}
