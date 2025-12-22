// Using regular anchor for navigation to avoid type issues in Link under current tsconfig

const DynamicPage = () => {
  return (
    <div>
      <h1>Dynamic Page</h1>
      <p>
        This component was loaded lazily using <strong>React.lazy</strong> and <strong>Suspense</strong>.
      </p>
      <div className="card">
        <h3>Lazy Loading</h3>
        <p>
          Check the network tab in your developer tools. You should see a separate chunk file loaded when you navigated
          here.
        </p>
        <a href="/">Back Home</a>
      </div>
    </div>
  )
}

export default DynamicPage
