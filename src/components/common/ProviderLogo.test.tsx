import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProviderLogo from './ProviderLogo';

// Mock the SvgIcon component from Material-UI
vi.mock('@mui/material', () => ({
  SvgIcon: ({ children, ...props }) => (
    <svg data-testid="mui-svg-icon" {...props}>
      {children}
    </svg>
  ),
}));

describe('ProviderLogo', () => {
  it('renders OpenAI logo when provider is openai', () => {
    render(<ProviderLogo provider="openai" size={24} />);

    // Check that the SvgIcon is rendered
    const logo = screen.getByTestId('mui-svg-icon');
    expect(logo).toBeInTheDocument();

    // Check that it has the OpenAI path
    const path = logo.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute('fill')).toBe('currentColor');
    expect(path?.getAttribute('d')).toContain('M22.2819 9.8211');
  });

  it('renders GitHub logo when provider is github', () => {
    render(<ProviderLogo provider="github" size={24} />);

    // Check that the SvgIcon is rendered
    const logo = screen.getByTestId('mui-svg-icon');
    expect(logo).toBeInTheDocument();

    // Check that it has the GitHub path
    const path = logo.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute('fill')).toBe('currentColor');
    expect(path?.getAttribute('d')).toContain('M12 .297c-6.63 0-12 5.373-12 12');
  });

  it('renders a generic logo when provider is unknown', () => {
    render(<ProviderLogo provider="unknown" size={24} />);

    // Check that the SvgIcon is rendered
    const logo = screen.getByTestId('mui-svg-icon');
    expect(logo).toBeInTheDocument();

    // Check that it has the generic path
    const path = logo.querySelector('path');
    expect(path).toBeInTheDocument();
    expect(path?.getAttribute('fill')).toBe('currentColor');
    expect(path?.getAttribute('d')).toContain('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10');
  });

  it('passes size prop to SvgIcon', () => {
    render(<ProviderLogo provider="openai" size={48} />);

    // Check that the size prop is passed to SvgIcon
    const logo = screen.getByTestId('mui-svg-icon');
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute('size')).toBe('48');
  });

  it('passes className prop to SvgIcon', () => {
    render(<ProviderLogo provider="openai" className="custom-class" />);

    // Check that the className prop is passed to SvgIcon
    const logo = screen.getByTestId('mui-svg-icon');
    expect(logo).toBeInTheDocument();
    expect(logo.getAttribute('class')).toContain('custom-class');
  });
});
