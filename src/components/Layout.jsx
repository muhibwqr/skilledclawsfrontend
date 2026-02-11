export function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#2d2d2d] font-sans text-[#f2f2f7] overflow-hidden">
      <main className="min-h-screen overflow-auto bg-[#2d2d2d]">
        {children}
      </main>
    </div>
  )
}
