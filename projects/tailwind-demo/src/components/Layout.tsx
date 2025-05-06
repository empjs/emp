const Layout = (props: any) => (
  <div className="container mx-auto bg">
    <div className=" lg:columns-2">{props.children}</div>
  </div>
)
export default Layout
