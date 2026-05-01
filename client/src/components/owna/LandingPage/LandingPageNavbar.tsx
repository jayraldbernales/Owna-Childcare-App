import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/img/logo.png";
import { FaBars, FaTimes, FaChevronUp } from "react-icons/fa";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "service", label: "Features" },
    { id: "price", label: "Pricing" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed w-full bg-[var(--background)] z-50 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <img src={logo} alt="OWNA Logo" className="h-8 md:h-10" />

          <div className="hidden md:flex text-lg items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(item.id);
                }}
                className={`hover:text-[var(--pink)] font-bold transition-colors ${
                  item.id === "home" ? "text-[var(--pink)]" : "text-gray-700"
                }`}
              >
                {item.label}
              </a>
            ))}
            <Link to="/signin">
              <button className="border-2 border-[var(--pink)] bg-[var(--pink)] text-white px-4 py-2 rounded hover:opacity-90 transition-opacity">
                Log In
              </button>
            </Link>
          </div>

          {/* hamburger*/}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <FaTimes className="h-6 w-6" />
            ) : (
              <FaBars className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* dropdown */}
        <div
          className={`md:hidden ${
            isMenuOpen ? "block" : "hidden"
          } bg-[var(--background)] transition-all duration-300 ease-in-out`}
        >
          <div className="px-4 pt-2 pb-4 space-y-4">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleScroll(item.id);
                }}
                className="block text-lg font-bold py-2 px-2 text-gray-700 hover:text-[var(--pink)]"
              >
                {item.label}
              </a>
            ))}
            <button className="w-full border-2 border-[var(--pink)] bg-[var(--pink)] text-white px-4 py-2 rounded hover:opacity-90">
              Log In
            </button>
          </div>
        </div>
      </nav>

      {/* arrow */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[var(--pink)] text-white shadow-lg hover:opacity-90 transition-opacity z-50"
          aria-label="Scroll to Top"
        >
          <FaChevronUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default Navbar;
