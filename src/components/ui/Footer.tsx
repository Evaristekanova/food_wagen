import { FooterLink, footerLinks } from "@/src/constants/footerLinks.constants";
import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
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
    <div className="bg-food-dark-gray-1 text-food-white px-22">
      <div className="grid grid-cols-1 sm:grid-cols-2 py-4 pb-6 border-b-2 border-food-dark-gray-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {footerLinks.map((link: FooterLink) => (
            <div key={link.label}>
              <h3 className="text-lg font-bold mb-4">{link.label}</h3>
              <ul className="flex flex-col gap-2">
                {renderFooterLinks(link.links)}
              </ul>
            </div>
          ))}
        </div>
        <div className=" space-y-4">
          <h3 className="text-lg font-bold mb-4">FOLLOW US</h3>
          <div className="grid grid-cols-3 gap-2 w-fit">
            <Link href="#" className="text-food-white">
              <Instagram className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-food-white">
              <Facebook className="w-6 h-6" />
            </Link>
            <Link href="#" className="text-food-white">
              <Twitter className="w-6 h-6" />
            </Link>
          </div>
          <p className="text-food-white text-sm">
            Receive exclusive offers in your mailbox
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="w-full h-[52px]">
              <Input
                fieldName="email"
                inputType="email"
                placeholder="Enter your email"
                className=" w-full bg-food-dark-gray-2"
                icon={<Mail className=" text-food-dark-gray-3" />}
              />
            </div>
            <Button
              className="bg-food-yellow-1 text-white px-6 py-3 rounded-md font-bold flex items-center h-[52px] hover:bg-food-yellow-1/80 transition-all duration-150 ease-out
                  justify-center gap-2 cursor-pointer  shrink-0 w-[160px] shadow-lg shadow-food-yellow-1/30"
            >
              <Mail className="w-5 h-5" />
              <span>Subscribe</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between py-4">
        <p className="text-food-white text-sm">
          All rights reserved © {new Date().getFullYear()} Food Wagen.
        </p>
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Made with  by <span className="font-bold">Themewagon</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
