import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Docker Function Registry (V0)</h1>
      <div className="flex space-x-4">
        <Link href="/register">
          <Button>Register Function</Button>
        </Link>
        <Link href="/discover">
          <Button variant="outline">Discover Functions</Button>
        </Link>
      </div>
    </main>
  )
}

