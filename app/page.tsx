import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { Story } from "@/components/Story";
import { Services } from "@/components/Services";
import { Bridge } from "@/components/Bridge";
import { Stats } from "@/components/Stats";
import { ROI } from "@/components/ROI";
import { Form } from "@/components/Form";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <Navbar />
      <Hero />
      <Problem />
      <Story />
      <Services />
      <Bridge />
      <Stats />
      {/* <ROI /> */}
      <Form />
      <Footer />
    </main>
  );
}