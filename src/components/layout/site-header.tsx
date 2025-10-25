"use client"

import Link from "next/link"
import type { Route } from "next"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { AlignRight } from "lucide-react"
import { motion, useScroll, useSpring } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { siteConfig } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/process", label: "Process" },
  { href: "/cases", label: "Case Studies" },
  { href: "/roles", label: "Roles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const scrollIndicator = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  })

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-[#f6f0e2]/90 backdrop-blur">
      <motion.div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/70 to-transparent"
        style={{ opacity: scrollIndicator }}
      />
      <div className="container flex items-center justify-between gap-10 py-6">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold text-primary">
          <span className="text-3xl font-display lowercase tracking-tight text-primary">haystack.</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-primary/80 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className={cn(
                  "transition-colors hover:text-primary",
                  isActive && "text-primary",
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="hidden items-center gap-4 md:flex">
          <Button variant="ghost" size="sm" className="text-primary/80 hover:text-primary">
            Login
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-[#1f2640] px-6 text-[#fefbf4] hover:bg-[#1f2640]/90"
          >
            Request a demo
          </Button>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="md:hidden" aria-label="Open navigation">
              <AlignRight className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] border-l border-border/50 bg-background/95">
            <SheetHeader className="text-left">
              <SheetTitle>Navigate</SheetTitle>
              <SheetDescription>{siteConfig.description}</SheetDescription>
            </SheetHeader>
            <div className="mt-6 flex flex-col gap-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Button
                    key={`mobile-${item.href}`}
                    variant={isActive ? "default" : "ghost"}
                    className="justify-start text-base"
                    asChild
                    onClick={() => setOpen(false)}
                  >
                    <Link href={item.href as Route}>{item.label}</Link>
                  </Button>
                )
              })}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <Button asChild onClick={() => setOpen(false)}>
                <Link href={"/contact" as Route}>Book a sprint</Link>
              </Button>
              <Button variant="outline" asChild onClick={() => setOpen(false)}>
                <Link href={"/roles" as Route}>See open roles</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}


