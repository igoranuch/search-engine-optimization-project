/*
 * SEO-ПОЯСНЕННЯ: Семантичний HTML — <footer>
 *
 * Що: <footer> — семантичний тег для підвалу сайту.
 * Навіщо: Допомагає пошуковим системам відрізнити основний контент від
 *   допоміжної інформації (копірайт, посилання на політику тощо).
 */

export default function Footer() {
  return (
    <footer>
      <p>© {new Date().getFullYear()} GearForge. All rights reserved.</p>
    </footer>
  );
}
