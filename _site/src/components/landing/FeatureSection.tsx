import { Code2, Palette, Bot, Wrench, Layers, Workflow } from "lucide-react";
import { FeatureCard } from "../FeatureCard";

export const FeatureSection = () => {
  return (
    <section className="py-20 relative flex items-center w-full flex-col gap-6 md:gap-8 max-w-7xl mx-auto px-4 md:px-6 border-y-2 border-dashed">
      <h2 className="text-4xl sm:text-5xl leading-none tracking-tight text-muted-light font-semibold text-center">
        Build a production-grade{" "}
        <span className="relative block mt-2 md:inline md:mt-0 text-brand-400">
          {" "}
          <span className="absolute z-0 bg-brand-200/10 -left-2 -top-1 -bottom-1 -right-2 md:-left-3 md:-top-0 md:-bottom-0 md:-right-3 -rotate-1" />
          web/app!
        </span>
      </h2>
      <p className="text-lg text-pretty md:text-xl/8 text-muted-dark text-center max-w-2xl">
        Everything you need to build & deploy your Expo/Next.js application,{" "}
        <span className="inline sm:block"> even if you're a beginner.</span>
      </p>
      <div id="features">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:w-[80%] mx-auto">
          <FeatureCard
            icon={Code2}
            title="Latest Expo SDK"
            description="Leverage the best of the Expo ecosystem while maintaining full control over your app."
          />
          <FeatureCard
            title="TypeScript Powered"
            icon={Workflow}
            description="Enhanced code quality and bug prevention through static type checking and improved developer experience."
          />
          <FeatureCard
            title="Modern UI Kit"
            icon={Palette}
            description="Beautiful UI components built with TailwindCSS, featuring essential elements for your app."
          />
          <FeatureCard
            icon={Wrench}
            title="Multi-Environment"
            description="Built-in support for Production, Staging, and Development environments using Expo configuration."
          />
          <FeatureCard
            icon={Layers}
            title="Clean Architecture"
            description="Well-organized project structure with Absolute Imports for easier code navigation and management."
          />
          <FeatureCard
            title="Developer Tools"
            icon={Bot}
            description="VSCode extensions, settings, and snippets for an enhanced developer experience."
          />
        </div>
      </div>
    </section>
  );
};
