export default function Footer() {
  return (
    <footer className="bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-6 py-6 md:py-8">
        <div className="grid md:grid-cols-3 gap-6 md:gap-6 items-center">

          {/* Logo */}
          <div className="flex justify-center md:justify-start">
            <img src="/images/paw-logo.png" alt="Paw Forward" className="w-20 h-20 object-contain" />
          </div>

          {/* Instagram only + handle */}
          <div className="flex justify-center items-center gap-3">
            <a
              href="https://www.instagram.com/projectpawforward"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#6B1A1A] hover:text-[#E8A84C] hover:scale-110 hover:-translate-y-1 transition-all duration-300"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a
              href="https://www.instagram.com/projectpawforward"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6B1A1A] hover:text-[#E8A84C] transition-colors duration-300"
              style={{ fontFamily: "var(--font-spartan)" }}
            >
              @projectpawforward
            </a>
          </div>

          {/* Contact info */}
          <div className="text-center md:text-right space-y-1.5 text-[#6B1A1A]" style={{ fontFamily: "var(--font-spartan)" }}>
            <p className="text-base md:text-lg">Mumbai, India</p>
            <a
              href="mailto:vipanshiagarwal08@gmail.com"
              className="text-base md:text-lg hover:text-[#E8A84C] transition-colors duration-300 inline-block"
            >
              vipanshiagarwal08@gmail.com
            </a>
          </div>

        </div>
      </div>

      {/* Maroon divider line */}
      <div className="border-t-2 border-[#6B1A1A]">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <p
            className="text-center text-xs tracking-wider text-[#6B1A1A]"
            style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.15em" }}
          >
            © 2026 PAW FORWARD. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}