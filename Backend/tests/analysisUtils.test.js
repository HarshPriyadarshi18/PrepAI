import test from 'node:test';
import assert from 'node:assert/strict';
import { parseJsonResponse, buildAnalyticsSummary } from '../src/utils/analysisUtils.js';

test('parseJsonResponse strips code fences and parses JSON', () => {
  const raw = '```json\n{"atsScore": 82}\n```';
  assert.deepEqual(parseJsonResponse(raw), { atsScore: 82 });
});

test('buildAnalyticsSummary creates percentage-based metrics', () => {
  const analysis = {
    atsScore: 82,
    missingKeywords: ['React', 'Node.js'],
    weakBulletPoints: ['Built a website'],
    formattingSuggestions: ['Add metrics'],
    projectSuggestions: ['Show impact'],
  };

  const summary = buildAnalyticsSummary(analysis);

  assert.equal(summary.skillsScore, 80);
  assert.equal(summary.projectsScore, 70);
  assert.equal(summary.experienceScore, 75);
  assert.equal(summary.formattingScore, 65);
  assert.equal(summary.readabilityScore, 70);
  assert.equal(summary.keywordCoverage, 60);
});

test('parseJsonResponse handles extra text around JSON', () => {
  const raw = 'Here is the result:\n```json\n{"atsScore": 88}\n```\nThanks!';
  assert.deepEqual(parseJsonResponse(raw), { atsScore: 88 });
});
