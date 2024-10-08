import Image from "next/image";

const images = [
  {
    src: "https://images.unsplash.com/photo-1728066356523-084a7d195b6a",
    alt: "image 1",
  },
  {
    src: "https://images.unsplash.com/photo-1727915325711-5fdfb5a0a55c",
    alt: "image 2",
  },
  {
    src: "https://images.unsplash.com/photo-1727968451338-209fb8da01a3",
    alt: "image 3",
  },
];

export default function Page() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Images</h1>
      {/* a grid of images */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div className="relative w-64 h-64">
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              fill
              objectFit="cover"
            />
          </div>
        ))}
      </div>
    </div>

  )
}
