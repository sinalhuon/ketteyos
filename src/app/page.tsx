import Link from "next/link";
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch the demo guest token if exists
  const demoGuest = await prisma.guest.findFirst({
    where: { name: 'John Doe' },
    include: { event: true }
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 text-white p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600">
          Kettekyuos Events
        </h1>
        <p className="text-xl text-gray-300">
          Create premium, animated invitations for your special moments.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/dashboard/new" className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-3 rounded-full font-semibold transition">
            Create Event
          </Link>
          <Link href="/login" className="border border-yellow-600 text-yellow-500 hover:bg-yellow-600/10 px-6 py-3 rounded-full font-semibold transition">
            Login
          </Link>
        </div>

        {demoGuest && (
          <div className="mt-12 p-6 border border-yellow-500/30 rounded-lg bg-yellow-900/10">
            <h3 className="text-lg font-semibold mb-2">Demo Invitation Ready</h3>
            <p className="mb-4 text-gray-400">Experience the "Premium Gold" template:</p>
            <Link
              href={`/invite/${demoGuest.token}`}
              className="inline-block bg-white text-gray-900 px-6 py-2 rounded shadow-lg hover:bg-gray-200 transition"
            >
              View Invitation
            </Link>
            <div className="mt-2 text-xs text-gray-500 break-all">
              Link: http://localhost:3000/invite/{demoGuest.token}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
