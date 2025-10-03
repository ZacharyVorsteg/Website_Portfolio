import Container from './Container';
import siteData from '@/content/site.json';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-12" role="contentinfo">
      <Container>
        <div className="text-center space-y-4">
          <p className="text-sm text-gray-600">
            {siteData.footerNote}
          </p>
          <div className="flex items-center justify-center gap-6 text-sm">
            <a
              href="https://github.com/ZacharyVorsteg/Website_Portfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#0B2D5B] focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] focus:ring-offset-2 rounded"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/zacharyvorsteg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-[#0B2D5B] focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] focus:ring-offset-2 rounded"
            >
              LinkedIn
            </a>
            {/* Uncomment when PDF is available
            <a
              href="/Zachary_Vorsteg_Resume.pdf"
              download
              className="text-gray-600 hover:text-[#0B2D5B] focus:outline-none focus:ring-2 focus:ring-[#0B2D5B] focus:ring-offset-2 rounded"
            >
              Download PDF
            </a>
            */}
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Zachary Vorsteg. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
