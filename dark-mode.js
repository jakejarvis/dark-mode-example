/* jshint esversion: 6, indent: 2, browser: true, quotmark: single */

/*! Dark mode switcheroo | MIT License | jrvs.io/bWMz */

(function() {
  // improve variable mangling when minifying
  var win = window;
  var doc = win.document;
  var bod = doc.body;
  var cls = bod.classList;
  var sto = localStorage;

  // check for preset `dark_mode_pref` preference in localStorage
  var pref_key = 'dark_mode_pref';
  var pref_on = 'true';
  var pref_off = 'false';
  var pref = sto.getItem(pref_key);

  // use an element with class `dark-mode-toggle` to trigger swap
  var toggle = doc.querySelector('.dark-mode-toggle');

  // keep track of current state (light by default) no matter how we got there
  var dark = false;

  // change CSS via these body classes:
  var cls_light = 'light';
  var cls_dark = 'dark';

  var activateTheme = function(theme) {
    cls.remove(cls_light, cls_dark);
    cls.add(theme);
    dark = (theme == cls_dark ? true : false);
  };

  // if user already explicitly toggled in the past, restore their preference.
  if (pref === pref_on) activateTheme(cls_dark);
  if (pref === pref_off) activateTheme(cls_light);

  // user has never clicked the button, so go by their OS preference until/if they do so
  if (!pref) {
    // check for OS dark mode setting and switch accordingly
    var prefers_dark = '(prefers-color-scheme: dark)';
    var prefers_light = '(prefers-color-scheme: light)';

    if (win.matchMedia(prefers_dark).matches)
      activateTheme(cls_dark);
    else
      activateTheme(cls_light);

    // real-time switching if supported by OS/browser
    win.matchMedia(prefers_dark).addListener(function(e) { if (e.matches) activateTheme(cls_dark); });
    win.matchMedia(prefers_light).addListener(function(e) { if (e.matches) activateTheme(cls_light); });
  }

  // don't freak out if page happens not to have a toggle
  if (toggle) {
    // toggle re-appears now that we know user has JS enabled
    toggle.style.visibility = 'visible';

    // handle toggle click
    toggle.addEventListener('click', function() {
      // switch to the opposite theme & save preference in local storage
      if (!dark) {
        activateTheme(cls_dark);
        sto.setItem(pref_key, pref_on);
      } else {
        activateTheme(cls_light);
        sto.setItem(pref_key, pref_off);
      }
    }, true);
  }
})();
