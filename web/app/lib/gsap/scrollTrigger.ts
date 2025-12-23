import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function registerScrollTrigger() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}
