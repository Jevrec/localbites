function UserRowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted" />
          <div className="h-4 w-32 bg-muted rounded" />
        </div>
      </td>

      <td className="px-6 py-4">
        <div className="h-4 w-48 bg-muted rounded" />
      </td>

      <td className="px-6 py-4">
        <div className="h-5 w-16 bg-muted rounded-full" />
      </td>

      <td className="px-6 py-4">
        <div className="h-4 w-32 bg-muted rounded" />
      </td>

      <td className="px-6 py-4">
        <div className="flex gap-4">
          <div className="h-4 w-10 bg-muted rounded" />
          <div className="h-4 w-14 bg-muted rounded" />
        </div>
      </td>
    </tr>
  );
}

export default function ManageUserSkeleton() {
  return (
    <div className="bg-surface rounded-xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark">
            <tr>
              {["User", "Email", "Role", "Created At", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-medium text-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-dark">
            {Array.from({ length: 6 }).map((_, i) => (
              <UserRowSkeleton key={i} />
            ))}
          </tbody>  
        </table>
      </div>
    </div>
  );
}

