import {render, screen, cleanup} from '@testing-library/react'
import ChangePassword from '../Screen/ChangePassword';
import renderer from 'react-test-renderer'
test('should render Change Password not logged in component', () => {
    render(<ChangePassword/>);
    const todoElement = screen.getByTestId('todo-1');
    expect(todoElement).toBeInTheDocument();
    expect(todoElement).toHaveTextContent('Must be logged in to change password.');
    expect(todoElement).toContainHTML('<div data-testid="todo-1"><div class="change-password-form">Must be logged in to change password.</div></div>');
    
})

