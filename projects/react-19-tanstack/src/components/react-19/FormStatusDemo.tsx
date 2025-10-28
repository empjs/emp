import React from 'react'
import {useFormStatus} from 'react-dom'

async function submit(formData: FormData) {
  // Simulate async submit
  await new Promise(r => setTimeout(r, 1000))
}

function SubmitButton() {
  const {pending} = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? 'Submitting…' : 'Submit'}
    </button>
  )
}

export const FormStatusDemo = () => {
  return (
    <form
      action={submit}
      className="relative rounded-lg border bg-white/70 dark:bg-neutral-900/50 backdrop-blur p-4 space-y-3"
    >
      <a
        href="https://github.com/empjs/emp/tree/main/projects/react-19-tanstack/src/components/react-19/FormStatusDemo.tsx"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 top-3 inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
        aria-label="View source on GitHub"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 17l10-10" />
          <path d="M8 7h9v9" />
        </svg>
        Source
      </a>
      <h3 className="text-lg font-semibold">useFormStatus()</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">Tracks form pending state without extra local state.</p>
      <div className="flex gap-2">
        <input
          name="demo"
          placeholder="Type something…"
          className="flex-1 rounded-md border px-3 py-2 text-sm bg-white dark:bg-neutral-900"
        />
        <SubmitButton />
      </div>
    </form>
  )
}
