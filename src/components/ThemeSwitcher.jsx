import { useEffect, useState } from "preact/hooks";
import DarkIcon from "./icons/DarkIcon.astro";
import LightIcon from "./icons/LightIcon.astro";

const DARKMODE_ITEM = "darkMode";
const MODES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const ThemeIcon = (props) => {
  const [darkModeIcon, setDarkModeIcon] = useState(null);

  const updateTheme = (e) => {
    setDarkMode(!!e.matches ? MODES.DARK : MODES.LIGHT);
  };

  useEffect(() => {
    if (localStorage.getItem(DARKMODE_ITEM)) {
      const theme = getTheme();
      setDarkMode(theme); // Establecer el tema según la preferencia almacenada o del sistema
      setDarkModeIcon(theme);
    } else {
      setDarkModeIcon(null);
      updateTheme(mediaQuery);
      // Escucha cambios en el esquema de color
      mediaQuery.addEventListener("change", updateTheme);
      // Limpia el listener cuando el componente se desmonte
      return () => {
        mediaQuery.removeEventListener("change", updateTheme);
      };
    }
  }, []);

  // Función para alternar el menú desplegable
  function toggleMenu() {
    const menu = document.getElementById("themeMenu");
    menu?.classList.toggle("hidden");
  }

  // Función para establecer el tema (claro u oscuro)
  function setDarkMode(mode) {
    const html = document.documentElement;

    if (mode === MODES.DARK) {
      html.classList.add(mode);
    } else {
      html.classList.remove(MODES.DARK);
    }

    if (html.classList.contains(MODES.DARK)) {
      html.style.colorScheme = MODES.DARK;
    } else {
      html.style.colorScheme = MODES.LIGHT;
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
          {darkModeIcon === null
            ? props.system
            : darkModeIcon === MODES.DARK
              ? props.dark
              : props.light}
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
              localStorage.removeItem(DARKMODE_ITEM);
              setDarkMode(getTheme());
              setDarkModeIcon(null);
              // Cerrar el menú después de la selección
              toggleMenu();
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
              localStorage.setItem(DARKMODE_ITEM, MODES.LIGHT);
              setDarkMode(MODES.LIGHT);
              setDarkModeIcon(MODES.LIGHT);
              // Cerrar el menú después de la selección
              toggleMenu();
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
              localStorage.setItem(DARKMODE_ITEM, MODES.DARK);
              setDarkMode(MODES.DARK);
              setDarkModeIcon(MODES.DARK);
              // Cerrar el menú después de la selección
              toggleMenu();
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
  return localStorage.getItem(DARKMODE_ITEM)
    ? localStorage.getItem(DARKMODE_ITEM)
    : mediaQuery.matches
      ? MODES.DARK
      : MODES.LIGHT;
}
export default ThemeIcon;
