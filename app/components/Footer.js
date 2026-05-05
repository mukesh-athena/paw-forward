export default function Footer() {
  return (
    <footer className="bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <img src="/images/paw-logo.png" alt="Paw Forward" className="w-28 h-28 object-contain" />
          </div>
          <div className="flex justify-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#6B1A1A] hover:text-[#E8A84C] transition-colors duration-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#6B1A1A] hover:text-[#E8A84C] transition-colors duration-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" className="text-[#6B1A1A] hover:text-[#E8A84C] transition-colors duration-300">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
          </div>
          <div className="text-center md:text-right space-y-2 text-[#6B1A1A]" style={{ fontFamily: "var(--font-playfair)" }}>
            <p className="text-lg md:text-xl">Mumbai, India</p>
            <a href="mailto:hello@pawforward.org" className="text-lg md:text-xl hover:text-[#E8A84C] transition-colors duration-300 inline-block">hello@pawforward.org</a>
          </div>
        </div>
      </div>
      {/* Maroon divider line */}
      <div className="border-t-2 border-[#6B1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm tracking-wider text-[#6B1A1A]" style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.15em" }}>© 2026 PAW FORWARD. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}