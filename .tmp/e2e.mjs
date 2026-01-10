import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';
(async ()=>{
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Opening admin-import to create demo accounts...');
  await page.goto(`${BASE}/admin-import`, { waitUntil: 'networkidle' });
  // Click the Create Demo Accounts button to be explicit
  const createBtn = page.locator('button', { hasText: 'Create Demo Accounts' });
  if (await createBtn.count() > 0) {
    await createBtn.click();
    await page.waitForTimeout(800);
  }

  console.log('Navigating to login and signing in as demo student');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.fill('input[name="email"]', 'bjv.jkv@gmail.com');
  await page.fill('input[name="password"]', 'VonZymon');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/student/dashboard', { timeout: 5000 });
  console.log('Logged in and on student dashboard');

  // Attempt to start the quiz
  const attemptBtn = page.locator('text=Attempt Quiz');
  if (await attemptBtn.count() > 0) {
    await attemptBtn.first().click();
    await page.waitForURL('**/student/quiz', { timeout: 5000 });
    console.log('On quiz page');

    // Answer questions by pressing '1' and clicking next
    for (let i=0;i<10;i++){
      await page.keyboard.press('1');
      // small wait for UI update
      await page.waitForTimeout(150);
      // if last question, click Submit Quiz, otherwise Next Question
      const isLast = await page.locator('text=Submit Quiz').count() > 0;
      if (isLast) {
        await page.click('text=Submit Quiz');
        // Confirm submit in modal
        await page.waitForSelector('text=Submit', { timeout: 2000 });
        await page.click('text=Submit');
        break;
      } else {
        await page.click('text=Next Question');
      }
      await page.waitForTimeout(200);
    }

    // Wait for navigation to result pending
    await page.waitForURL('**/student/result-pending', { timeout: 5000 });
    console.log('Submission flow completed, on result pending page');

    // Check IndexedDB for pending submissions
    const submissions = await page.evaluate(async ()=>{
      return new Promise((res, rej)=>{
        const req = indexedDB.open('quiz-app-db');
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction('submissions','readonly');
          const store = tx.objectStore('submissions');
          const getAll = store.getAll();
          getAll.onsuccess = () => res(getAll.result);
          getAll.onerror = () => res([]);
        };
        req.onerror = () => res([]);
      });
    });

    console.log('IndexedDB submissions count:', submissions.length);
    if (submissions.length > 0) console.log('E2E check: queued submission found.');
    else console.warn('E2E check: no submissions found in IndexedDB.');
  } else {
    console.warn('No Attempt Quiz button found on dashboard; skipping quiz run.');
  }

  await browser.close();
  process.exit(0);
})();
