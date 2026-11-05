export function SalesExecutiveShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 bg-muted p-4 md:p-6">
      {children}
    </div>
  )
}
