const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function computePhaseInfo(day, cycleLength, periodDuration) {
  if (day <= periodDuration) {
    return { key: 'menstrual-rest', title: 'Menstrual', desc: 'Rest and gentle movement', fertility: 'Low' };
  }
  if (day <= 13) {
    return { key: 'follicular-energy', title: 'Follicular', desc: 'Increasing energy and focus', fertility: 'Medium' };
  }
  if (day >= 14 && day <= 16) {
    return { key: 'ovulatory-bloom', title: 'Ovulatory', desc: 'Peak energy and fertility', fertility: 'High' };
  }
  return { key: 'luteal-slow', title: 'Luteal', desc: 'Preparing for next period', fertility: 'Low' };
}

app.post('/api/insights', (req, res) => {
  const profile = req.body.profile || req.body;
  const today = new Date();
  let lastPeriod = profile.lastPeriodDate ? new Date(profile.lastPeriodDate) : new Date(Date.now() - (profile.cycleLength || 28) * MS_PER_DAY);
  if (isNaN(lastPeriod)) lastPeriod = new Date(Date.now() - (profile.cycleLength || 28) * MS_PER_DAY);

  const cycleLength = profile.cycleLength || 28;
  const periodDuration = profile.periodDuration || 5;

  const diffDays = Math.floor((today - lastPeriod) / MS_PER_DAY);
  const cycleDay = ((diffDays % cycleLength) + cycleLength) % cycleLength + 1;
  const daysUntilNextPeriod = cycleLength - cycleDay + 1;

  const phase = computePhaseInfo(cycleDay, cycleLength, periodDuration);

  // Simple, safe mocked suggestions (customize further as needed)
  const isVegetarian = (profile.dietaryRestrictions || []).includes('vegetarian');
  const hasPCOS = !!profile.hasPCOS;

  const nutritionItems = isVegetarian
    ? ['Legumes', 'Tofu', 'Quinoa', 'Leafy greens']
    : ['Fatty fish', 'Lean poultry', 'Whole grains', 'Leafy greens'];

  const workoutItems = cycleDay <= periodDuration
    ? ['Gentle yoga', 'Walking']
    : phase.key === 'ovulatory-bloom'
    ? ['HIIT', 'Strength training']
    : ['Moderate cardio', 'Pilates'];

  const nutritionWhy = hasPCOS
    ? 'Focus on low-glycemic whole foods to help insulin sensitivity.'
    : 'Support hormonal balance with protein, fiber and healthy fats.';

  res.json({
    currentPhase: phase.title,
    cycleDay,
    daysUntilNextPeriod,
    phaseTitle: phase.title,
    phaseDescription: phase.desc,
    fertilityStatus: phase.fertility,
    nutritionFocus: isVegetarian ? 'Plant-forward protein + iron' : 'Balanced protein + healthy fats',
    nutritionItems,
    nutritionWhy,
    workoutFocus: 'Adjust intensity with phase',
    workoutItems,
    workoutWhy: 'Match energy to hormonal phase to support recovery and performance.',
    phaseImageKey: phase.key
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Mock insights server running on http://localhost:${PORT}`);
});
