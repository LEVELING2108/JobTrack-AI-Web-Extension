import { test, describe } from 'node:test';
import assert from 'node:assert';
import { normalizeJobUrl } from './urlNormalizer.ts';

describe('Job URL Normalizer Tests', () => {
  test('should strip UTM and tracking query parameters', () => {
    const raw = 'https://example.com/job/123?utm_source=linkedin&utm_medium=cpc&utm_campaign=spring2026';
    const normalized = normalizeJobUrl(raw);
    assert.strictEqual(normalized, 'https://example.com/job/123');
  });

  test('should normalize LinkedIn search currentJobId to canonical view URL', () => {
    const raw = 'https://www.linkedin.com/jobs/search/?currentJobId=4012345678&keywords=react';
    const normalized = normalizeJobUrl(raw);
    assert.strictEqual(normalized, 'https://www.linkedin.com/jobs/view/4012345678');
  });

  test('should normalize Indeed vjk parameter to canonical viewjob URL', () => {
    const raw = 'https://www.indeed.com/jobs?q=software+engineer&l=remote&vjk=abc12345def';
    const normalized = normalizeJobUrl(raw);
    assert.strictEqual(normalized, 'https://www.indeed.com/viewjob?jk=abc12345def');
  });

  test('should strip URL hashes and trailing slashes', () => {
    const raw = 'https://careers.company.com/openings/backend-engineer/#apply';
    const normalized = normalizeJobUrl(raw);
    assert.strictEqual(normalized, 'https://careers.company.com/openings/backend-engineer');
  });
});
