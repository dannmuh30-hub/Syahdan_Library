import Image from "next/image";

export default function BrandLogo({ size = 28, className = "" }) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={size}
      height={size}
      aria-hidden="true"
      className={"shrink-0 object-contain drop-shadow-[0_0_10px_rgba(232,48,58,0.45)] " + className}
    />
  );
}
