import { expect, } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';

export default async function openMenuAndGetButton(user, buttonName) {
    const moreActionsButton = screen.getByRole('button', {
        name: /more actions/i,
    });

    await user.click(moreActionsButton);

    const menu = await screen.findByRole('menu', { hidden: true });
    menu.style.display = 'block';

    await waitFor(() => expect(screen.getByRole('menu')).toBeVisible());

    const button = within(menu).getByRole('menuitem', { name: buttonName });

    return { menu, button };
}
