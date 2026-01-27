function getOrientation() {
  if (screen && screen.orientation && screen.orientation.type) {
    return screen.orientation.type;
  }
  return 'landscape';
}

export function fixViewport(breakpoint = 375) {
  const viewport = document.querySelector('meta[name="viewport"]');
  const mq = window.matchMedia(`(min-width: ${(breakpoint + 1) / 16}em)`);

  function handle(match) {
    const contentValue = match ? 'width=device-width,initial-scale=1.0,maximum-scale=1.0' : `width=375`;
    viewport?.setAttribute('content', contentValue);
  }

  mq.addEventListener('change', () => handle(mq.matches));
  handle(mq.matches);

  window.addEventListener('orientationchange', () => {
    if (getOrientation().includes('landscape')) handle(true);
    if (mq.matches && getOrientation().includes('portrait')) handle(true);
    if (!mq.matches && getOrientation().includes('portrait')) handle(false);
  });
}

export function reloadAtResized() {
  const mq = window.matchMedia('(min-width: 40.0625em)');
  const handle = q => {
    if (q.matches) {
      window.location.reload();
    } else {
      window.location.reload();
    }
  };
  mq.addEventListener('change', handle);
}
