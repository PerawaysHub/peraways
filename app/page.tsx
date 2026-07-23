import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Video } from "@/components/Video";
import { Story } from "@/components/Story";
import { Gstc } from "@/components/Gstc";
import { Services } from "@/components/Services";
import { Bridge } from "@/components/Bridge";
import { Timeline } from "@/components/Timeline";
import { ROI } from "@/components/ROI";
import { Form } from "@/components/Form";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Video />
      <Story />
      <Gstc />
      <Services />
      <Bridge />
      <Timeline />
      <ROI />
      <Form />
      <Footer />
    </main>
  );
}
