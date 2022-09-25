import {render, screen, cleanup} from '@testing-library/react'
import renderer from 'react-test-renderer'
import Homepage from '../Screen/homepage';
test('should render Homepage not logged in component', () => {
    render(<Homepage/>)
    const todoElement = screen.getByTestId('homepage');
    expect(todoElement).toBeInTheDocument();
    expect(todoElement).toHaveTextContent('First, create an acct and login');
    expect(todoElement).toContainHTML('<div data-testid="homepage"><p class="homepage-not-logged-in"> First, create an acct and login </p></div>');
})

