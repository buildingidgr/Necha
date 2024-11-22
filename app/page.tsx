import { CreateProjectForm } from '@/components/create-project-form'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Project</h1>
      <CreateProjectForm />
    </main>
  )
}

