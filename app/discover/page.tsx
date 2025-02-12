import { getRegisteredFunctions } from "../actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export default async function DiscoveryPage() {
  const functions = await getRegisteredFunctions()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Docker Function Registry</h1>
        <div className="grid grid-cols-1 gap-6">
          {functions.map((func, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-gray-50/50">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{func.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatDistanceToNow(new Date(func.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">v{func.version}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-gray-600">{func.description}</p>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-mono text-gray-600">{func.dockerImage}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Input Schema</h3>
                      <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-xs">{func.inputSchema}</pre>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Output Schema</h3>
                      <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-xs">{func.outputSchema}</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

