// ── Away message rotator ──
function buildAwayPool() {
  const now = new Date();
  const tz = 'America/New_York';
  const fmt = (opts) => new Intl.DateTimeFormat('en-US', { ...opts, timeZone: tz }).format(now);

  const hour    = parseInt(fmt({ hour: 'numeric', hour12: false }));
  const minute  = parseInt(fmt({ minute: '2-digit' }));
  const day     = fmt({ weekday: 'long' });

  const isSleepTime    = hour > 21 || (hour === 21 && minute >= 30);
  const isBandPractice = day === 'Thursday' && hour >= 18;
  const isDinner       = hour >= 18 && hour < 20;
  const isMorning      = hour >= 6  && hour < 8;

  if (isSleepTime) return [
    "away message: sleepingggg because it's after 9:30pm EST and I have a toddler",
  ];

  if (isBandPractice) return [
    "away message: sharing my latest song idea at band practice",
    "away message: learning hard harmonies/hoping I get the easiest part",
  ];

  const pool = [
    "away message: doing nothing",
    "away message: wondering what Esther Perel would do",
    "away message: starting the group chat we desperately need",
    "away message: optimizing my Do Not Disturb settings",
    "away message: honing my craft at Scattergories",
    "away message: reading a romance novel instead of doing what I'm supposed to be doing",
    "away message: successfully avoiding finding out how hot dogs are made; don't ruin it for me",
    "away message: texting friends to see who can come for a walk & talk with me during the work day",
    "away message: checking out a hefty stack of books from the library about whatever I'm curious about this week",
    "away message: brainstorming with a stack of rainbow sticky notes",
    "away message: listening to a whole album on vinyl, no skips",
    "away message: learning one more chord on ukulele",
    "away message: re-watching Heated Rivalry",
    "away message: pretending Blockbuster is still a thing by watching a movie on DVD",
    "away message: daydreaming about running an indie bookstore",
    "away message: searching for the best pizza in Boston",
  ];

  if (isDinner)  pool.push("away message: testing out a new conversation card deck at dinner");
  if (isMorning) {
    pool.push("away message: writing morning pages a la Julia Cameron (jk cleaning my toddler's oatmeal off the floor)");
    pool.push("away message: attempting to meditate for ten minutes and inevitably being interrupted by my very cute baby");
  }

  return pool;
}

let awayPool = buildAwayPool();
let currentMessage = 0;
const awayEl = document.getElementById('away-text');

// Set initial message immediately based on time
if (awayEl) awayEl.textContent = awayPool[0];

function rotateAwayMessage() {
  if (!awayEl) return;
  awayEl.style.opacity = '0';
  setTimeout(() => {
    // Rebuild pool each rotation so time-based messages stay accurate
    awayPool = buildAwayPool();
    currentMessage = (currentMessage + 1) % awayPool.length;
    awayEl.textContent = awayPool[currentMessage];
    awayEl.style.opacity = '1';
  }, 400);
}

// Rotate every 6 seconds
setInterval(rotateAwayMessage, 6000);

// ── Newsletter → Flodesk ──
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('.newsletter-btn');
    btn.textContent = 'sending…';
    btn.disabled = true;

    try {
      const res = await fetch(this.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(this)),
      });
      if (res.ok) {
        document.getElementById('newsletter-form-wrap').style.display = 'none';
        document.getElementById('newsletter-success').style.display = 'block';
      } else {
        throw new Error();
      }
    } catch {
      document.getElementById('newsletter-error').style.display = 'block';
      btn.textContent = 'I\'m in →';
      btn.disabled = false;
    }
  });
}
