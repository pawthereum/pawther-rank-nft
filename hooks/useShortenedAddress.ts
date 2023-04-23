import { type Address } from "wagmi";

const useShortenedAddress = () => {

  const getShortenedAddress = (addr: string | Address | undefined, preChar?: number, postChar?: number) => {
    if (!addr) return '';
    return addr.slice(0, preChar || 4)  + '...' + addr.slice(addr.length - (postChar || 4), addr.length);
  }

  return { getShortenedAddress };
}

export default useShortenedAddress;