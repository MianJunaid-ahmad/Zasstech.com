import Image from 'next/image';
export function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand ${light ? 'brand-light' : ''}`}>
      <Image src="/logos/zasstech-mark.svg" alt="" width={36} height={36} priority={!light} />
      <span>
        Zass<span>Tech</span>
      </span>
    </span>
  );
}
