import {useId, useState} from 'react'

export const Form = () => {
  const emailId = useId()
  const roleId = useId()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState('Engineer')

  return (
    <form className="space-y-2 sm:space-y-3">
      <div>
        <label htmlFor={emailId} className="block text-sm sm:text-base font-medium text-gray-700">
          Email
        </label>
        <input
          id={emailId}
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor={roleId} className="block text-sm sm:text-base font-medium text-gray-700">
          Role
        </label>
        <select
          id={roleId}
          value={role}
          onChange={e => setRole(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none"
        >
          <option>Engineer</option>
          <option>Designer</option>
          <option>PM</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
      >
        Submit
      </button>
    </form>
  )
}
