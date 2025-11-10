import Link from 'next/link'

const Navbar = () => {
    return (<header className="bg-[#11224E] py-5 px-6 flex justify-center">
        <div className="w-full max-w-[1200px] flex justify-between items-center">
          <div className="flex items-center gap-2">
             <Link href="/"><img src="/images/logo.png" alt="Resume Analyzer" className="h-8 w-auto" /></Link>
          </div>
          <Link
            href="/upload"
            className="bg-[#CE2D4F] hover:bg-[#b62646] text-white text-sm font-medium px-5 py-2 rounded-full transition-colors"
          >
            Upload Resume
          </Link>
        </div>
      </header>)
}

export default Navbar