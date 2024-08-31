const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  
    if (currentTheme === 'dark') {
        toggleSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    else {        document.documentElement.setAttribute('data-theme', 'light');
          localStorage.setItem('theme', 'light');
    }    
}

  function scrollToSection() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
  }

  
  function scrollToSection1() {
    document.getElementById('faq').scrollIntoView({ behavior: 'smooth' });
  }

toggleSwitch.addEventListener('change', switchTheme, false);