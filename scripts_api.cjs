const fs = require('fs');
const j = JSON.parse(fs.readFileSync('api_events.json', 'utf8'));
for (const e of j.events) {
  const d = (e.description || '').replace(/\n/g, ' ').slice(0, 60);
  const p = (e.prizePool || 'NULL').replace(/\n/g, ' ').slice(0, 60);
  console.log('ID:', e.id);
  console.log('  DESC :', d);
  console.log('  PRIZE:', p);
}
