import React from "react";
import { Link } from "react-router-dom";
import { TrendingDown, Shield, Bell, FileText } from "lucide-react";

const LOGO_URL = "https://media.base44.com/images/public/6a24463f14619589c55bfcf7/a5d07fe59_Untitled_design-removebg-preview.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-10 sm:px-12 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo + description */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img src={LOGO_URL} alt="Dealert" className="h-12 w-auto brightness-0 invert" />
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Smart Price Tracker & Deal Alert System for Nepal's e-commerce ecosystem. Shop smarter, shop safer.
            </p>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Features
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link to="/tracker" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2">
                  <TrendingDown className="w-3.5 h-3.5" /> Price Tracker
                </Link>
              </li>
              <li>
                <Link to="/trust" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5" /> Trust Checker
                </Link>
              </li>
              <li>
                <Link to="/deals" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5" /> Deal Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              About
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-primary-foreground/70">The Team</li>
              <li className="text-sm text-primary-foreground/70">Acknowledgement</li>
              <li className="text-sm text-primary-foreground/70">Daraz</li>
            </ul>
          </div>

          {/* Terms */}
          <div>
            <h4 className="font-heading font-semibold mb-4 text-sm uppercase tracking-wider text-primary-foreground/50">
              Terms
            </h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-primary-foreground/70 flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> View privacy policy
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar — "Built with" line removed */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex justify-center items-center">
          <p className="text-xs text-primary-foreground/50">
            © 2026 Dealert. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}