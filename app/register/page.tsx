"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  dockerImage: z
    .string()
    .regex(/^[\w.-]+\/[\w.-]+:[\w.-]+$/, "Format d'image Docker invalide. Utilisez le format : utilisateur/image:tag"),
  inputSchema: z.string().min(2, "Le schéma d'entrée est requis"),
  outputSchema: z.string().min(2, "Le schéma de sortie est requis"),
  version: z.string().min(1, "La version est requise"),
})

export default function RegisterPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      dockerImage: "",
      inputSchema: "",
      outputSchema: "",
      version: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setSubmitStatus("idle")
    try {
      const response = await fetch("/api/functions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setTimeout(() => {
          router.push("/functions")
        }, 2000)
      } else {
        const errorData = await response.json()
        if (errorData.error) {
          Object.entries(errorData.error).forEach(([key, value]) => {
            form.setError(key as any, { type: "manual", message: (value as string[])[0] })
          })
        } else {
          throw new Error("Une erreur inattendue s'est produite")
        }
        setSubmitStatus("error")
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la fonction:", error)
      setSubmitStatus("error")
    }
    setIsSubmitting(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Enregistrer une nouvelle fonction</CardTitle>
          <CardDescription>Remplissez les détails de votre fonction Docker ci-dessous</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="docker">Docker</TabsTrigger>
                  <TabsTrigger value="schema">Schémas</TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom de la fonction</FormLabel>
                        <FormControl>
                          <Input placeholder="MaFonction" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Décrivez votre fonction..." {...field} className="min-h-[100px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="version"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Version</FormLabel>
                        <FormControl>
                          <Input placeholder="1.0.0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="docker" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="dockerImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image Docker</FormLabel>
                        <FormControl>
                          <Input placeholder="utilisateur/image:tag" {...field} />
                        </FormControl>
                        <FormDescription>Format : utilisateur/image:tag</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="schema" className="space-y-4 mt-4">
                  <FormField
                    control={form.control}
                    name="inputSchema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schéma d'entrée (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{"type": "object", "properties": {...}}'
                            {...field}
                            className="min-h-[150px] font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="outputSchema"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Schéma de sortie (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{"type": "object", "properties": {...}}'
                            {...field}
                            className="min-h-[150px] font-mono"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => router.push("/functions")}>
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Enregistrement..." : "Enregistrer la fonction"}
                </Button>
              </div>
            </form>
          </Form>
          {submitStatus === "success" && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle>Succès</AlertTitle>
              <AlertDescription>
                La fonction a été enregistrée avec succès. Redirection vers la liste des fonctions...
              </AlertDescription>
            </Alert>
          )}
          {submitStatus === "error" && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle>Erreur</AlertTitle>
              <AlertDescription>
                Une erreur s'est produite lors de l'enregistrement de la fonction. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

