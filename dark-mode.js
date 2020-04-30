/* jshint esversion: 6, indent: 2, browser: true, quotmark: single */

/*! Dark mode switcheroo | MIT License | jrvs.io/darkmode */

(function() {
  // improve variable mangling when minifying
  var win = window;
  var doc = win.document;
  var bod = doc.body;
  var cls = bod.classList;
  var sto = localStorage;

  // check for preset `dark_mode_pref` preference in localStorage
  var pref_key = 'dark_mode_pref';
  var pref = sto.getItem(pref_key);

  // change CSS via these <body> classes:
  var dark = 'dark';
  var light = 'light';

  // use an element with class `dark-mode-toggle` to trigger swap when clicked
  var toggle = doc.querySelector('.dark-mode-toggle');

  // keep track of current state (light by default) no matter how we got there
  var active = false;

  // receives a class name and switches <body> to it
  var activateTheme = function(theme) {
    cls.remove(dark, light);
    cls.add(theme);
    active = (theme === dark);
  };

  // if user already explicitly toggled in the past, restore their preference
  if (pref === dark) activateTheme(dark);
  if (pref === light) activateTheme(light);

  // user has never clicked the button, so go by their OS preference until/if they do so
  if (!pref) {
    // check for OS dark mode setting and switch accordingly
    var prefers_dark = '(prefers-color-scheme: dark)';
    var prefers_light = '(prefers-color-scheme: light)';

    if (win.matchMedia(prefers_dark).matches)
      activateTheme(dark);
    else
      activateTheme(light);

    // real-time switching if supported by OS/browser
    win.matchMedia(prefers_dark).addListener(function(e) { if (e.matches) activateTheme(dark); });
    win.matchMedia(prefers_light).addListener(function(e) { if (e.matches) activateTheme(light); });
  }

  // don't freak out if page happens not to have a toggle
  if (toggle) {
    // toggle re-appears now that we know user has JS enabled
    toggle.style.visibility = 'visible';

    // handle toggle click
    toggle.addEventListener('click', function() {
      // switch to the opposite theme & save preference in local storage
      if (!active) {
        activateTheme(dark);
        sto.setItem(pref_key, dark);
      } else {
        activateTheme(light);
        sto.setItem(pref_key, light);
      }
    }, true);
  }
})();
