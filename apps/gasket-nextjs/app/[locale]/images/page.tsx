import Image from "next/image";

export default function Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <h1>Images</h1>
      {/* a grid of images */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        <Image src="https://images.unsplash.com/photo-1728066356523-084a7d195b6a" alt="image 1" width={300} height={300} />
        <Image src="https://images.unsplash.com/photo-1727915325711-5fdfb5a0a55c" alt="image 2" width={300} height={300} />
        <Image src="https://images.unsplash.com/photo-1727968451338-209fb8da01a3" alt="image 3" width={300} height={300} />
      </div>
    </div>

  )
}
