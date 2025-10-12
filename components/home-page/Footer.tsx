import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4 font-garet-heavy">
              TravlAbhi
            </h3>
            <div className="space-y-2 text-primary-foreground/80">
              <p>Explore More Travel</p>
              <p>Explore More Joy</p>
              <p>Explore More Life</p>
              <p>About Us</p>
              <p>Awards</p>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-semibold mb-4">TravlAbhi</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <p>Package Deal</p>
              <p>Organizer Ship</p>
              <p>Gift Trips</p>
              <p>Refer & Earn</p>
              <p>About Us</p>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <Link
                href="/terms-and-conditions"
                className="block hover:text-primary-foreground transition-colors"
              >
                Terms & Conditions
              </Link>
              <p>Privacy Policy</p>
              <p>Cookie Policy</p>
              <p>Refund Policy</p>
            </div>
          </div>

          {/* Gallery */}
          <div>
            <div className="grid grid-cols-5 gap-2">
              <div className="aspect-square bg-primary/60 rounded"></div>
              <div className="aspect-square bg-primary/60 rounded"></div>
              <div className="aspect-square bg-primary/60 rounded"></div>
              <div className="aspect-square bg-primary/60 rounded"></div>
              <div className="aspect-square bg-primary/60 rounded"></div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col items-center space-y-4 mb-6">
            <Link href="/signup-organizer">
              <button className="bg-white text-primary hover:bg-primary-foreground/90 transition-colors px-8 py-3 rounded-lg font-semibold shadow-lg">
                Become an Organizer
              </button>
            </Link>
            <p className="text-primary-foreground/60 text-sm">
              Start creating amazing travel experiences
            </p>
          </div>
          <div className="text-center text-primary-foreground/80">
            <p>&copy; 2024 TravlAbhi. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
