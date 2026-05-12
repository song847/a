import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';
import React from 'react';

describe('App', () => {
  it('renders login prompt', () => {
    render(<App />);
    expect(screen.getByText('Login with 6-Digit ID')).toBeDefined();
  });
});
