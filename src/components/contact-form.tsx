"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion } from "framer-motion"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const ContactSchema = z.object({
  name: z.string().min(2, "Please add your name"),
  email: z.string().email("Use a valid email"),
  company: z.string().optional(),
  roles: z.string().optional(),
  message: z.string().min(10, "Tell us a little more"),
})

type ContactFormValues = z.infer<typeof ContactSchema>

type ContactFormProps = {
  onSubmit: (values: ContactFormValues) => Promise<{ success: boolean }>
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      roles: "",
      message: "",
    },
  })

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (values: ContactFormValues) => {
    startTransition(async () => {
      try {
        const result = await onSubmit(values)
        setStatus(result.success ? "success" : "error")
        if (result.success) {
          form.reset()
        }
      } catch (error) {
        console.error(error)
        setStatus("error")
      }
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-3xl border border-navy-100/60 bg-white p-8 shadow-soft-lg backdrop-blur dark:border-navy-800/60 dark:bg-navy-900/40"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@company.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Company" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="roles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role(s) hiring</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Staff ML, Analytics Engineer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What does a successful sprint look like?</FormLabel>
                <FormControl>
                  <Textarea rows={5} placeholder="Share your goals, timelines, or team context" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Sending…" : "Send message"}
            </Button>
            {status === "success" && (
              <p className="text-sm text-navy-700 dark:text-wheat-100">
                Thank you. We’ll get back within one business day.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive">Something went wrong. Please try again.</p>
            )}
          </div>
        </form>
      </Form>
    </motion.div>
  )
}
