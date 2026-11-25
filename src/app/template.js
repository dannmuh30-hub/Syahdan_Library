


export default function Template({ children }) {
  return (
    <>
      <div aria-hidden="true" className="page-curtain">
        <div className="page-curtain-dark" />
        <div className="page-curtain-red" />
      </div>
      {children}
    </>
  );
}
