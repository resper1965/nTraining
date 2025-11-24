import { createClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { User } from '@/lib/types/database'

export default async function AdminUsersPage() {
  await requireRole('platform_admin')
  const supabase = createClient()

  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-red-400">Error loading users: {error.message}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl font-medium text-white mb-2">
            User Management
          </h1>
          <p className="text-slate-400">
            Manage platform users and their roles
          </p>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="font-display text-xl text-white">
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {users && users.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Email
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Role
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users?.map((user: User) => (
                      <tr
                        key={user.id}
                        className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {user.full_name || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-300">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              user.is_active
                                ? 'bg-green-950/50 text-green-400'
                                : 'bg-red-950/50 text-red-400'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-400">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

