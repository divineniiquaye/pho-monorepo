"use client";

import { MenuIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "../Icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle body overflow when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={cn(
        "z-50 px-4 sm:px-8 py-4 w-full fixed bg-background border-b border-dark-gray/50",
        !isMenuOpen && "backdrop-blur supports-[backdrop-filter]:bg-background/60",
      )}
    >
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start sm:space-x-8">
            <div className="relative z-50 flex h-12 items-center justify-between w-full sm:w-auto">
              <a href="/" className="flex gap-2 items-center">
                <p className="text-muted-light text-lg font-semibold">PHO Monorepo</p>
              </a>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="sm:hidden p-2 hover:text-white z-50 text-zinc-400"
              >
                {isMenuOpen ? (
                  <XIcon className="size-5" />
                ) : (
                  <MenuIcon className="size-5" />
                )}
              </button>
            </div>

            <div className="hidden sm:flex space-x-4 text-brand-50/50">
              <a href="/docs" className="hover:text-white" aria-label="Docs">
                Docs
              </a>
              <a href="/blog" className="hover:text-white" aria-label="Blog">
                Blog
              </a>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <a
                      href="/templates"
                      aria-label="Templates"
                      className="hover:text-brand-50/50 cursor-not-allowed text-brand-50/25"
                    >
                      Templates
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>soon</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-zinc-400">
            {/* <SearchInput />
            <div className="h-6 w-[1px] bg-dark-gray" /> */}

            <div className="flex gap-1.5 items-center">
              <a
                href="https://discord.gg/gXX6Qn46"
                className="hover:text-white p-2"
                aria-label="Discord"
              >
                <Icons.discord className="size-5" />
              </a>
              <a
                href="https://github.com/divineniiquaye/pho-monorepo"
                className="hover:text-white p-2"
                aria-label="GitHub"
              >
                <Icons.github className="size-5" />
              </a>
              <a
                href="https://x.com/SparkleKvng"
                className="hover:text-white p-2"
                aria-label="X (Twitter)"
              >
                <Icons.x className="size-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden mt-12 fixed inset-0 bg-background z-40 pt-[72px]">
            <div className="h-full flex flex-col px-4">
              {/* <div className="mb-8 w-full">
                <SearchInput />
              </div> */}

              <div className="space-y-4">
                <p className="text-sm tracking-tight font-semibold text-muted-light uppercase">
                  Navigation
                </p>

                <div className="space-y-4">
                  <a
                    href="/docs"
                    className="block text-brand-50/50 hover:text-white text-sm"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Docs"
                  >
                    Docs
                  </a>
                  <a
                    href="/blog"
                    className="block text-brand-50/50 hover:text-white text-sm"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Blog"
                  >
                    Blog Posts
                  </a>
                  <a
                    aria-disabled
                    href="#"
                    className="block text-brand-50/25 text-sm"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Templates"
                  >
                    Templates (soon)
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-dark-gray">
                <div className="flex items-center justify-center gap-8">
                  <a
                    href="https://discord.gg/gXX6Qn46"
                    className="hover:text-white text-zinc-400"
                  >
                    <Icons.discord className="size-5" />
                  </a>
                  <a
                    href="https://github.com/divineniiquaye/pho-monorepo"
                    className="hover:text-white text-zinc-400"
                    aria-label="GitHub"
                  >
                    <Icons.github className="size-5" />
                  </a>
                  <a
                    href="https://x.com/SparkleKvng"
                    className="hover:text-white text-zinc-400"
                    aria-label="X (Twitter)"
                  >
                    <Icons.x className="size-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
