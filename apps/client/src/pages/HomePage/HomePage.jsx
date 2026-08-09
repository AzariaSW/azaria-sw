import Hero from "../../features/home/Hero/Hero";
import About from "../../features/home/About/About";
import Skills from "../../features/home/Skills/Skills";
import Experience from "../../features/home/Experience/Experience";
import Projects from "../../features/home/Projects/Projects";
import Certificates from "../../features/home/Certificates/Certificates";
import Education from "../../features/home/Education/Education";
import Github from "../../features/home/Github/Github";
import Contact from "../../features/home/Contact/Contact";

function HomePage() {
  return (
    <>
      <Hero />

      <About />

      <Skills />

      <Education />

      <Certificates />

      <Projects />

      <Experience />

      <Github />

      <Contact />
    </>
  );
}

export default HomePage;
