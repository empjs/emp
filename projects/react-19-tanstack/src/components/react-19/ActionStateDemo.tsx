import React, { useActionState } from 'react'

export const ActionStateDemo = () => {
  const [message, formAction, isPending] = useActionState(async (prevMessage: string, formData: FormData) => {
    const name = String(formData.get('name') || '').trim()
    await new Promise(r => setTimeout(r, 1000))
    if (!name) return 'Please enter a name.'
    return `Saved: ${name}`
  }, '')

  return (
    <form action={formAction} className="rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4 space-y-3">
      <h3 className="text-lg font-semibold">useActionState()</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Updates local state from the last form action result, with pending.</p>
      <div className="flex gap-2">
        <input
          name="name"
          placeholder="Your name"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        />
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
      {message ? <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p> : null}
    </form>
  )
}