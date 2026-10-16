const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.nav-links');
const themeKey='mostafizur-theme';

const applyTheme=theme=>{
  document.documentElement.dataset.theme=theme;
  const themeToggle=document.querySelector('.theme-toggle');
  if(themeToggle){
    const nextTheme=theme==='dark'?'light':'dark';
    themeToggle.textContent=nextTheme==='dark'?'Dark mode':'Light mode';
    themeToggle.setAttribute('aria-label',`Switch to ${nextTheme} theme`);
  }
};

let savedTheme=null;
try{
  savedTheme=localStorage.getItem(themeKey);
}catch(error){
  console.warn('Theme preference could not be loaded from local storage.',error);
}
applyTheme(savedTheme==='dark'||savedTheme==='light'?savedTheme:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'));

if(nav){
  const themeToggle=document.createElement('button');
  themeToggle.className='theme-toggle';
  themeToggle.type='button';
  themeToggle.addEventListener('click',()=>{
    const nextTheme=document.documentElement.dataset.theme==='dark'?'light':'dark';
    applyTheme(nextTheme);
    try{
      localStorage.setItem(themeKey,nextTheme);
    }catch(error){
      console.warn('Theme preference could not be saved to local storage.',error);
    }
  });
  nav.parentElement.append(themeToggle);
  applyTheme(document.documentElement.dataset.theme);

  const currentPage=location.pathname.split('/').pop()||'index.html';
  nav.querySelectorAll('a[href$=".html"]').forEach(link=>{
    const isCurrent=link.getAttribute('href')===currentPage;
    link.classList.toggle('active',isCurrent);
    if(isCurrent)link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
}

if(toggle&&nav){
  const closeMenu=()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');};
  nav.id='main-navigation';
  toggle.setAttribute('aria-controls',nav.id);

  toggle.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&nav.classList.contains('open')){
      closeMenu();
      toggle.focus();
    }
  });
  document.addEventListener('click',event=>{
    if(nav.classList.contains('open')&&!nav.contains(event.target)&&!toggle.contains(event.target)){
      closeMenu();
    }
  });
  const desktopQuery=window.matchMedia('(min-width: 901px)');
  const resetDesktopMenu=event=>{
    if(event.matches)closeMenu();
  };
  if(desktopQuery.addEventListener)desktopQuery.addEventListener('change',resetDesktopMenu);
  else desktopQuery.addListener(resetDesktopMenu);
}
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
