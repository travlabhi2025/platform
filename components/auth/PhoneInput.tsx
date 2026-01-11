"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Search, Smartphone } from "lucide-react";

interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

// Popular countries list with flags (using emoji flags)
const countries: Country[] = [
  { code: "US", name: "United States", dialCode: "+1", flag: "🇺🇸" },
  { code: "IN", name: "India", dialCode: "+91", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦" },
  { code: "AU", name: "Australia", dialCode: "+61", flag: "🇦🇺" },
  { code: "DE", name: "Germany", dialCode: "+49", flag: "🇩🇪" },
  { code: "FR", name: "France", dialCode: "+33", flag: "🇫🇷" },
  { code: "IT", name: "Italy", dialCode: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dialCode: "+34", flag: "🇪🇸" },
  { code: "BR", name: "Brazil", dialCode: "+55", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽" },
  { code: "JP", name: "Japan", dialCode: "+81", flag: "🇯🇵" },
  { code: "CN", name: "China", dialCode: "+86", flag: "🇨🇳" },
  { code: "KR", name: "South Korea", dialCode: "+82", flag: "🇰🇷" },
  { code: "SG", name: "Singapore", dialCode: "+65", flag: "🇸🇬" },
  { code: "AE", name: "United Arab Emirates", dialCode: "+971", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966", flag: "🇸🇦" },
  { code: "ZA", name: "South Africa", dialCode: "+27", flag: "🇿🇦" },
  { code: "NZ", name: "New Zealand", dialCode: "+64", flag: "🇳🇿" },
  { code: "NL", name: "Netherlands", dialCode: "+31", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", dialCode: "+32", flag: "🇧🇪" },
  { code: "CH", name: "Switzerland", dialCode: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", dialCode: "+43", flag: "🇦🇹" },
  { code: "SE", name: "Sweden", dialCode: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dialCode: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dialCode: "+45", flag: "🇩🇰" },
  { code: "FI", name: "Finland", dialCode: "+358", flag: "🇫🇮" },
  { code: "PL", name: "Poland", dialCode: "+48", flag: "🇵🇱" },
  { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹" },
  { code: "GR", name: "Greece", dialCode: "+30", flag: "🇬🇷" },
  { code: "TR", name: "Turkey", dialCode: "+90", flag: "🇹🇷" },
  { code: "EG", name: "Egypt", dialCode: "+20", flag: "🇪🇬" },
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", dialCode: "+254", flag: "🇰🇪" },
  { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷" },
  { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴" },
  { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪" },
  { code: "PH", name: "Philippines", dialCode: "+63", flag: "🇵🇭" },
  { code: "TH", name: "Thailand", dialCode: "+66", flag: "🇹🇭" },
  { code: "VN", name: "Vietnam", dialCode: "+84", flag: "🇻🇳" },
  { code: "ID", name: "Indonesia", dialCode: "+62", flag: "🇮🇩" },
  { code: "MY", name: "Malaysia", dialCode: "+60", flag: "🇲🇾" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  onChangeWithParts?: (parts: {
    countryCode: string;
    phoneNumber: string;
    fullValue: string;
  }) => void;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

export default function PhoneInput({
  value,
  onChange,
  onChangeWithParts,
  disabled = false,
  placeholder = "000-0000",
  required = false,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const onChangeWithPartsRef = useRef(onChangeWithParts);
  const previousValueRef = useRef<string>("");
  const isParsingRef = useRef<boolean>(false);

  // Keep onChange refs up to date
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeWithPartsRef.current = onChangeWithParts;
  }, [onChangeWithParts]);

  // Parse value prop when it changes
  useEffect(() => {
    // Only parse if value actually changed
    if (value !== previousValueRef.current) {
      const previousValue = previousValueRef.current;
      previousValueRef.current = value;
      isParsingRef.current = true; // Mark that we're parsing

      if (value) {
        // Try to find matching country by dial code
        const matchingCountry = countries.find((country) =>
          value.startsWith(country.dialCode)
        );
        if (matchingCountry) {
          const phoneNum = value
            .replace(matchingCountry.dialCode, "")
            .trim()
            .replace(/\D/g, "");
          const newFullValue = `${matchingCountry.dialCode} ${phoneNum}`;

          // Only update selectedCountry if it's actually different
          setSelectedCountry((prev) => {
            if (prev.code === matchingCountry.code) {
              // Country unchanged, reset flag early
              isParsingRef.current = false;
              return prev; // Return same reference if unchanged
            }
            return matchingCountry;
          });

          setPhoneNumber(phoneNum);

          // Only call onChangeWithParts if the parsed result is different from previous value
          // This prevents unnecessary parent updates during parsing that cause infinite loops
          if (
            onChangeWithPartsRef.current &&
            phoneNum &&
            newFullValue !== previousValue
          ) {
            onChangeWithPartsRef.current({
              countryCode: matchingCountry.dialCode,
              phoneNumber: phoneNum,
              fullValue: newFullValue,
            });
          }

          // Reset parsing flag after state updates complete
          // Use requestAnimationFrame to ensure state updates have been processed
          requestAnimationFrame(() => {
            isParsingRef.current = false;
          });
        } else {
          const digitsOnly = value.replace(/\D/g, "");
          setPhoneNumber(digitsOnly);
          requestAnimationFrame(() => {
            isParsingRef.current = false;
          });
        }
      } else {
        setPhoneNumber("");
        requestAnimationFrame(() => {
          isParsingRef.current = false;
        });
      }
    }
  }, [value]);

  // Update parent value when phone number or country changes (but not from prop changes)
  useEffect(() => {
    // Don't call onChange if we're currently parsing the value prop
    // This prevents infinite loops when parsing triggers state updates
    if (isParsingRef.current) {
      return;
    }

    const fullNumber = phoneNumber
      ? `${selectedCountry.dialCode} ${phoneNumber}`
      : selectedCountry.dialCode;

    // Only call onChange if the computed value is different from the prop value
    // This prevents infinite loops when the parent updates based on our onChange
    if (fullNumber !== value) {
      onChangeRef.current(fullNumber);

      // Also call onChangeWithParts if provided
      if (onChangeWithPartsRef.current) {
        onChangeWithPartsRef.current({
          countryCode: selectedCountry.dialCode,
          phoneNumber: phoneNumber.replace(/\D/g, ""), // Ensure only digits
          fullValue: fullNumber,
        });
      }
    }
  }, [phoneNumber, selectedCountry, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    setSearchQuery("");
    inputRef.current?.focus();
  };

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ""); // Only digits
    setPhoneNumber(input);
  };

  return (
    <div className="relative group">
      <div className="flex items-center bg-slate-50 rounded-xl focus-within:bg-white focus-within:border-slate-200 focus-within:ring-4 focus-within:ring-slate-100 transition-all border border-transparent">
        {/* Phone icon */}
        <div className="pl-3.5 flex items-center pointer-events-none shrink-0">
          <Smartphone className="w-5 h-5 text-slate-400 group-focus-within:text-accent transition-colors" />
        </div>

        {/* Country selector button */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex items-center gap-1.5 px-2.5 pr-3 py-2.5 border-r border-slate-200 transition-all shrink-0 ${
            isOpen ? "text-accent" : "text-slate-600 hover:text-primary"
          } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          <span className="text-base leading-none shrink-0">
            {selectedCountry.flag}
          </span>
          <span className="text-xs font-semibold font-satoshi-medium whitespace-nowrap shrink-0">
            {selectedCountry.dialCode}
          </span>
          <ChevronDown
            className={`w-3 h-3 transition-transform duration-200 shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Phone input */}
        <input
          ref={inputRef}
          type="tel"
          value={formatPhoneNumber(phoneNumber)}
          onChange={handlePhoneChange}
          disabled={disabled}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-4 py-2.5 bg-transparent border-none outline-none text-primary text-sm placeholder:text-slate-400 font-semibold font-body tracking-[0.05em] disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden"
          style={{
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {/* Search input */}
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-primary placeholder:text-slate-400 focus:bg-white focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-satoshi-medium"
                autoFocus
              />
            </div>
          </div>

          {/* Countries list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 active:bg-slate-100 transition-all duration-150 text-left group ${
                    selectedCountry.code === country.code ? "bg-accent/5" : ""
                  }`}
                >
                  <span className="text-xl leading-none">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-primary font-satoshi-medium group-hover:text-accent transition-colors">
                      {country.name}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold font-satoshi-medium">
                    {country.dialCode}
                  </span>
                  {selectedCountry.code === country.code && (
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-in fade-in-0 zoom-in-95 duration-150"></div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-slate-500 font-satoshi">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
