"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { registerFunction } from "../actions"
import { useRouter } from "next/navigation"

export default function RegistrationForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    dockerImage: "",
    inputSchema: "",
    outputSchema: "",
    version: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value)
      })

      const result = await registerFunction(formDataToSend)
      if (result.success) {
        alert("Function registered successfully!")
        router.push("/discover")
      } else {
        alert(`Error: ${result.message}`)
      }
    } catch (error) {
      alert("An error occurred while registering the function.")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Register Docker Function</h1>
        <form onSubmit={handleSubmit}>
          <Card className="mb-4 bg-gray-50/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <label className="text-sm text-gray-600">Docker Image</label>
                  </div>
                  <Input
                    type="text"
                    name="dockerImage"
                    value={formData.dockerImage}
                    onChange={handleChange}
                    placeholder="myuser/myimage:v1"
                    className="flex-1"
                    required
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <label className="text-sm text-gray-600">Version</label>
                  </div>
                  <Input
                    type="text"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    className="flex-1"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-gray-50/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 flex-shrink-0">
                    <label className="text-sm text-gray-600">Description</label>
                  </div>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="flex-1 min-h-[100px]"
                    placeholder="Describe your function..."
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4 bg-gray-50/50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-24 flex-shrink-0">
                    <label className="text-sm text-gray-600">Input Schema</label>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      name="inputSchema"
                      value={formData.inputSchema}
                      onChange={handleChange}
                      className="min-h-[100px]"
                      placeholder="{}"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">JSON schema for function input</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-24 flex-shrink-0">
                    <label className="text-sm text-gray-600">Output Schema</label>
                  </div>
                  <div className="flex-1">
                    <Textarea
                      name="outputSchema"
                      value={formData.outputSchema}
                      onChange={handleChange}
                      className="min-h-[100px]"
                      placeholder="{}"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">JSON schema for function output</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 bg-gray-50/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-24 flex-shrink-0">
                  <label className="text-sm text-gray-600">Name</label>
                </div>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="flex-1"
                  placeholder="Function name"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => router.push("/discover")}>
              Cancel
            </Button>
            <Button type="submit">Register Function</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

