const fs = require('fs');
const sql = fs.readFileSync('docs/database/sync_themes.sql', 'utf8');

// The SQL contains a list of tuples like ('minimal01', 'Cinematic...', ...)
const matches = sql.match(/^\('([^']+)',/gm);
if (!matches) {
  console.log("No values found in SQL script.");
} else {
  const ids = matches.map(m => m.match(/'([^']+)'/)[1]);
  const dupes = ids.filter((id, index) => ids.indexOf(id) !== index);
  console.log("Total IDs:", ids.length);
  console.log("Duplicates in SQL:", dupes);
}
