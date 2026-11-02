import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Credentials } from "@/components/Credentials";
import { Footer } from "@/components/Footer";
import { Glance } from "@/components/Glance";
import { Hero } from "@/components/Hero";
import { Impact } from "@/components/Impact";
import { Leadership } from "@/components/Leadership";
import { Nav } from "@/components/Nav";
import { Skills } from "@/components/Skills";
import { Work } from "@/components/Work";

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main" className="overflow-x-clip">
        <Hero />
        <Glance />
        <Leadership />
        <Impact />
        <Work />
        <Credentials />
        <Skills />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
