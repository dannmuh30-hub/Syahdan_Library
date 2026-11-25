

export default function Avatar({ id, nama, fotoV, className = "h-9 w-9 text-sm" }) {
  if (fotoV) {
    return (
      
      <img
        src={`/api/foto/${id}?v=${fotoV}`}
        alt=""
        className={"shrink-0 rounded-full object-cover " + className}
      />
    );
  }
  return (
    <span aria-hidden="true" className={"flex shrink-0 items-center justify-center rounded-full bg-amber-100 font-bold text-amber-700 " + className}>
      {nama.trim().charAt(0).toUpperCase()}
    </span>
  );
}
