import { FooterLink, footerLinks } from "@/src/constants/footerLinks.constants";
import { Facebook, Heart, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Input } from "./CustomInput";
import { Button } from "./Button";

const renderFooterLinks = (links: { label: string; href: string }[]) => {
  return links.map((link) => (
    <Link href={link.href} key={link.label} className="text-food-white">
      {link.label}
    </Link>
  ));
};

const Footer: React.FC = () => {
  return (
    <div className="bg-food-dark-gray-1 text-food-white px-4 sm:px-8 md:px-12 lg:px-22">
      <div className="grid grid-cols-1 lg:grid-cols-2 py-6 sm:py-8 pb-6 sm:pb-8 border-b-2 border-food-dark-gray-2 gap-8 sm:gap-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {footerLinks.map((link: FooterLink) => (
            <div key={link.label}>
              <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                {link.label}
              </h3>
              <ul className="flex flex-col gap-2">
                {renderFooterLinks(link.links)}
              </ul>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
            FOLLOW US
          </h3>
          <div className="grid grid-cols-3 gap-2 w-fit">
            <Link
              href="#"
              className="text-food-white hover:opacity-80 transition-opacity"
            >
              <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              href="#"
              className="text-food-white hover:opacity-80 transition-opacity"
            >
              <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
            <Link
              href="#"
              className="text-food-white hover:opacity-80 transition-opacity"
            >
              <Twitter className="w-5 h-5 sm:w-6 sm:h-6" />
            </Link>
          </div>
          <p className="text-food-white text-xs sm:text-sm">
            Receive exclusive offers in your mailbox
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <div className="w-full h-[48px] sm:h-[52px]">
              <Input
                fieldName="email"
                inputType="email"
                placeholder="Enter your email"
                className="w-full bg-food-dark-gray-2 text-sm sm:text-base"
                icon={
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-food-dark-gray-3" />
                }
              />
            </div>
            <Button
              className="bg-food-yellow-1 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-bold flex items-center h-[48px] sm:h-[52px] hover:bg-food-yellow-1/80 transition-all duration-150 ease-out
                  justify-center gap-2 cursor-pointer shrink-0 w-full sm:w-[160px] shadow-lg shadow-food-yellow-1/30 text-sm sm:text-base"
            >
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Subscribe</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:py-6 gap-3 sm:gap-4">
        <p className="text-food-white text-xs sm:text-sm text-center sm:text-left">
          All rights reserved © {new Date().getFullYear()} Food Wagen.
        </p>
        <div className="flex items-center justify-center sm:justify-end">
          <p className="text-xs sm:text-sm text-center sm:text-right">
            Made with{" "}
            <Heart className="w-4 h-4 sm:w-5  text-food-yellow-1 inline-block" />{" "}
            by <span className="font-bold">Themewagon</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
