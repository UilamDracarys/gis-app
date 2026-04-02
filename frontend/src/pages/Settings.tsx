import { Cog } from 'lucide-react'

const Settings = () => {
  return (
    <div className="h-screen w-full py-5 px-4">
			<h1 className="text-2xl font-bold  mt-5 flex gap-2 items-center">
				<Cog />
				Settings
			</h1>
			<div className="border rounded-lg p-4 mt-3 overflow-auto">
    </div>
    </div>
  )
}

export default Settings