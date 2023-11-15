import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link href="./cctv">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">
          CCTV
        </button>
      </Link>
      <Link href="./num-plate">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-4">
          Number Plate Recognition
        </button>
      </Link>
    </main>
  );
}
