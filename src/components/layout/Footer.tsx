import Link from "next/link";
import { Sparkles, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-auto transition-colors">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Slogan */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
              <Sparkles className="h-5 w-5 fill-primary" />
              <span>Dealert</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Nepal&apos;s smart price intelligence, historical charts aggregator, and instant deal alert notifier. Track pricing trends across Daraz, Sastodeal, Oliz Store, and more.
            </p>
            <div className="flex items-center space-x-3 text-muted-foreground pt-2">
              <Link href="#" className="hover:text-primary transition-colors" title="Facebook">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors" title="Twitter">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-primary transition-colors" title="Github">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">Compare Products</Link></li>
              <li><Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">Hot Deals</Link></li>
              <li><Link href="/price-index" className="text-muted-foreground hover:text-primary transition-colors">Nepal Price Index</Link></li>
              <li><Link href="/fake-page-detector" className="text-muted-foreground hover:text-primary transition-colors">Fake Link Detector</Link></li>
            </ul>
          </div>

          {/* Categories Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Top Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?category=Laptops" className="text-muted-foreground hover:text-primary transition-colors">Laptops</Link></li>
              <li><Link href="/products?category=Smartphones" className="text-muted-foreground hover:text-primary transition-colors">Smartphones</Link></li>
              <li><Link href="/products?category=Televisions" className="text-muted-foreground hover:text-primary transition-colors">Televisions</Link></li>
              <li><Link href="/products?category=Headphones" className="text-muted-foreground hover:text-primary transition-colors">Headphones</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>New Baneshwor, Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>support@dealert.com.np</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>+977 1 4410000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <span>&copy; {new Date().getFullYear()} Dealert Nepal. All rights reserved.</span>
          <div className="flex items-center space-x-4">
            <Link href="#" className="hover:underline">Privacy Policy</Link>
            <Link href="#" className="hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
