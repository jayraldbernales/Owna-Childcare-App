import appstore from "../../../assets/img/appstore-googleplay.svg";
import apple from "../../../assets/img/apple.svg";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Contact = () => {
  return (
    <footer id="contact" className="bg-[var(--primary)] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-2xl font-bold mb-3">OWNA</h3>
          <p className="text-sm text-white/80 mb-4">
            Manage your service from one central location. Build relationships
            with families. Keep parents updated on-the-go within the intuitive,
            user-friendly parent app.
          </p>
          <div className="flex gap-3">
            {[FaFacebookF, FaLinkedinIn, FaTwitter, FaInstagram, FaYoutube].map(
              (Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="border-2 bg-white text-[var(--primary)] p-2 rounded-full hover:bg-[var(--primary)] hover:text-white transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            )}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#service">Features</a>
            </li>
            <li>
              <a href="#price">Pricing</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#">Sign Up</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li>
              <a href="#">About Us</a>
            </li>
            <li>
              <a href="#">Careers</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-3">Download</h3>
          <p className="text-sm text-white/80 mb-4">
            Get our mobile app for exclusive features and seamless experience on
            the go.
          </p>
          <div className="flex gap-4">
            <a
              href="https://apps.apple.com/us/app/owna-childcare-app/id1318604128"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={apple}
                alt="App Store"
                className="h-10"
                loading="lazy"
              />
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=au.com.owna"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={appstore}
                alt="Google Play"
                className="h-10"
                loading="lazy"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-white mt-10 border-t border-white/20 pt-4">
        © 2025 OWNA. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Contact;
