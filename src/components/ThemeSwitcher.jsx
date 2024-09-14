import { useEffect, useState } from "preact/hooks";
import DarkIcon from "./icons/DarkIcon.astro";
import LightIcon from "./icons/LightIcon.astro";

const THEME_ITEM = "theme";
const ICONS = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const ThemeIcon = (props) => {
  const [storedTheme, setStoredTheme] = useState("");
  const [displayedIcon, setDisplayedIcon] = useState("");

  useEffect(() => {
    const theme = getTheme();
    setStoredTheme(theme);

    setTheme(theme); // Establecer el tema según la preferencia almacenada o del sistema
  }, [storedTheme]);

  // Función para alternar el menú desplegable
  function toggleMenu() {
    const menu = document.getElementById("themeMenu");
    menu?.classList.toggle("hidden");
  }

  // Función para establecer el tema (claro u oscuro)
  function setTheme(theme) {
    const html = document.documentElement;
    let currentIcon = document.getElementById("currentIcon");

    if (theme === ICONS.LIGHT) {
      html.classList.remove(ICONS.DARK);
      localStorage.setItem(THEME_ITEM, theme); // Almacenar tema oscuro
      setStoredTheme(theme);
    } else if (theme === ICONS.DARK) {
      html.classList.add(ICONS.DARK);
      localStorage.setItem(THEME_ITEM, theme); // Almacenar tema oscuro
      setStoredTheme(theme);
    } else {
      localStorage.removeItem(THEME_ITEM);
      setStoredTheme("");
    }

    if (html.classList.contains("dark")) {
      html.style.colorScheme = "dark";
    } else {
      html.style.colorScheme = "light";
    }
  }

  return (
    // < !--Botón para cambiar tema con icono-- >
    <div className="relative inline-block text-left">
      <button
        id="themeButton"
        onClick={() => toggleMenu()}
        className="w-full rounded-full dark:bg-gray-700 p-2 hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
      >
        <span id="currentIcon" className="flex items-center size-6">
          {/* <!-- Ícono por defecto (sol) --> */}
          {displayedIcon === ICONS.LIGHT
            ? props.light
            : displayedIcon === ICONS.DARK
              ? props.dark
              : props.system}
        </span>
      </button>

      {/* <!-- Menú desplegable de selección de tema --> */}
      <div
        id="themeMenu"
        className="absolute hidden right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white dark:bg-gray-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div className="py-1">
          {/* <!-- Opción de preferencias del sistema --> */}
          <button
            onClick={() => {
              setTheme(ICONS.SYSTEM);
              // Cerrar el menú después de la selección
              toggleMenu();
              setDisplayedIcon(ICONS.SYSTEM);
            }}
            id="switchToLight"
            className="flex items-center gap-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {props.system}
            <span>Sistema</span>
          </button>
          {/* <!-- Opción de tema claro --> */}
          <button
            onClick={() => {
              setTheme(ICONS.LIGHT);
              // Cerrar el menú después de la selección
              toggleMenu();
              setDisplayedIcon(ICONS.LIGHT);
            }}
            id="switchToLight"
            className="flex items-center gap-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {props.light}
            <span>Tema Claro</span>
          </button>
          {/* <!-- Opción de tema oscuro --> */}
          <button
            id="switchToDark"
            onClick={() => {
              setTheme(ICONS.DARK);
              // Cerrar el menú después de la selección
              toggleMenu();
              setDisplayedIcon(ICONS.DARK);
            }}
            className="flex items-center gap-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
          >
            {props.dark}
            <span>Tema Oscuro</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Gets the theme from the localstorage or the system if it doesn't
 * exists in localstorage.
 *
 * @returns The current theme
 */
function getTheme() {
  return localStorage.getItem(THEME_ITEM)
    ? localStorage.getItem(THEME_ITEM)
    : window.matchMedia("(prefers-color-scheme: dark)").matches
      ? ICONS.DARK
      : ICONS.LIGHT;
}
export default ThemeIcon;
