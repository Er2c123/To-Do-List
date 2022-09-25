import {render, screen, cleanup} from '@testing-library/react'
import renderer from 'react-test-renderer'
import Registration from '../Screen/Registration';
test('should render Registration component', () => {
    render(<Registration/>);
    const todoElement = screen.getByTestId('Registration');
    expect(todoElement).toBeInTheDocument();
    expect(todoElement).toHaveTextContent('Registration form');
})

