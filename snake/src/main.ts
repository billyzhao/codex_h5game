import "./style.css";
import { Game } from "./game";

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("Missing #app root.");
}

new Game(app);
