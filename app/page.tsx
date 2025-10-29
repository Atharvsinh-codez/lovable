"use client";

// Import shared components
import { Connector } from "@/components/shared/layout/curvy-rect";
import HeroFlame from "@/components/shared/effects/flame/hero-flame";
import { HeaderProvider } from "@/components/shared/header/HeaderContext";

// Import hero section components
import HomeHeroBackground from "@/components/app/(home)/sections/hero/Background/Background";
import { BackgroundOuterPiece } from "@/components/app/(home)/sections/hero/Background/BackgroundOuterPiece";
import HomeHeroBadge from "@/components/app/(home)/sections/hero/Badge/Badge";
import HomeHeroPixi from "@/components/app/(home)/sections/hero/Pixi/Pixi";

// Import header components
import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit";
import HeaderWrapper from "@/components/shared/header/Wrapper/Wrapper";
import HeaderDropdownWrapper from "@/components/shared/header/Dropdown/Wrapper/Wrapper";
import GithubIcon from "@/components/shared/header/Github/_svg/GithubIcon";
import ButtonUI from "@/components/ui/shadcn/button";

export default function HomePage() {
  return (
    <HeaderProvider>
      <div className="min-h-screen bg-background-base">
        {/* Header/Navigation Section */}
        <HeaderDropdownWrapper />

        <div className="sticky top-0 left-0 w-full z-[101] bg-background-base header">
          <div className="absolute top-0 cmw-container border-x border-border-faint h-full pointer-events-none" />
          <div className="h-1 bg-border-faint w-full left-0 -bottom-1 absolute" />
          <div className="cmw-container absolute h-full pointer-events-none top-0">
            <Connector className="absolute -left-[10.5px] -bottom-11" />
            <Connector className="absolute -right-[10.5px] -bottom-11" />
          </div>

          <HeaderWrapper>
            <div className="max-w-[900px] mx-auto w-full flex justify-between items-center">
              <div className="flex gap-24 items-center">
                <HeaderBrandKit />
              </div>
              <div className="flex gap-8">
                <a
                  className="contents"
                  href="https://github.com/mendableai/open-lovable"
                  target="_blank"
                >
                  <ButtonUI variant="tertiary">
                    <GithubIcon />
                    Use this Template
                  </ButtonUI>
                </a>
              </div>
            </div>
          </HeaderWrapper>
        </div>

        {/* Hero Section */}
        <section className="overflow-x-clip" id="home-hero">
          <div className="pt-28 lg:pt-254 lg:-mt-100 pb-115 relative" id="hero-content">
            <HomeHeroPixi />
            <HeroFlame />
            <BackgroundOuterPiece />
            <HomeHeroBackground />

            <div className="relative container px-16">
              <HomeHeroBadge />
              
              {/* Main Title */}
              <h1 className="text-center text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                AI-Powered Design Artifacts
              </h1>
              
              {/* Subtitle */}
              <p className="text-center text-body-large text-gray-600 max-w-2xl mx-auto mb-12">
                Upload research data, let AI analyze it, and generate beautiful design artifacts 
                with custom templates—all backed by evidence.
              </p>

              {/* CTA Button - artifacts workflow has been deprecated, all functionality now in chat */}
              {/* <div className="flex justify-center gap-4">
                <Link href="/generation">
                  <ButtonUI className="gap-2 h-12 px-8 text-base">
                    Get Started
                  </ButtonUI>
                </Link>
              </div> */}

              {/* Feature Cards */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Upload Research</h3>
                  <p className="text-sm text-gray-600">
                    Upload interviews, surveys, or observation notes. AI analyzes your data automatically.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">AI Suggests Artifacts</h3>
                  <p className="text-sm text-gray-600">
                    Get intelligent suggestions for personas, journey maps, and more based on your data.
                  </p>
                </div>

                <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Generate & Export</h3>
                  <p className="text-sm text-gray-600">
                    Create customizable templates and generate artifacts with evidence citations.
                  </p>
                </div>
              </div>

              {/* Powered by note */}
              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  Built on top of{" "}
                  <a 
                    href="https://github.com/mendableai/open-lovable" 
                    target="_blank"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    Open Lovable
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HeaderProvider>
  );
}
