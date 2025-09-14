import { Input } from "@heroui/input";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";

export default function Projects() {
  return (
    <div className="flex flex-col min-h-screen px-[12rem] bg-black text-white">
      {/* Search */}
      <div className="mt-20 flex justify-center">
        <Input className="w-full max-w-lg" label="Search Project" type="text" />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="rounded-lg overflow-hidden shadow-lg flex flex-col p-4"
          >
            {/* Image centered */}
            <div className="w-full flex justify-center p-2 rounded-md">
              <Image
                alt="Project Image"
                src="/logo.png"
                width={300}
                height={200}
                className="rounded-md"
              />
            </div>

            {/* Text left-aligned */}
            <div className="mt-3 w-full flex justify-between items-center">
            <h1 className="font-semibold text-lg text-left">Project Name</h1>
            <Button color="primary" variant="light" className="w-16">
                See Info
            </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
